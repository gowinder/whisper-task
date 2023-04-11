from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# 定义数据库模型


class Setting(BaseModel):
    id: int
    scan_directory: str
    enable_whisper: bool
    whisper_task: str
    no_speech_threshold: float
    logprob_threshold: float
    compression_ratio_threshold: float
    language: str


class Task(BaseModel):
    id: int
    filename: str
    path: str
    status: str
    completed: bool
    is_processing: bool
    cost_time: float


# 创建SQLite数据库连接，初始化模板数据
# ...

# API路由


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/settings/{id}")
async def read_setting(id: int):
    # 从数据库获取指定ID的设置项
    # ...
    if setting is None:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting


@app.post("/settings/")
async def create_setting(setting: Setting):
    # 将新设置存入数据库
    # ...
    return {"message": "Setting created successfully"}


@app.get("/tasks/")
async def list_tasks():
    # 获取所有文件任务记录
    # ...
    return tasks


@app.get("/tasks/{id}")
async def read_task(id: int):
    # 根据ID获取指定的任务
    # ...
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.post("/tasks/")
async def create_task(task: Task):
    # 将新任务存入数据库并添加到 Celery 队列中
    # ...
    return {"message": "Task created successfully"}


@app.put("/tasks/{id}")
async def update_task(id: int, task: Task):
    # 更新任务状态（完成、进行中）和花费时间等信息
    # ...
    return {"message": "Task updated successfully"}
