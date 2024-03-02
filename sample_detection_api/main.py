from fastapi import FastAPI

from sample_detection_api.api.api_v1 import router as api_router
from sample_detection_api.core.config import API_V1_STR, PROJECT_NAME

app = FastAPI(
    title=PROJECT_NAME,
)

app.include_router(api_router, prefix=API_V1_STR)


@app.get("/health", summary="Check that the service is operational")
def check_health():
    """
    Sanity check - this will let the user know that the service is operational.

    It is also used as part of the HEALTHCHECK. Docker uses curl to check that the API service is still running, by exercising this endpoint.
    """
    return {"status": "ok"}
