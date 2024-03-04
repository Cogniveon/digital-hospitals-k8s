#!/bin/bash

# Script utility to setup the sample-detection infrastructure on a fresh k8s cluster

GUM=tools/gum

$GUM confirm "Are you sure you have setup a kubernetes cluster and configured kubectl?" && kubectl apply -f k8s/influxdb.yaml

INFLUX_URL=$(minikube service influxdb -n digital-hospitals --url)

echo "InfluxDB is running at $INFLUX_URL \n"

echo "Setup InfluxDB and enter the following details: \n"

INFLUXDB_TOKEN=$($GUM input --password --header "INFLUXDB_TOKEN")
INFLUXDB_ORG=$($GUM input --header "INFLUXDB_ORG")
INFLUXDB_HOST=$($GUM input --value="influxdb.digital-hospitals" --header "INFLUXDB_HOST")
INFLUXDB_MONITORING_BUCKET=$($GUM input --value="default" --header "INFLUXDB_MONITORING_BUCKET")

kubectl create -n digital-hospitals secret generic influxdb-monitoring-creds \
  --from-literal=INFLUXDB_TOKEN="${INFLUXDB_TOKEN}" \
  --from-literal=INFLUXDB_ORG="${INFLUXDB_ORG}" \
  --from-literal=INFLUXDB_HOST="${INFLUXDB_HOST}" \
  --from-literal=INFLUXDB_MONITORING_BUCKET="${INFLUXDB_MONITORING_BUCKET}" \
  --from-literal=INFLUXDB_HTTP_AUTH_ENABLED=true

kubectl apply -f k8s/telegraf_monitoring.yaml

GF_SECURITY_ADMIN_USER=$($GUM input --value="admin" --header "GF_SECURITY_ADMIN_USER")
GF_SECURITY_ADMIN_PASSWORD=$($GUM input --value="password" --password --header "GF_SECURITY_ADMIN_PASSWORD (default: password)")


kubectl create -n digital-hospitals secret generic grafana-creds \
  --from-literal=GF_SECURITY_ADMIN_USER="${GF_SECURITY_ADMIN_USER}" \
  --from-literal=GF_SECURITY_ADMIN_PASSWORD="${GF_SECURITY_ADMIN_PASSWORD}"

kubectl apply -f k8s/grafana.yaml

GRAFANA_URL=$(minikube service grafana -n digital-hospitals --url)
echo "Grafana is running at $GRAFANA_URL \n"

kubectl create -n digital-hospitals secret generic sample-detection-api-creds \
  --from-literal=INFLUXDB_ORG="${INFLUXDB_ORG}" \
  --from-literal=INFLUXDB_TOKEN="${INFLUXDB_TOKEN}" \
  --from-literal=INFLUXDB_URL="http://${INFLUXDB_HOST}:8086"

kubectl apply -f k8s/app.yaml

API_URL=$(minikube service sample-detection-api -n digital-hospitals --url)
echo "API is running at $INFLUX_URL \n"
UI_URL=$(minikube service sample-detection-web -n digital-hospitals --url)
echo "UI is running at $UI_URL \n"

echo "Port forward UI using command:"
echo "kubectl -n digital-hospitals port-forward svc/sample-detection-web 8080:80"
