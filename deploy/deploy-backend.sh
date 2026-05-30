#!/bin/bash
# ─── DevBlog Hub — Deploy Backend to EC2 ───
# Run this from your LOCAL machine after pushing to GitHub.
# It SSHs into EC2, pulls latest code, and restarts PM2.
#
# Prerequisites:
#   - Your .pem key file
#   - EC2 public IP
#   - PM2 already running on EC2 (see setup-ec2.sh)
#
# Usage:
#   ./deploy-backend.sh path/to/key.pem ubuntu@YOUR_EC2_IP

set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <path-to-pem> <user@host>"
  echo "Example: $0 ~/keys/my-key.pem ubuntu@54.123.45.67"
  exit 1
fi

KEY=$1
HOST=$2
PROJECT_DIR="~/devblog-hub"

echo "=== 1. SSH into EC2 & Pull Latest Code ==="
ssh -i "$KEY" "$HOST" << 'ENDSSH'
  set -e
  cd ~/devblog-hub
  git pull origin main

  echo "=== 2. Install Any New Dependencies ==="
  cd backend && npm install

  echo "=== 3. Restart Backend ==="
  pm2 restart devblog || pm2 start server.js --name devblog
  pm2 save

  echo "=== 4. Build Frontend & Sync to S3 ==="
  cd ../frontend
  npm install
  npm run build

  echo ""
  echo "=== Deploy Complete ==="
  pm2 status
ENDSSH
