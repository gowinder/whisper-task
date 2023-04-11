from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
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
    filename = mapped_column(String)
    fullpath = mapped_column(String)
    progress = mapped_column(Float)
    status = mapped_column(Integer)
    enabled = mapped_column(Boolean)
    message = mapped_column(String)
    created_at = mapped_column(DateTime)
    updated_at = mapped_column(DateTime)

    __table_args__ = (UniqueConstraint("fullpath"),)


class IncomingFile(Base):
    __tablename__ = "incoming_files"
    id = mapped_column(Integer, primary_key=True)
    filename = mapped_column(String)
    fullpath = mapped_column(String)
    task_id = mapped_column(Integer, ForeignKey("whisper_tasks.id"))
    status = mapped_column(Integer)
    progress = mapped_column(Float)
    enabled = mapped_column(Boolean)
    message = mapped_column(String)
    created_at = mapped_column(DateTime)
    updated_at = mapped_column(DateTime)

    task = relationship("WhisperTask")
