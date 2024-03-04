DOCKER_NAMESPACE ?= digital-hospitals

APPLICATION_BACKEND ?= sample_detection_api

APPLICATION_UI ?= sample_detection_web

GIT_HASH ?= $(shell git log --format="%h" -n 1)

BROWSER ?= google-chrome

GUM ?= tools/gum

.PHONY: help run minikube_start minikube_stop minikube_docker_env build build_api build_ui update_deployment open_influxdb open_grafana open_ui
.DEFAULT_GOAL := run

help: ## Makefile documentation
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

SELECTED_OPTION ?= $(MAKE) help | $(GUM) choose | awk '{print $$1}'
run: ## Interactive run menu for Make commands
	@$(SELECTED_OPTION) | xargs $(MAKE)

minikube_start: ## Start minikube and open dashboard
	minikube start
	minikube dashboard

minikube_stop: ## Stop minikube
	minikube stop

build_api: ## Build and tag the ${APPLICATION_BACKEND} with the latest commit hash and 'latest'
	cd ${APPLICATION_BACKEND} && docker build --tag ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:${GIT_HASH} .
	docker tag ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:${GIT_HASH} ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:latest

build_ui: ${UI_DIRECTORY} ## Build and tag the ${APPLICATION_UI} in the ${UI_DIRECTORY} folder with the latest commit hash and 'latest'
	cd ${APPLICATION_UI} && docker build --tag ${DOCKER_NAMESPACE}/${APPLICATION_UI}:${GIT_HASH} .
	docker tag ${DOCKER_NAMESPACE}/${APPLICATION_UI}:${GIT_HASH} ${DOCKER_NAMESPACE}/${APPLICATION_UI}:latest

build: ## Builds the api and ui docker images and stores it to the minikube docker registry
	@eval $$(minikube docker-env) ;\
	$(MAKE) build_ui
	$(MAKE) build_api

update_deployment: ## Set k8s deployment to the latest build
	kubectl set image -n digital-hospitals deployment/sample-detection-web sample-detection-web=${DOCKER_NAMESPACE}/${APPLICATION_UI}:${GIT_HASH}
	kubectl set image -n digital-hospitals deployment/sample-detection-api sample-detection-api=${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:${GIT_HASH}

open_influxdb: ## Opens a browser session and port forwards to svc/influxdb:8086
	xdg-open http://localhost:52222 && kubectl port-forward -n digital-hospitals svc/influxdb 52222:8086
open_grafana: ## Opens a browser session and port forwards to svc/grafana:3000
	xdg-open http://localhost:52223 && kubectl port-forward -n digital-hospitals svc/grafana 52223:3000
open_ui: ## Opens a browser session and port forwards to svc/sample-detection-web:80
	xdg-open http://localhost:8000 && kubectl port-forward -n digital-hospitals svc/sample-detection-web 8000:80
