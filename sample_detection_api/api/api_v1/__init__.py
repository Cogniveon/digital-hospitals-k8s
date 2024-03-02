import os
import uuid
from datetime import datetime
from typing import Annotated

import aiofiles
from fastapi import APIRouter, Form, UploadFile
from influxdb_client import InfluxDBClient, Point

from sample_detection_api.core import config

router = APIRouter()


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

        results.append(id)

    return results
