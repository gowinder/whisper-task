import asyncio
from datetime import datetime, timedelta
from typing import List
from celery import Celery, group
import os
import subprocess
import time
from dotenv import load_dotenv
from app.cache import get_redis
from app.constraints import (
    SCAN_FILES_KEY,
    SCAN_LOG_KEY,
    TASK_STATUS_DONE,
    TASK_STATUS_FAILED,
    TASK_STATUS_IN_PROGRESS,
)
from app.model import WhisperTask
from app.db import async_session, engine
import whisper

from app.logger import get_logger
from app.whisper import do_whisper
from app.crud import SettingCRUD, IncomingFileCRUD, WhisperTaskCRUD
from app.model import IncomingFile


load_dotenv(f'.env.{os.environ.get("FASTAPI_ENV")}')
celery = Celery(
    os.getenv("CELERY_NAME"),
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_BACKEND_URL"),
)

logger = get_logger(__name__)


def get_task_count(task_name: str) -> int:
    """get current task count by task name

    :param task_name: task name
    :type task_name: str
    :return: current running task count by name
    :rtype: int
    """
    inspector = celery.control.inspect()
    active_tasks = inspector.active()
    task_count = 0
    if active_tasks:
        for worker, tasks in active_tasks.items():
            for task in tasks:
                if task["name"] == task_name:
                    task_count += 1

    reserved_tasks = inspector.reserved()
    if reserved_tasks:
        for worker, tasks in reserved_tasks.items():
            for task in tasks:
                if task["name"] == task_name:
                    task_count += 1

    return task_count


def check_whisper_corouting(settingObj) -> bool:
    """check current whisper task count
        corouting in settingObj, if not, use default 1
    :param settingObj: setting obj
    :type settingObj: _type_
    :return: True if current task count is less than corouting, else False
    :rtype: bool
    """
    corouting = 1
    if "corouting" in settingObj:
        corouting = settingObj["corouting"]
    task_count = get_task_count("celery_whisper_task")
    if task_count >= corouting:
        return False
    return True


@celery.task(name="celery_scan_task")
def celery_scan_task():
    logger.info("start scan task")
    loop = asyncio.new_event_loop()
    # asyncio.set_event_loop(loop)
    loop.run_until_complete(scan_task())
    loop.close()


# >>> from celery.task.control import revoke
# >>> revoke(task_id, terminate=True)
async def scan_task():
    logger.info("start scan task")
    while True:
        async with async_session() as session:
            cache = get_redis()
            settingCrud = SettingCRUD()
            whisperTaskCrud = WhisperTaskCRUD()
            incomingFileCrud = IncomingFileCRUD()
            # Recursive scan root dir for all file types in include_exts
            settingObj = await settingCrud.get_valueJsonObj(session)

            await cache.zrange(SCAN_FILES_KEY, 0, -1, withscores=True)
            if settingObj["rescan"]:
                logger.info("start rescan")
                await settingCrud.set_value(session, "rescan", False)
                await cache.delete(SCAN_FILES_KEY)

            logger.info("scan root dir: %s", settingObj["root_dir"])
            for root, _, files in os.walk(settingObj["root_dir"]):
                # print("scan root: ", root, ", files: ", files)
                for file in files:
                    # print("scaned file: ", file)
                    if file.endswith(tuple(settingObj["include_exts"])):
                        logger.info("matched file: %s", file)
                        fullpath = os.path.join(root, file)
                        # check if file is already in db if rescan is not set
                        if (
                            await whisperTaskCrud.get_by_fullpath(session, fullpath)
                            is not None
                        ):
                            logger.debug(
                                f"file already in whisper_task: {fullpath}, skip"
                            )
                            continue
                        if (
                            await incomingFileCrud.get_by_fullpath(session, fullpath)
                            is not None
                        ):
                            logger.debug(
                                f"file already in incoming_file: {fullpath}, skip"
                            )
                            continue
                        # TODO set stable order score
                        await cache.zadd(SCAN_FILES_KEY, {fullpath: int(time.time())})
                        scanlog = f"[{datetime.now()}] scanned file: {fullpath}"
                        await cache.lpush(SCAN_LOG_KEY, scanlog)

            logger.info("scan ended")
            await cache.close()
            # sleep seconds read from setting
            settingObj = await settingCrud.get_valueJsonObj(session)
            scan_interval = 60
            if "scan_interval" in settingObj:
                scan_interval = settingObj["scan_interval"]
            await asyncio.sleep(scan_interval)


