from datetime import datetime
from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Float,
    Boolean,
    Enum,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship, mapped_column
from sqlalchemy.ext.declarative import (
    as_declarative,
    declarative_base,
    declared_attr,
)
from sqlalchemy import MetaData

# Base = declarative_base()
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Setting(Base):
    __tablename__ = "settings"
    id = mapped_column(Integer, primary_key=True)
    """
    {
        "rescan": false,
        "root_dir": "/mnt/media",
        "include_exts": ".mp4,.mkv",
        "language": "eng",
        "model": "small",
        "translate": true,
        "no_speech_threshold": 0.5,
        "logprob_threshold": 0.5,
        "compression_ratio_threshold": 0.5,
    }
    """
    values = mapped_column(String)


class WhisperTask(Base):
    __tablename__ = "whisper_tasks"
    id = mapped_column(Integer, primary_key=True)
    filename = mapped_column(String, default="")
    fullpath = mapped_column(String, default="")
    progress = mapped_column(Float, default=0.0)
    status = mapped_column(Integer, default=0)
    enabled = mapped_column(Boolean, default=True)
    message = mapped_column(String, default="")
    cmd = mapped_column(String, default="")
    created_at = mapped_column(DateTime, default=datetime.now())
    updated_at = mapped_column(DateTime, default=datetime.now())

    __table_args__ = (UniqueConstraint("fullpath"),)


class IncomingFile(Base):
    __tablename__ = "incoming_files"
    id = mapped_column(Integer, primary_key=True)
    filename = mapped_column(String)
    fullpath = mapped_column(String)
    task_id = mapped_column(Integer)
    status = mapped_column(Integer)
    progress = mapped_column(Float)
    enabled = mapped_column(Boolean)
    message = mapped_column(String)
    created_at = mapped_column(DateTime)
    updated_at = mapped_column(DateTime)

    @staticmethod
    def from_whisper_task(whisper_task: WhisperTask):
        """generate a new IncomingFile from a WhisperTask

        :param whisper_task: target whisper task record
        :type whisper_task: WhisperTask
        :return: a new IncomingFile
        :rtype: _type_
        """
        incoming_file = IncomingFile()
        incoming_file.filename = whisper_task.filename
        incoming_file.fullpath = whisper_task.fullpath
        incoming_file.task_id = whisper_task.id
        incoming_file.status = whisper_task.status
        incoming_file.progress = whisper_task.progress
        incoming_file.enabled = whisper_task.enabled
        incoming_file.message = whisper_task.message
        incoming_file.created_at = whisper_task.created_at
        incoming_file.updated_at = whisper_task.updated_at
        return incoming_file
