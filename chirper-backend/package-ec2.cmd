@echo off
echo Building chirper-backend for EC2 deployment...

call npm run build

if not exist dist_ec2 mkdir dist_ec2

xcopy /E /Y dist\* dist_ec2\
copy package.json dist_ec2\

if not exist ..\out mkdir ..\out
if not exist ..\out\dist_ec2 mkdir ..\out\dist_ec2
powershell Compress-Archive -Path dist_ec2\* -DestinationPath ..\backend-deployment.zip -Force

echo chirper-backend packaged successfully for EC2 deployment.
