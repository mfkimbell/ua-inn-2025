#!/bin/bash

cd $PWD/frontend
npm run build

mv .next/server/next-font-manifest.json .next/server/font-manifest.json
mv .next/server/next-font-manifest.js .next/server/font-manifest.js

rm -rf .next/cache
rm -rf functions/.next
cp -r .next functions/.next

cd functions
zip -r ../worksync-ui.zip .

cd ../../terraform
terraform init
terraform apply -auto-approve
