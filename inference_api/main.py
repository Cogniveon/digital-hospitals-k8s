from fastapi import FastAPI

app = FastAPI(
    title="inference_api",
)


@app.get("/health", summary="Check that the service is operational")
def check_health():
    """
    Sanity check - this will let the user know that the service is operational.

    It is also used as part of the HEALTHCHECK. Docker uses curl to check that the API service is still running, by exercising this endpoint.
    """
    return {"status": "ok"}
