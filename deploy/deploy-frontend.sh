#!/bin/bash
# ─── DevBlog Hub — Deploy Frontend to S3 + CloudFront ───
# Prerequisites:
#   1. Create S3 bucket (e.g., devblog-hub-frontend)
#   2. Create CloudFront distribution pointing to that bucket
#   3. Install AWS CLI: sudo apt install awscli && aws configure
#
# Usage:
#   export VITE_API_URL=http://YOUR_EC2_PUBLIC_IP
#   ./deploy-frontend.sh your-bucket-name

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <s3-bucket-name>"
  echo "Example: $0 devblog-hub-frontend"
  exit 1
fi

BUCKET=$1

echo "=== 1. Install Frontend Dependencies ==="
cd frontend
npm install

echo "=== 2. Build Production Assets ==="
if [ -z "$VITE_API_URL" ]; then
  echo "WARNING: VITE_API_URL is not set!"
  echo "The built app will only work with Vite dev proxy."
  echo "Set it: export VITE_API_URL=http://YOUR_EC2_IP"
  read -p "Continue anyway? (y/N): " CONFIRM
  if [ "$CONFIRM" != "y" ]; then exit 1; fi
fi

npm run build

echo "=== 3. Sync to S3 ==="
aws s3 sync dist/ s3://$BUCKET/ --delete

echo "=== 4. Invalidate CloudFront Cache ==="
read -p "CloudFront Distribution ID (leave blank to skip): " CF_ID
if [ -n "$CF_ID" ]; then
  aws cloudfront create-invalidation --distribution-id $CF_ID --paths "/*"
  echo "Cache invalidated!"
fi

echo ""
echo "=== Done! ==="
echo "Frontend is live at: http://$BUCKET.s3-website-REGION.amazonaws.com"
echo "Or via CloudFront: https://xxxxxxxxxxxxxx.cloudfront.net"
