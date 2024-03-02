import glob
import json
import os
import uuid
from datetime import datetime
from typing import Annotated

import aiofiles
from fastapi import APIRouter, Form, Path, Query, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from influxdb_client import InfluxDBClient, Point

from sample_detection_api.core import config

router = APIRouter()


@router.get(
    "/inference_image/{id}",
    summary="Get the requested image for inference given an inference request ID",
)
async def get_image(
    id: Annotated[
        str,
        Path(
            title="The ID of the item to get",
            regex="[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12}",
        ),
    ],
):
    if not os.path.exists(config.IMAGE_STORAGE_PATH):
        os.mkdir(config.IMAGE_STORAGE_PATH)

    matches = glob.glob(f"{config.IMAGE_STORAGE_PATH}{id}.*")

    assert len(matches) == 1

    return FileResponse(path=matches[0])


@router.get(
    "/inference_request",
    summary="Get all inference request IDs for a given user and room",
)
async def get_inference_list(
    user: Annotated[str, Query(max_length=50)],
    room: Annotated[str, Query(max_length=50)],
):

    client = InfluxDBClient(
        url=config.INFLUXDB_URL, token=config.INFLUXDB_TOKEN, org=config.INFLUXDB_ORG
    )
    query_api = client.query_api()

    return JSONResponse(
        content=json.loads(
            query_api.query(
                f"""
            from(bucket: "default")
            |> range(start: -24h)
            |> filter(fn: (r) => r["_measurement"] == "inference_request")
            |> filter(fn: (r) => r["_field"] == "id")
            |> filter(fn: (r) => r["user"] == "{user}")
            |> filter(fn: (r) => r["room"] == "{room}")
            |> sort(columns: ["_time"], desc: true)
            |> yield(name: "sort")
        """
            ).to_json(columns=["_time", "_value"])
        )
    )


@router.post("/inference", summary="TBD")
async def upload_image_for_inference(
    user: Annotated[str, Form()],
    room: Annotated[str, Form()],
    files: list[UploadFile],
):
    if not os.path.exists(config.IMAGE_STORAGE_PATH):
        os.mkdir(config.IMAGE_STORAGE_PATH)

    results = []

    client = InfluxDBClient(
        url=config.INFLUXDB_URL, token=config.INFLUXDB_TOKEN, org=config.INFLUXDB_ORG
    )
    write_api = client.write_api()

    for file in files:
        id = uuid.uuid4()
        async with aiofiles.open(
            config.IMAGE_STORAGE_PATH + f"{id}.{file.content_type.split('/')[1]}",
            "wb",
        ) as out_file:
            while content := await file.read(1024):  # async read chunk
                await out_file.write(content)  # async write chunk

        p = (
            Point("inference_request")
            .tag("user", user)
            .tag("room", room)
            .field("id", str(id))
        )
        write_api.write(bucket="default", org=config.INFLUXDB_ORG, record=p)

        results.append(
            {"id": id, "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")}
        )

    return results
