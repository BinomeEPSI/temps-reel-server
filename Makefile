all: install

install:
	docker build -t temps-reel-server .docker/.
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

test:
	docker exec -it temps-reel-server echo "no test available"