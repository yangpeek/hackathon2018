REPO=hackathon2018

define HELP=
make <command> where command is:
        create make the docker image $(REPO)
        shell  start container $(REPO) based on image $(REPO)
        run    run z.js within the $(REPO) container (production mode)
	stop   stop the docker container $(REPO)
        test   run test tests
endef

.PHONY: create shell 

help:
	$(info $(HELP))

Dockerfile:
	cp -s docker/Dockerfile .

create:	Dockerfile
	echo "Rebuilding $(REPO) image"
	docker build -t $(REPO) -f Dockerfile .

shell:  stop
	echo "Running bash within $(REPO)"
	docker run -p 8088:8088 -it -v "`pwd`:/src" --name $(REPO) $(REPO) /bin/bash

bash:   
	echo "Running additional shell within $(REPO)"
	docker exec -it $(REPO) bash

run:    stop
	echo "Running z.js within $(REPO)"
	docker run -p 8088:8088 -i -v "`pwd`:/src" --name $(REPO) $(REPO) bash -c 'node z.js'

stop:
	-@docker stop $(REPO) 1>/dev/null 2>/dev/null || true
	-@docker rm $(REPO) 1>/dev/null 2>/dev/null  || true

test:
	@echo "Testing z.js"
	curl -s -D- 'http://127.0.0.1:8088/edit?file=/config/config.json'



