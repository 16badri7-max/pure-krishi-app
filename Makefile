.PHONY: dev build stop clean logs

dev:
	docker-compose up

build:
	docker-compose build --no-cache

stop:
	docker-compose down

clean:
	docker-compose down -v --remove-orphans

logs:
	docker-compose logs -f

web-dev:
	cd apps/web && npm run dev

backend-dev:
	cd apps/backend && npm run start:dev

ai-dev:
	cd apps/ai-service && uvicorn main:app --reload --port 8000

install:
	cd apps/web && npm install
	cd apps/backend && npm install
	cd apps/mobile && npm install

push:
	git add . && git commit -m "Update: $(shell date)" && git push origin main
