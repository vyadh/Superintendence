#!/usr/bin/env bash

arg=$1

# Resources
tag=superintendence
ver=latest
tagver="$tag:$ver"
registry=kieronregistry

echo "Starting $arg..."

if [ "$arg" == 'build' ]; then
  docker build -t $tagver .
elif [ "$arg" == 'remove' ]; then
  docker container rm $tag
elif [ "$arg" == 'create' ]; then
  docker create --name $tag -p 80:80 $tagver
elif [ "$arg" == 'start' ]; then
  docker start -a -i $tag
elif [ "$arg" == 'run' ]; then
  docker run -d -p 80:80 $tagver
elif [ "$arg" == 'cli' ]; then
  docker exec -i -t $tag /bin/sh
elif [ "$arg" == 'push' ]; then
  #docker login $registry.azurecr.io -u $registry
  docker tag $tag $registry.azurecr.io/$tag
  docker push $registry.azurecr.io/$tag
else
  echo 'Usage: control.sh <build|remove|create|start|run|cli>'
  exit 1
fi

echo 'Done!'

