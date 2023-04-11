#! /bin/bash
echo "env=$1"
echo "comment=$2"
PYTHONPATH=../. FASTAPI_ENV=$1 python3 -m alembic revision --autogenerate -m "$2"