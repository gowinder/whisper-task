from datetime import datetime
from pydantic import BaseModel, validator
from typing import AnyStr

from app.constraints import WhisperTaskStatusEnum


class SaveSettingDTO(BaseModel):
    values: str


class LoadSettingDTO(BaseModel):
    values: str


class WhisperTaskFilter(BaseModel):
    status: WhisperTaskStatusEnum = WhisperTaskStatusEnum.standby
    page: int = 0
    count: int = 10

    @validator("count")
    def count_must_be_valid(cls, v):
        if v < 0 or v > 50:
            raise ValueError("raw count in one page must between 0 to 50")
        return v

    @validator("page")
    def start_page_must_be_valid(cls, v):
        if v < 0:
            raise ValueError("page must be equal or greater than 0")
        return v


class WhisperTaskDTO(BaseModel):
    id: int
    filename: str
    fullpath: str
    progress: float
    status: int
    enabled: bool
    message: str
    created_at: datetime
    updated_at: datetime


class ScanTaskLogFilter(BaseModel):
    page: int = 0
    count: int = 10

    @validator("count")
    def count_must_be_valid(cls, v):
        if v < 0 or v > 50:
            raise ValueError("raw count in one page must between 0 to 50")
        return v

    @validator("page")
    def start_page_must_be_valid(cls, v):
        if v < 0:
            raise ValueError("page must be equal or greater than 0")
        return v