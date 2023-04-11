#!/bin/bash
PYTHONPATH=. FASTAPI_ENV=test pytest -s --cov=app --cov-report=term-missing --log-level=DEBUG tests