SHELL := /bin/bash

# Default app name
APP_NAME = express-service

# Set image and container names dynamically based on the environment
IMAGE_NAME = $(APP_NAME):$(ENV)
CONTAINER_NAME = $(APP_NAME)-$(ENV)

NETWORK_NAME = $(APP_NAME)-net

# Get the environment from the first positional argument
ENV := $(word 2, $(MAKECMDGOALS))

# Allow the second argument to act as a parameter without treating it as a target
$(eval $(ENV):;@:)

# Map `prod` and `dev` to the correct .env file names
ifeq ($(ENV), prod)
	ENV_FILE := .env.production
	DOCKER_FILE := docker-compose.prod.yml
	DOCKER_IMAGE := Dockerfile.prod
	PORT := 3000
	PROJECT_NAME := express-prod
	UP_FLAG := --build
else ifeq ($(ENV), dev)
	ENV_FILE := .env.development
	DOCKER_FILE := docker-compose.dev.yml
	DOCKER_IMAGE := Dockerfile.dev
	PROJECT_NAME := express-dev
endif

.PHONY: help up down build run stop remove clean remove-vol net net-connect rebuild db

help:
	@grep -E '^[1-9a-zA-Z_-]+:.*?## .*$$|(^#--)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m %-43s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m #-- /[33m/'

#-- Docker
up: ## Up the container images (prod or dev)
	@if [ -z "$(ENV)" ]; then ENV=prod; fi; \
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_FILE) up -d $(UP_FLAG)

down: ## Down the container images (prod or dev)
	@if [ -z "$(ENV)" ]; then ENV=prod; fi; \
	docker compose -p $(PROJECT_NAME) -f $(DOCKER_FILE) down

build: ## Build the container image (prod or dev)
	@if [ -z "$(ENV)" ]; then ENV=prod; fi; \
	docker build -t $(IMAGE_NAME) -f $(DOCKER_IMAGE) .

run: ## Run the container image (prod or dev)
	@if [ -z "$(ENV)" ]; then ENV=prod; fi; \
	docker run -d --restart unless-stopped -it -p $(PORT):$(PORT) --env-file $(ENV_FILE) --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop: ## Stop the containers (prod or dev)
	@if [ -z "$(ENV)" ]; then ENV=prod; fi; \
	docker stop $(CONTAINER_NAME)

remove: ## Remove the container (prod or dev)
	@if [ -z "$(ENV)" ]; then ENV=prod; fi; \
	docker container rm -f $(CONTAINER_NAME)

clean: ## Clean the images
	docker rmi -f $(APP_NAME):prod $(APP_NAME):dev

remove-vol: ## Remove the volumes
	docker volume rm -f $(APP_NAME)

net: ## Create the network
	docker network create $(NETWORK_NAME)

net-connect: ## Connect the container to the network (prod or dev)
	@if [ -z "$(ENV)" ]; then ENV=prod; fi; \
	docker network connect $(NETWORK_NAME) $(CONTAINER_NAME)

rebuild: stop remove build run net-connect ## Re-build and run the container (prod or dev)

#-- Database
db: ## Start the local database (MongoDB)
	docker-compose up -d mongo
