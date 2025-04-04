if not exist dist\lambda (
    mkdir dist\lambda
)

xcopy /E /I dist\src\* dist\lambda\

if not exist dist\lambda\migrations (
    mkdir dist\lambda\migrations
)

xcopy /E /I migrations\* dist\lambda\migrations\
xcopy package.json dist\lambda\

cd dist\lambda
npm install --production

powershell Compress-Archive -Path * -DestinationPath ..\lambda-deployment.zip -Force