from datetime import datetime, timedelta
import os
from typing import List
import simplejson as json
from sqlalchemy import select
import sqlalchemy
from app.model import Setting, WhisperTask, IncomingFile
from app.db import async_session
from dotenv import load_dotenv

from app.constraints import TASK_STATUS_DONE

load_dotenv(f'.env.{os.environ.get("FASTAPI_ENV")}')


# CRUD classes for Setting, WhisperTask, and IncomingFile
class SettingCRUD:
    async def create(self, session, setting):
        session.add(setting)
        await session.commit()

    async def checkAndGet(self, session):
        # get first record in Setting table, if not exsits, generate one
        setting = (await session.execute(select(Setting).limit(1))).scalar()
        if setting is None:
            default_values = os.getenv("SETTING_DEFAULT")
            setting = Setting(values=default_values)
            await self.create(session, setting)
        return setting

    async def get_valueJsonObj(self, session):
        setting = await self.checkAndGet(session)
        values = setting.values
        valueObj = json.loads(values)
        return valueObj

    async def set_valueJsonObj(self, session, obj):
        setting = await self.checkAndGet(session)
        setting.values = json.dumps(obj)
        await session.commit()
        await session.refresh(setting)
        return setting

    async def get_value(self, session, name):
        obj = await self.get_valueJsonObj(session)
        return obj[name]

    async def set_value(self, session, name, value):
        obj = await self.get_valueJsonObj(session)
        obj[name] = value
        setting = await self.checkAndGet(session)
        setting.values = json.dumps(obj)
        await session.commit()
        await session.refresh(setting)
        return setting


class WhisperTaskCRUD:
    async def get(self, session, id) -> WhisperTask | None:
        setting = await session.execute(
            select(WhisperTask).filter(WhisperTask.id == id).limit(1)
        )

        return setting.scalar_one_or_none()

    async def filter(self, session, filter) -> List[WhisperTask]:
        result = None
        if filter.status is None:
            sql = (
                select(WhisperTask)
                .order_by(WhisperTask.created_date.desc())
                .offset(filter.page * filter.count)
                .limit(filter.count)
            )

            result = await session.execute(sql)
        else:
            sql = (
                select(WhisperTask)
                .where(WhisperTask.status == filter.status)
                .order_by(WhisperTask.created_date.desc())
                .offset(filter.page * filter.count)
                .limit(filter.count)
            )

            result = await session.execute(sql)

        return result.scalars().fetchall()

    async def get_by_status(self, session, status) -> List[WhisperTask]:
        return (
            (
                await session.execute(
                    select(WhisperTask).filter(WhisperTask.status == status)
                )
            )
            .scalars()
            .all()
        )

    async def get_by_fullpath(self, session, fullpath) -> WhisperTask | None:
        task = await session.execute(
            select(WhisperTask).filter(WhisperTask.fullpath == fullpath).limit(1)
        )

        return task.scalar_one_or_none()

    async def create(self, session, whisper_task: WhisperTask) -> WhisperTask:
        whisper_task.created_at = datetime.now()
        whisper_task.updated_at = datetime.now()
        session.add(whisper_task)
        await session.commit()
        await session.refresh(whisper_task)
        return whisper_task

    async def update(self, session, updated_whisper_task: WhisperTask) -> WhisperTask:
        updated_whisper_task.updated_at = datetime.now()
        session.add(updated_whisper_task)
        await session.commit()
        await session.refresh(updated_whisper_task)
        return updated_whisper_task

    async def delete(self, session, whisper_task_id: int):
        stmt = sqlalchemy.delete(WhisperTask).where(WhisperTask.id == whisper_task_id)
        await session.execute(stmt)
        await session.commit()

    async def delete_completed_by_time(self, session, delta_time: int):
        """delete completed whisper task by seconds passed since last update

        :param session: _description_
        :type session: _type_
        :param delta_time: passed seconds
        :type delta_time: int
        """
        since = datetime.now() - timedelta(seconds=delta_time)
        stmt = (
            sqlalchemy.delete(WhisperTask)
            .where(WhisperTask.status == TASK_STATUS_DONE)
            .where(WhisperTask.updated_at < since)
        )
        await session.execute(stmt)
        await session.commit()


class IncomingFileCRUD:
    async def create(self, session, incoming_file):
        incoming_file.created_at = datetime.now()
        incoming_file.updated_at = datetime.now()
        session.add(incoming_file)
        await session.commit()
        await session.refresh(incoming_file)
        return incoming_file

    async def get_by_fullpath(self, session, fullpath) -> WhisperTask | None:
        task = await session.execute(
            select(IncomingFile).filter(IncomingFile.fullpath == fullpath).limit(1)
        )

        return task.scalar_one_or_none()

    async def get(self, session, id):
        setting = (
            await session.execute(select(IncomingFile).filter(IncomingFile.id == id))
        ).scalar()
        return setting

    async def update(self, session, updated_incoming_file):
        updated_incoming_file.updated_at = datetime.now()
        session.add(updated_incoming_file)
        await session.commit()

    async def delete(self, session, incoming_file_id):
        stmt = sqlalchemy.delete(IncomingFile).where(
            IncomingFile.id == incoming_file_id
        )
        await session.execute(stmt)
        await session.commit()


settingCrud = SettingCRUD()
whisperTaskCrud = WhisperTaskCRUD()
incomingFileCrud = IncomingFileCRUD()
