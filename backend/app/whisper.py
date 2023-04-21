import asyncio
import os
from typing import Any, Union
import whisper
from whisper.utils import get_writer
from app.constraints import TASK_STATUS_DONE, TASK_STATUS_FAILED
from app.crud import WhisperTaskCRUD
from app.hooks.processListener import ProgressListener
from app.hooks.whisperProcessHook import create_progress_listener_handle
from app.logger import get_logger
from app.db import async_session, sync_session

from app.model import Setting, WhisperTask


logger = get_logger(__name__)

# from https://huggingface.co/spaces/aadnk/whisper-webui/blob/main/src/hooks/whisperProgressHook.py#L95


class WhisperProgressListener(ProgressListener):
    def __init__(self, session, whisper_id: int):
        self.whisper_id = whisper_id

    def on_progress(self, current: Union[int, float], total: Union[int, float]):
        session = sync_session()
        whisperCrud = WhisperTaskCRUD()
        whisperTask = session.query(WhisperTask).filter_by(id=self.whisper_id).first()
        logger.info(f"Progress: {current}/{total}")
        whisperTask.message = f"{whisperTask.message} Progress: {current}/{total}\n"
        whisperTask.progress = current / total * 100
        session.add(whisperTask)
        session.commit()

    def on_finished(self):
        session = sync_session()
        whisperCrud = WhisperTaskCRUD()
        whisperTask = session.query(WhisperTask).filter_by(id=self.whisper_id).first()
        whisperTask.progress = 100
        whisperTask.status = TASK_STATUS_DONE
        session.add(whisperTask)
        session.commit()

        logger.info("Finished")


# using openai.whisper python lib to transcript video file to text
async def do_whisper(setting: Any, whisper_task: WhisperTask):
    logger.info(f"do_whisper {whisper_task.id}, file {whisper_task.fullpath}")
    async with async_session() as session:
        model_type = "base"
        if "model" in setting:
            model_type = setting["model"]
        language = "en"
        if "language" in setting:
            language = setting["language"]
        task = "transcribe"
        if "task" in setting:
            task = "translate"
        logprob_threshold = -1.0
        if "logprob_threshold" in setting:
            logprob_threshold = setting["logprob_threshold"]
        compression_ratio_threshold = 2.4
        if "compression_ratio_threshold" in setting:
            compression_ratio_threshold = setting["compression_ratio_threshold"]
        no_speech_threshold = 0.6
        if "no_speech_threshold" in setting:
            no_speech_threshold = setting["no_speech_threshold"]
        logger.info(f"load model {model_type}")
        # options = whisper.DecodingOptions(task=task, language=language)
        options = {"task": task, "language": language}
        model = whisper.load_model(model_type)
        lis = WhisperProgressListener(session=session, whisper_id=whisper_task.id)

        with create_progress_listener_handle(lis) as listener:
            # Set verbose to None to disable the progress bar, as we are using our own
            # if logprob_threshold is not None, pass logprob_threshold to
            # whisper.transcribe() else not pass
            try:
                fullpath = whisper_task.fullpath
                output_dir = os.path.dirname(fullpath)
                writer = get_writer("all", output_dir)
                result = whisper.transcribe(
                    model,
                    audio=fullpath,
                    logprob_threshold=logprob_threshold,
                    compression_ratio_threshold=compression_ratio_threshold,
                    no_speech_threshold=no_speech_threshold,
                    **options,
                )
                writer(result, fullpath)
            except Exception as ex:
                # write TASK_STATUS_FAILED status to db
                crud = WhisperTaskCRUD()
                whisper_task = await crud.get(session, whisper_task.id)
                whisper_task.status = TASK_STATUS_FAILED
                whisper_task.message = f"{whisper_task.message}\n\n\n{ex}\n"
                await crud.update(session, whisper_task)
