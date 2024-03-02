DOCKER_NAMESPACE ?= digital-hospitals
APPLICATION_BACKEND ?= sample_detection_api

UI_DIRECTORY ?= web
APPLICATION_UI ?= sample_detection_web

GIT_HASH ?= $(shell git log --format="%h" -n 1)

BROWSER ?= google-chrome

.PHONY: help minikube_start minikube_stop minikube_docker_env build build_api build_ui open_influxdb open_grafana open_ui
.DEFAULT_GOAL := help

help: ## Makefile documentation
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

minikube_start: ## Start minikube and open dashboard
	minikube start
	minikube dashboard

minikube_stop: ## Stop minikube
	minikube stop

minikube_docker_env:
	eval $$(minikube docker-env)

build_api: ## Build and tag the ${APPLICATION_BACKEND} with the latest commit hash and 'latest'
	docker build --tag ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:${GIT_HASH} .
	docker tag ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:${GIT_HASH} ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:latest

build_ui: ${UI_DIRECTORY} ## Build and tag the ${APPLICATION_UI} in the ${UI_DIRECTORY} folder with the latest commit hash and 'latest'
	cd ${UI_DIRECTORY} && docker build --tag ${DOCKER_NAMESPACE}/${APPLICATION_UI}:${GIT_HASH} .
	docker tag ${DOCKER_NAMESPACE}/${APPLICATION_UI}:${GIT_HASH} ${DOCKER_NAMESPACE}/${APPLICATION_UI}:latest

build:	minikube_docker_env build_api build_ui ## Builds the api and ui docker images and stores it to the minikube docker registry

open_influxdb:
	xdg-open http://localhost:52222 && kubectl port-forward -n digital-hospitals svc/influxdb 52222:8086
open_grafana:
	xdg-open http://localhost:52223 && kubectl port-forward -n digital-hospitals svc/grafana 52223:3000
open_ui:
	xdg-open http://localhost:8000 && kubectl port-forward -n digital-hospitals svc/sample-detection-web 8000:80