import asyncio
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
from app.db import async_session
from app.crud import SettingCRUD, whisperTaskCrud, incomingFileCrud
import whisper

from app.logger import get_logger


load_dotenv(f'.env.{os.environ.get("FASTAPI_ENV")}')
celery = Celery(
    os.getenv("CELERY_NAME"),
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_BACKEND_URL"),
)

logger = get_logger(__name__)


def get_task_count(task_name: str) -> int:
    inspector = celery.control.inspect()
    active_tasks = inspector.active()
    task_count = 0
    if active_tasks:
        for worker, tasks in active_tasks.items():
            for task in tasks:
                if task["name"] == task_name:
                    task_count += 1

    return task_count


@celery.task
def celery_scan_task():
    asyncio.run(scan_task())


# >>> from celery.task.control import revoke
# >>> revoke(task_id, terminate=True)
async def scan_task():
    logger.info("start scan task")
    async with async_session() as session:
        cache = get_redis()
        settingCrud = SettingCRUD()
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
                    # TODO set stable order score
                    await cache.zadd(SCAN_FILES_KEY, {fullpath: int(time.time())})
                    await cache.lpush(SCAN_LOG_KEY, "Scanned file: " + fullpath)

        logger.info("scan ended")
        return True


@celery.task
def celery_scheduler_task():
    asyncio.run(scheduler_task())


async def scheduler_task():
    logger.info("start scheduler task")
    session = async_session()
    cache = get_redis()
    settingCrud = SettingCRUD()
    settingObj = await settingCrud.get_valueJsonObj(session)

    # Load all whisper tasks that is in progress
    whisper_tasks = await whisperTaskCrud.get_by_status(
        session, TASK_STATUS_IN_PROGRESS
    )

    logger.info("   check need resume task")
    if whisper_tasks and len(whisper_tasks) > 0:
        resume_task = group()
        for record in whisper_tasks:
            record.message = record.message + "task restarted\n"
            await whisperTaskCrud.update(session, record)
            logger.info("   resume task: %d, filename: %s", record.id, record.filename)
            celery.send_task("celery_whisper_task", args=[record.id])

    logger.info("   start new task loop")
    while True:
        # TODO max task count set into setting
        if get_task_count("celery_whisper_task") >= 1:
            # TODO sleep seconds set into setting
            await asyncio.sleep(10)
            continue
        scanned_files = await cache.zrange(SCAN_FILES_KEY, 0, 0, withscores=True)
        if scanned_files and len(scanned_files) > 0:
            fullpath = scanned_files[0][0]
            if await whisperTaskCrud.get_by_fullpath(session, fullpath):
                # already exists
                # TODO need optimize for already exists record to skip in cache
                continue
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
        # result = new_task.apply_async()
        # result.join()


@celery.task
def celery_whisper_task(task_id: int):
    asyncio.run(whisper_task(task_id))


@celery.task
async def whisper_task(task_id: int):
    logger.info("start whisper task: %d", task_id)
    session = async_session()
    record = await whisperTaskCrud.get(session, task_id)
    cmd = await generate_whisper_cmd(session, record)
    logger.debug("whisper task: %d, cmd: %s", task_id, cmd)
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    for output in process.stdout:
        # 更新任务状态（进度、日志等）
        # TODO update task not this fequently
        await update_task_status(
            session, record, TASK_STATUS_IN_PROGRESS, 0.0, output.decode()
        )
    # check process exit code
    exit_code = process.wait()
    if exit_code == 0:
        await update_task_status(session, record, TASK_STATUS_DONE, 100.0, "done\n")
    else:
        await update_task_status(session, record, TASK_STATUS_FAILED, 100.0, "failed\n")


# TODO need generate unit test for this function
async def generate_whisper_cmd(session, whisper_task_record) -> List[str]:
    cmd = [
        "whisper",
    ]
    settingCrud = SettingCRUD()
    settingObj = await settingCrud.get_valueJsonObj(session)
    if settingObj["language"]:
        cmd.append("--language")
        cmd.append(settingObj["language"])
    if settingObj["model"]:
        cmd.append("--model")
        cmd.append(settingObj["model"])
    if settingObj["translate"]:
        cmd.append("--task")
        cmd.append("translate")
    if settingObj["no_speech_threshold"]:
        cmd.append("--no_speech_threshold")
        cmd.append(settingObj["no_speech_threshold"])
    if settingObj["logprob_threshold"]:
        cmd.append("--logprob_threshold")
        cmd.append(settingObj["logprob_threshold"])
    if settingObj["compression_ratio_threshold"]:
        cmd.append("--compression_ratio_threshold")
        cmd.append(settingObj["compression_ratio_threshold"])

    cmd.append(whisper_task_record.filename)

    return cmd


async def update_task_status(
    session, record: WhisperTask, status: int, progress: float, log: str
):
    record.status = status
    record.progress = progress
    record.message = record.message + log
    session.add(record)
    await session.commit()
