import os

from starlette.datastructures import CommaSeparatedStrings

ALLOWED_HOSTS = CommaSeparatedStrings(os.getenv("ALLOWED_HOSTS", ""))
API_V1_STR = "/api/v1"
PROJECT_NAME = "sample_tracker"
IMAGE_STORAGE_PATH = "images/"
INFLUXDB_URL = os.environ.get("INFLUXDB_URL", "http://influxdb.digital-hospitals:8086")
INFLUXDB_TOKEN = os.environ.get("INFLUXDB_TOKEN", "")
INFLUXDB_ORG = os.environ.get("INFLUXDB_ORG", "")
