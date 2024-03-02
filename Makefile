DOCKER_NAMESPACE ?= digital-hospitals
APPLICATION_BACKEND ?= sample_detection_api

UI_DIRECTORY?= web
APPLICATION_UI?= sample_detection_web

GIT_HASH?= $(shell git log --format="%h" -n 1)

.PHONY: minikube_start minikube_dashboard build_api build_ui build
minikube_start:
	minikube start

minikube_dashboard:
	minikube dashboard

build_api:
	docker build --tag ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:${GIT_HASH} .
	docker tag ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:${GIT_HASH} ${DOCKER_NAMESPACE}/${APPLICATION_BACKEND}:latest

build_ui:
	cd ${UI_DIRECTORY}
	docker build --tag ${DOCKER_NAMESPACE}/${APPLICATION_UI}:${GIT_HASH} .
	docker tag ${DOCKER_NAMESPACE}/${APPLICATION_UI}:${GIT_HASH} ${DOCKER_NAMESPACE}/${APPLICATION_UI}:latest

build:
	eval $$(minikube docker-env)
	$(MAKE) build_api
	$(MAKE) build_ui
