import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.logger import get_logger

load_dotenv(f'.env.{os.environ.get("FASTAPI_ENV")}')


logger = get_logger(__name__)


# Connect to database using SQLAlchemy async
URL = os.getenv("DATABASE_URL")
logger.info("DATABASE_URL: %s", URL)

SYNC_URL = URL.replace("+asyncpg", "")
sync_engine = create_engine(
    url=SYNC_URL,  # type: ignore
    pool_pre_ping=True,
    echo=False,
    pool_recycle=300,
)
sync_session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=sync_engine,
)

engine = create_async_engine(
    url=URL,  # type: ignore
    pool_pre_ping=True,
    echo=False,
    pool_recycle=300,
    poolclass=NullPool,
)
async_session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def async_session_func():
    async with sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
        expire_on_commit=False,
        class_=AsyncSession,
    )() as session:
        yield session
