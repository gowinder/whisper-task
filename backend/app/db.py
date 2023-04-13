import os
from dotenv import load_dotenv
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
