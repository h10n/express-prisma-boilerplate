# app name should be overridden.
# ex) production-stage: make build APP_NAME=<APP_NAME>
# ex) development-stage: make build-dev APP_NAME=<APP_NAME>

SHELL := /bin/bash

# Default app name
APP_NAME = express-service

# Set different image names for production and development
PROD_IMAGE_NAME = $(APP_NAME):latest
DEV_IMAGE_NAME = $(APP_NAME):dev

PROD_CONTAINER_NAME = $(APP_NAME)-prod
DEV_CONTAINER_NAME = $(APP_NAME)-dev

NETWORK_NAME = $(APP_NAME)-net

# Override APP_NAME if provided
APP_NAME := $(APP_NAME)

.PHONY: help start clean db test

help:
	@grep -E '^[1-9a-zA-Z_-]+:.*?## .*$$|(^#--)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m %-43s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m #-- /[33m/'

#-- Docker
up: ## Up the container images
	docker-compose up -d

down: ## Down the container images
	docker-compose down

build: ## Build the container image - Production
	docker build -t ${PROD_IMAGE_NAME} \
		-f Dockerfile.build .

build-dev: ## Build the container image - Development
	docker build -t ${DEV_IMAGE_NAME} \
		-f Dockerfile.dev .

run: ## Run the container image - Production
	docker run -d --restart unless-stopped -it -p 3000:3000 --env-file .env.production --name ${PROD_CONTAINER_NAME} ${PROD_IMAGE_NAME}

run-dev: ## Run the container image - Development
	docker run -d -it -p 1337:1337 -v $(shell pwd):/app -v /app/node_modules --env-file .env.development --name ${DEV_CONTAINER_NAME} ${DEV_IMAGE_NAME}

stop: ## Stop the containers - Production
	docker stop ${PROD_CONTAINER_NAME}

remove: ## Remove the containers
	docker container rm -f ${PROD_CONTAINER_NAME}

clean: ## Clean the images
	docker rmi -f ${PROD_IMAGE_NAME} ${DEV_IMAGE_NAME}

remove-vol: ## Remove the volumes
	docker volume rm -f ${APP_NAME}

net: ## Create the Network
	docker network create ${NETWORK_NAME}

net-connect: ## Connect Container to the Network - Production
	docker network connect ${NETWORK_NAME} ${PROD_CONTAINER_NAME}

net-connect-dev: ## Connect Container to the Network - Development
	docker network connect ${NETWORK_NAME} ${DEV_CONTAINER_NAME}

rebuild: stop remove build run net-connect ## Re-build Production
#-- Database
db: ## Start the local database MongoDB
	docker-compose up -d mongo