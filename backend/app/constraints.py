from enum import IntEnum

TASK_STATUS_IN_PROGRESS: int = 0
TASK_STATUS_DONE: int = 1
TASK_STATUS_FAILED: int = -1


SCAN_FILES_KEY = "scanned-files"
SCAN_LOG_KEY = "scanned-logs"


class WhisperTaskStatusEnum(IntEnum):
    standby = 0
    inprogress = 1
    completed = 2
    onerror = 100
