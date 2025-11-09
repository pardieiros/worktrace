PROJECT_NAME=worktrace

up:
	docker compose up --build

down:
	docker compose down

migrate:
	docker compose run --rm backend python manage.py migrate

createsu:
	docker compose run --rm backend python manage.py createsu --email admin@worktrace.demo --password demo1234

seed:
	docker compose run --rm backend python manage.py seed

test-backend:
	docker compose run --rm backend pytest

test-frontend:
	docker compose run --rm frontend npm test


