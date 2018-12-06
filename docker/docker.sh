#!/bin/bash

HELP='# Dockerized Standard Actions
* `./script/docker.sh --create`
* `./script/docker.sh --shell`'

repo="hackathon2018"
set -e

while [[ "$#" > 0 ]]
do
    cmd="$1"
    shift
    if [[ $cmd != --* ]]; then 
        continue
    fi
    case $cmd in
        --help)
            printf '%s' "$HELP";
            exit 0
            ;;
        #
        # Create Docker Images
        #
        --create)
            echo "Rebuilding $repo image"
            docker build -t $repo -f script/Dockerfile-dev .
            ;;
        #
        # Running container with mounted working directory.
        #
        #
        --shell)
            echo "Running $repo container image"
            docker run -it -v "`pwd`:/src" $repo /bin/bash
            exit 0
            ;;
        *)
            echo "Unknown command $1"
            exit 1
            ;;
    esac;
done

exit 0
