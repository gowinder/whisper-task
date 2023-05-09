from __future__ import annotations
import asyncio
import json
import math
from typing import Any, List
import logging
from fastapi import Depends, FastAPI, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import aioredis
import aiohttp
import aiofile
import os
from dotenv import load_dotenv
from fastapi_pagination import LimitOffsetPage, Page, add_pagination, paginate
from app.cache import get_redis
from app.constraints import SCAN_LOG_KEY

from app.model import Setting, WhisperTask
from app.task import celery_scan_task, celery_scheduler_task
from app.db import async_session
from app.schema import LoadSettingDTO, SaveSettingDTO
from app.db import async_session_func
from app.crud import SettingCRUD
from app.schema import WhisperTaskFilter
from app.crud import WhisperTaskCRUD
from app.schema import WhisperTaskDTO
from app.schema import TaskLogFilter
from app.task import celery
from fastapi.middleware.cors import CORSMiddleware

from app.constraints import SCHEDULER_LOG_KEY

# Load environment variables
load_dotenv(f'.env.{os.environ.get("FASTAPI_ENV")}')

# Create FastAPI instance
app = FastAPI()


origins = [
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def init_logging() -> None:
    level = logging.getLevelName(os.getenv("LOG_LEVEL", "INFO"))
    print("LOG_LEVEL: ", level)
    logging.basicConfig(level=level)


init_logging()


def app_logger() -> logging.Logger:
    logger = logging.getLogger(__name__)
    return logger


# Connect to Redis using aioredis async


# Save and load setting API
@app.post("/settings")
async def save_setting(
    newSettings: SaveSettingDTO,
    session=Depends(async_session_func),
    settingCrud=Depends(SettingCRUD),
    logger: logging.Logger = Depends(app_logger),
):
    logger.info("save_setting: %s", newSettings)
    values = json.loads(newSettings.values)
    # async with async_session() as session:
    ret = await settingCrud.set_valueJsonObj(session, values)
    return ret


@app.get("/settings")
async def load_setting(
    session=Depends(async_session_func),
    settingCrud=Depends(SettingCRUD),
    response_model=LoadSettingDTO,
):
    # async with async_session() as session:
    return await settingCrud.checkAndGet(session)


# Load all whisper_task API
@app.get(
    "/whisper_tasks",
    response_model=List[WhisperTaskDTO],
)
# @app.get("/whisper_tasks/limit-offset", response_model=LimitOffsetPage[WhisperTask])
async def load_whisper_tasks(
    filter: WhisperTaskFilter = Depends(),
    session=Depends(async_session_func),
    whisperTaskCrud=Depends(WhisperTaskCRUD),
    logger: logging.Logger = Depends(app_logger),
):
    logger.info("load_whisper_tasks: %s", filter)
    # async with async_session() as session:
    return await whisperTaskCrud.filter(session, filter)


# Scan task control API
@app.post("/scan_task/{action}")
async def scan_task_control(action: str):
    if action == "stop":
        await celery_scan_task().close()
    elif action == "restart":
        await celery_scan_task().revoke()
    else:
        return {"status": "error", "message": "Invalid action"}


# Get scan task log API
@app.get("/scan_task_log")
async def get_scan_task_log(
    filter: TaskLogFilter = Depends(),
    cache=Depends(get_redis),
    logger: logging.Logger = Depends(app_logger),
):
    """_summary_

    :param page: page number, start from 0
    :type page: int
    :param count: _description_
    :type count: int
    :return: _description_
    :rtype: _type_
    """
    # Read scan log from Redis cache
    log_size = await cache.llen(SCAN_LOG_KEY)
    start = 0
    end = 10
    total_pages = math.ceil(log_size / filter.count)
    logger.debug(
        "/scan_task_log: filter: %s, log_size: %s, total_pages: %d",
        filter,
        log_size,
        total_pages,
    )
    if filter.page >= 0 and filter.page < total_pages:
        start = (filter.page) * filter.count
        end = start + filter.count - 1

    logger.debug("/scan_task_log: start: %d, end: %d", start, end)
    scan_log = await cache.lrange(SCAN_LOG_KEY, start, end)
    return {"scan_log": scan_log, "total_pages": total_pages, "page": filter.page}


@app.get("/task_log")
async def get_task_log(
    filter: TaskLogFilter = Depends(),
    cache=Depends(get_redis),
    logger: logging.Logger = Depends(app_logger),
):
    """_summary_

    :param page: page number, start from 0
    :type page: int
    :param count: _description_
    :type count: int
    :return: _description_
    :rtype: _type_
    """
    # Read scan log from Redis cache
    key_name = SCHEDULER_LOG_KEY
    if filter.task_type == "scan":
        key_name = SCAN_LOG_KEY
    logger.debug("/task_log: task_type=%s, key_name=%s", filter.task_type, key_name)
    log_size = await cache.llen(key_name)
    start = 0
    end = 10
    total_pages = math.ceil(log_size / filter.count)
    logger.debug(
        "/task_log: filter: %s, log_size: %s, total_pages: %d",
        filter,
        log_size,
        total_pages,
    )
    if filter.page >= 0 and filter.page < total_pages:
        start = (filter.page) * filter.count
        end = start + filter.count - 1

    logger.debug("/task_log: start: %d, end: %d", start, end)
    scan_log = await cache.lrange(key_name, start, end)
    return {
        "logs": scan_log,
        "total_pages": total_pages,
        "page": filter.page,
        "task_type": filter.task_type,
    }


@app.on_event("startup")
def startup():
    logger = logging.getLogger(__name__)
    logger.info("startup")
    celery_scan_task.delay()
    celery_scheduler_task.delay()


add_pagination(app)
