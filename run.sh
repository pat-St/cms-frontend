#!/bin/sh
echo "build image"
docker build -t webserver .
echo "start container"
docker run -d -p 80:80 --env BACKEND_API_URL="http://192.168.2.9:8001/" webserver