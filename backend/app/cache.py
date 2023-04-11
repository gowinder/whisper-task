import os
import aioredis
from dotenv import load_dotenv

from app.logger import get_logger

load_dotenv(f'.env.{os.environ.get("FASTAPI_ENV")}')

REDIS_URL = os.getenv("REDIS_URL")
redis_pool = None

logger = get_logger(__name__)


def get_redis():
    global redis_pool
    if redis_pool is None:
        logger.info("redis_pool is None, creating new one from %s", REDIS_URL)
        redis_pool = aioredis.from_url(REDIS_URL)
    return redis_pool
