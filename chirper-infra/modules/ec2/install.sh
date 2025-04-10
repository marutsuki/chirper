#!/bin/bash
yum update -y

curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
yum install -y nodejs git

mkdir -p /opt/chirper-backend/

# PM2 for process management
npm install -g pm2

# Setup environment variables
cat > /opt/.env <<EOL
NODE_ENV=${environment}
PORT=3000
ALLOWED_ORIGINS=${allowed_origins}
DATABASE_URL=${database_url}
EOL

cd /opt/chirper-backend

# Download the latest deployment package
aws s3 cp s3://${deployment_bucket}/backend-deployment.zip ./backend-deployment.zip
unzip -o backend-deployment.zip

# chmod +x /opt/chirper-backend/deploy.sh
# /opt/chirper-backend/deploy.sh

# Set up CloudWatch agent for logs
yum install -y amazon-cloudwatch-agent
cp /opt/chirper-backend/cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-agent.json
systemctl enable amazon-cloudwatch-agent
systemctl start amazon-cloudwatch-agent
