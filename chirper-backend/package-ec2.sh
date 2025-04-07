#!/bin/bash

echo "Building chirper-backend for EC2 deployment..."

npm run build

mkdir -p dist_ec2

cp -r dist/* dist_ec2/
cp package.json dist_ec2/
cp deploy.sh dist_ec2/
cp cloudwatch-agent.json dist_ec2/

mkdir -p ../out
cd dist_ec2 && zip -r ../../out/backend-deployment.zip ./*

echo "chirper-backend packaged successfully for EC2 deployment."
