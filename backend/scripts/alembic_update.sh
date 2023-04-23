#!/bin/bash
echo "Running alembic upgrade to env " $1
PYTHONPATH=. FASTAPI_ENV=$1 alembic -c alembic.ini upgrade head