FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9-slim AS builder

WORKDIR /code

COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

COPY . /code/sample_detection_api

# ENTRYPOINT ["python3"]
# CMD ["-m", "uvicorn", "sample_detection_api.main:app"]
CMD ["uvicorn", "sample_detection_api.main:app", "--host", "0.0.0.0", "--port", "80"]