@celery.task(name="celery_scheduler_task")
def celery_scheduler_task():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(scheduler_task())
    loop.close()


async def scheduler_task():
    logger.info("start scheduler task")
    session = async_session()
    cache = get_redis()
    settingCrud = SettingCRUD()
    whisperTaskCrud = WhisperTaskCRUD()
    incomingFileCrud = IncomingFileCRUD()
    settingObj = await settingCrud.get_valueJsonObj(session)

    # Load all whisper tasks that is in progress
    need_resume_whisper_tasks = await whisperTaskCrud.get_by_status(
        session, TASK_STATUS_IN_PROGRESS
    )

    logger.info("   check need resume task")
    if need_resume_whisper_tasks and len(need_resume_whisper_tasks) > 0:
        resume_task = group()
        for record in need_resume_whisper_tasks:
            record.message = (
                record.message + "task restarted\n"
                if record.message is not None
                else "task restarted\n"
            )
            await whisperTaskCrud.update(session, record)
            logger.info("   resume task: %d, filename: %s", record.id, record.filename)
            celery.send_task("celery_whisper_task", args=[record.id])

    logger.info("   start new task loop")
    while True:
        # remove old whisper_task
        # get whisper_task.status == TASK_STATUS_DONE and update_date is more than 1 day
        await whisperTaskCrud.delete_completed_by_time(
            session, timedelta(days=1).seconds
        )

        # TODO check failed task

        scanned_files = await cache.zrange(SCAN_FILES_KEY, 0, 0, withscores=True)
        if scanned_files and len(scanned_files) > 0:
            fullpath = scanned_files[0][0].decode("utf-8")
            # check whisper task record
            whisperTaskRecord = await whisperTaskCrud.get_by_fullpath(session, fullpath)
            if whisperTaskRecord is not None:
                # already exists
                logger.debug(
                    "  skip task by whisper_task for file: %s, fullpath: %s",
                    whisperTaskRecord.filename,
                    whisperTaskRecord.fullpath,
                )
                await cache.zrem(SCAN_FILES_KEY, fullpath)
                continue
            # check incoming file record
            incomingFileRecord = await incomingFileCrud.get_by_fullpath(
                session, fullpath
            )
            if incomingFileRecord is not None:
                logger.debug(
                    "  skip task by incoming_file for file: %s, fullpath: %s",
                    fullpath,
                    fullpath,
                )
                await cache.zrem(SCAN_FILES_KEY, fullpath)
                continue

            if not check_whisper_corouting(settingObj):
                logger.info("   corouting limit, wait for next loop")
            else:
                filename = os.path.basename(fullpath)
                logger.debug(
                    "  create new task for file: %s, fullpath: %s",
                    filename,
                    fullpath,
                )
                record = WhisperTask(
                    filename=filename,
                    fullpath=fullpath,
                    progress=0.0,
                    status=TASK_STATUS_IN_PROGRESS,
                    enabled=True,
                    message="tast created\n",
                )
                record = await whisperTaskCrud.create(session, record)
                record_id = record.id
                # new_task |= celery_whisper_task.s(record.id)
                logger.info("   start new task: %d, filename: %s", record_id, filename)
                celery.send_task("celery_whisper_task", args=[record_id])

        # read sleep seconds from setting
        settingObj = await settingCrud.get_valueJsonObj(session)
        scheduler_interval = 60
        if "scheduler_interval" in settingObj:
            scheduler_interval = settingObj["scheduler_interval"]
        await asyncio.sleep(scheduler_interval)


@celery.task(name="celery_whisper_task")
def celery_whisper_task(task_id: int):
    logger.info(f"celery_whisper_taskk: {task_id}")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(whisper_task(task_id))
    loop.close()


async def whisper_task(task_id: int):
    logger.info("start whisper task: %d", task_id)
    async with async_session() as session:
        whisperTaskCrud = WhisperTaskCRUD()
        record = await whisperTaskCrud.get(session, task_id)
        if record is None:
            logger.error(f"whisper task: {task_id}, task_id not found")
            return

        await update_task_status(
            session, record, TASK_STATUS_IN_PROGRESS, 0.0, "task started\n"
        )
        setting = await SettingCRUD().get_valueJsonObj(session)
        await do_whisper(setting, record)

    logger.info("end whisper task: %d", task_id)


async def update_task_status(
    session, record: WhisperTask, status: int, progress: float, log: str
):
    record.status = status
    record.progress = progress
    record.message = record.message + log
    session.add(record)
    await session.commit()
