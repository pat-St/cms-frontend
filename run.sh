#!/bin/sh
echo "build image"
docker build -t webserver .
echo "start container"
docker run -d -p 8080:8080 --env BACKEND_API_URL="http://localhost:8001/" webserver