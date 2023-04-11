# generate unit test for app.crud.SettingCRUD
import asyncio
from datetime import datetime
import pytest
from unittest import mock
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from app.crud import IncomingFileCRUD, SettingCRUD, WhisperTaskCRUD
from app.model import Setting

# from app.db import Base
from app.model import Base
from app.constraints import TASK_STATUS_FAILED, TASK_STATUS_IN_PROGRESS
from app.model import IncomingFile, WhisperTask



@pytest.mark.asyncio
async def test_setting_crud(async_session):
    crud = SettingCRUD()

    # test create method
    setting = Setting(values='{"foo": "bar"}')
    await crud.create(async_session, setting)

    # test checkAndGet method
    assert await crud.checkAndGet(async_session) == setting

    # test get_valueJsonObj method
    assert await crud.get_valueJsonObj(async_session) == {"foo": "bar"}

    # test get_value method
    assert await crud.get_value(async_session, "foo") == "bar"

    # test set_value method
    await crud.set_value(async_session, "foo", "baz")
    assert await crud.get_value(async_session, "foo") == "baz"


# test WhisperTaskCRUD
@pytest.mark.asyncio
async def test_whisper_task_crud(async_session):
    crud = WhisperTaskCRUD()

    # test create method
    whisper_task = WhisperTask(
        filename="foo.mp4",
        fullpath="/bar/foo.mp4",
        status=TASK_STATUS_IN_PROGRESS,
        message="",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    whisper_task = await crud.create(async_session, whisper_task)

    # test get method
    t = await crud.get(async_session, whisper_task.id)
    assert t.id == whisper_task.id

    # test get_by_status method
    t = await crud.get_by_status(async_session, TASK_STATUS_IN_PROGRESS)
    assert t == [whisper_task]

    del_id = t[0].id
    await crud.delete(async_session, del_id)
    t = await crud.get(async_session, del_id)
    assert t is None, "t: %s" % t


# test IncomingFileCRUD
@pytest.mark.asyncio
async def test_incoming_file_crud(async_session):
    crud = IncomingFileCRUD()

    # test create method
    incoming_file = IncomingFile(
        filename="foo.mp4",
        fullpath="/bar/foo.mp4",
        status=TASK_STATUS_IN_PROGRESS,
        message="",
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    await crud.create(async_session, incoming_file)

    # test get method
    t = await crud.get(async_session, incoming_file.id)
    assert t.id == incoming_file.id

    # test update method
    t.status = TASK_STATUS_FAILED
    update_id = t.id
    await crud.update(async_session, incoming_file)
    t = await crud.get(async_session, update_id)
    assert t.status == TASK_STATUS_FAILED

    # test delete method
    del_id = t.id
    await crud.delete(async_session, del_id)
    t = await crud.get(async_session, del_id)
    assert t is None, "t: %s" % t
