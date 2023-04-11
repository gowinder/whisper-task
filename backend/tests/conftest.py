import pytest
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import asyncio
from app.model import Base
from app.model import Setting
from app.crud import SettingCRUD


pytest_plugins = ["pytest_asyncio", "pytest_celery"]


@pytest.fixture
async def async_session():
    # create an in-memory SQLite database for testing
    # e = create_engine("sqlite:///:memory:")
    # # Base.metadata.bind = e
    # print("create:", Base.metadata.create_all(e))

    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        Base.metadata.bind = engine
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    Session = sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        yield session


@pytest.fixture
async def create_settings(
    async_session,
    default_settings={
        "rescan": False,
        "root_dir": "/mnt/media",
        "include_exts": ".mp4,.mkv",
        "language": "eng",
        "model": "small",
        "translate": True,
    },
):
    async with async_session() as session:
        settingCrud = SettingCRUD()
        await settingCrud.set_valueJsonObj(async_session, default_settings)
