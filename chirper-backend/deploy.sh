#!/bin/bash
npm install --production
pm2 stop chirper-backend || true
pm2 start index.js --name chirper-backend
pm2 save

# Set PM2 to start on boot
pm2 startup | tail -1 | bash