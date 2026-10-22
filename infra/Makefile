.PHONY: test lint build run

test:
	python -m pytest -q

lint:
	python -m flake8 xpensmat ml --count --select=E9,F63,F7,F82 --show-source --statistics

build:
	docker compose -f infra/docker-compose.yml build

run:
	docker compose -f infra/docker-compose.yml up
