#!/bin/bash

cd $PWD/frontend
npm run build

rm -rf .next/cache
rm -rf functions/.next
cp -r .next functions/.next

cd functions
zip -r ../worksync-ui.zip .

cd ../../terraform
terraform init
terraform apply -auto-approve
