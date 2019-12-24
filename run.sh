#!/bin/sh
echo "build website"
ng build
echo "build image"
docker build -t webserver .
echo "start container"
docker run -p 80:80 webserver