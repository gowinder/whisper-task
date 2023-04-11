import logging
import os
import sys

from dotenv import load_dotenv

load_dotenv(f".env.{os.environ.get('FASTAPI_ENV')}")

stream_handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter(
    "[%(asctime)s]-[%(levelname)s]:[%(module)s]-"
    "[%(filename)s]-[%(funcName)s]-[%(lineno)d]: %(message)s"
)
stream_handler.setLevel(os.getenv("LOG_LEVEL", "INFO"))
stream_handler.setFormatter(formatter)


def get_logger(name):
    logger = logging.getLogger(name)
    # logger.handlers = []
    if stream_handler not in logger.handlers:
        stream_handler.flush()
        logger.addHandler(stream_handler)
    return logger
