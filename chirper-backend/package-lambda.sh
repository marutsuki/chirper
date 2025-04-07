#!/bin/bash

echo "Building chirper-backend for Lambda deployment..."

npm run build

mkdir -p dist_lambda

cp -r dist/* dist_lambda/
cp package.json dist_lambda/

mkdir -p ../out
cd dist_lambda 
npm install --omit=dev

zip -r ../../out/backend-deployment-lambda.zip ./*

echo "chirper-backend packaged successfully for Lambda deployment."
