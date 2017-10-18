#!/usr/bin/env bash

arg=$1

# Resources
zone=westeurope
group=z
storage=zfelixstorage
registry=zregistry
tag=superintendence
ver=latest

if [ "$arg" == 'create' ]; then

  echo 'Creating resource group...'
  az group create --name $group --location $zone

  echo 'Creating storage account created for registry...'
  az storage account create --resource-group $group --name $storage --sku Standard_LRS

  echo 'Configuring container registry...'
  az acr create --resource-group $group --storage-account-name $storage --name $registry --sku Basic --admin-enabled true

elif [ "$arg" == 'start-instance' ]; then

  echo 'Retrieving password of registry...'
  pass=$(az acr credential show --name $registry --query "passwords[0].value")
  echo 'Stripping quotes...'
  pass=$(eval echo $pass)

  echo 'Login to registry (password available in registry access keys blade)...'
  docker login "$registry.azurecr.io" -u $registry -p $pass

  echo 'Tagging image: $tag'
  docker tag $tag $registry.azurecr.io/$tag

  echo 'Pushing...'
  docker push $registry.azurecr.io/$tag

  echo 'Creating container...'
  az container create --name $tag --image $registry.azurecr.io/$tag:$ver --cpu 1 --memory 1 --registry-password $pass --ip-address public -g $group -o table
  az container show --name $tag --resource-group $group --query state
  az container show --name $tag --resource-group $group --query ipAddress.ip
  az container show --name $tag --resource-group $group -o table
  echo az container logs --name $tag -g $group

elif [ "$arg" == 'delete-instance' ]; then

  echo 'Removing container...'
  az container delete --resource-group $group --name $tag

  echo 'Removing container registry...'
  az acr delete --name $registry

  echo 'Removing storage account created for registry...'
  az storage account delete --resource-group $group --name $storage

  echo 'Removing resource group...'
  az group delete --name $group

elif [ "$arg" == 'create-web' ]; then

  echo 'Login to registry (password available in registry access keys blade)...'
  docker login "$registry.azurecr.io" -u $registry -p $pass

  echo 'Using custom Docker image...'
  az webapp config container set --name $tag --resource-group $group \
    --docker-custom-image-name $tag:$ver --docker-registry-server-url $registry.azurecr.io/$tag:$ver

  #echo 'Creating app service plan...'
  #az appservice plan create --resource-group $group --name ${tag}plan --is-linux
  #echo 'Creating web app...'
  #az webapp create --resource-group $group -plan ${tag}plan --name ${tag}web --runtime "python|3.4"

  echo 'Restarting web app...'
  az webapp restart --name $tag --resource-group $group

else

  echo 'Usage: aci.sh <create|start-instance|delete-instance>'
  exit 1

fi

echo 'Done!'
