#!/bin/bash
PYTHONPATH=. FASTAPI_ENV=dev celery -A app.task.celery worker --loglevel=debug