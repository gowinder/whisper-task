import os
import pytest
from celery.result import AsyncResult
from app.task import celery, celery_scan_task
import asyncio
from app.model import Setting
from app.crud import SettingCRUD, WhisperTaskCRUD
from app.constraints import SCAN_FILES_KEY
from app.cache import get_redis
from unittest.mock import AsyncMock, patch

from app.constraints import TASK_STATUS_IN_PROGRESS
from app.task import celery_scheduler_task
from app.task import scan_task, scheduler_task


@pytest.fixture(scope="module")
def celery_app_module():
    return celery


@pytest.fixture(scope="module")
def celery_worker_parameters():
    return {
        "queues": ("celery",),
        "loglevel": "INFO",
    }


# @patch(
#     "app.db.async_session",
#     new_callable=AsyncMock,
# )
@pytest.mark.asyncio
async def test_celery_scan_task(async_session, celery_app_module):
    # generate code to update Setting using settingCrud, set root_dir to a ~/Downloads/
    # set include_exts to [".mp4,.mkv"], set rescan to True
    # then run celery_scan_task
    settingCrud = SettingCRUD()
    setting = Setting(values='{"foo": "bar"}')
    await settingCrud.create(async_session, setting)
    t = await settingCrud.checkAndGet(async_session)
    assert t is not None

    settingObj = await settingCrud.get_valueJsonObj(async_session)
    settingObj["root_dir"] = os.getenv("TESTING_SCAN_ROOT_DIR")
    settingObj["rescan"] = True
    settingObj["include_exts"] = [".mp4", ".mkv"]
    await settingCrud.set_valueJsonObj(async_session, settingObj)

    with patch("app.task.async_session", return_value=async_session):
        await scan_task()

        # read redis cache SCAN_FILES_KEY, make sure it has elements
        cache = get_redis()
        assert (await cache.exists(SCAN_FILES_KEY)) == 1
        assert (await cache.zcard(SCAN_FILES_KEY)) > 0
        # log last 10 of SCAN_FILES_KEY
        for i in range(10):
            print(cache.zrange(SCAN_FILES_KEY, 0, 9))

        await scheduler_task()

        whisperTaskCrud = WhisperTaskCRUD()
        whisper_tasks = await whisperTaskCrud.get_by_status(
            async_session, TASK_STATUS_IN_PROGRESS
        )
        assert whisper_tasks is not None
        assert len(whisper_tasks) > 0


# def test_celery_scheduler_task(celery_app_module, async_session):
#     task = celery_scheduler_task.apply_async(args=[1, 2])
#     assert isinstance(task.result, int)
#     assert task.status == "SUCCESS"


# def test_celery_whisper_task(celery_app_module):
#     task = celery_whisper_task.apply_async(args=[1, 2])
#     assert isinstance(task.result, int)
#     assert task.status == "SUCCESS"
