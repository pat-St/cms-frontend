#!/bin/sh
echo "build image"
docker build -t webserver .
echo "start container"
docker run --rm -p 8080:80 --env BACKEND_API_URL="http://localhost:8001/" webserver