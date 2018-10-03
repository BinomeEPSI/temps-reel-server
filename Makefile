all: build

build:
	docker build -t temps-reel-server .docker/dist/.
	docker build -t temps-reel-install .docker/installer/.
up:
	docker-compose up -d
	
watch:
	docker-compose up
	
down:
	docker-compose down

stop:
	docker-compose stop

restart:
	docker-compose restart


install:
	docker-compose up -d
	docker exec -it temps-reel-install composer install

test:
	docker-compose up -d
	docker exec -it temps-reel-install composer test