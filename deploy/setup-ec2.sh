#!/bin/bash
# ─── DevBlog Hub — EC2 Setup Script ───
# Run this on a fresh Ubuntu 22.04 EC2 instance
# Usage: chmod +x setup-ec2.sh && ./setup-ec2.sh

set -e

echo "=== 1. System Update ==="
sudo apt update && sudo apt upgrade -y

echo "=== 2. Install Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

echo "=== 3. Verify Versions ==="
node --version
npm --version
nginx -v

echo "=== 4. Clone Project ==="
read -p "Enter your GitHub repo URL: " REPO_URL
git clone "$REPO_URL" ~/devblog-hub
cd ~/devblog-hub/backend

echo "=== 5. Install Backend Dependencies ==="
npm install

echo "=== 6. Create Backend .env ==="
cat > .env << 'ENVEOF'
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_jwt_secret
GROQ_API_KEY=your_groq_api_key
ENVEOF
echo ".env created — EDIT IT: nano ~/devblog-hub/backend/.env"

echo "=== 7. Install PM2 ==="
sudo npm install -g pm2

echo "=== 8. Test Backend (Ctrl+C to stop) ==="
echo "Run: cd ~/devblog-hub/backend && node server.js"
echo "Then: http://YOUR_EC2_IP:5000/api/health"

echo ""
echo "=== Done! Next steps ==="
echo "1. nano ~/devblog-hub/backend/.env        # Add your real secrets"
echo "2. pm2 start ~/devblog-hub/backend/server.js --name devblog"
echo "3. pm2 save && pm2 startup systemd"
echo "4. sudo cp deploy/nginx.conf /etc/nginx/sites-available/devblog"
echo "5. sudo ln -s /etc/nginx/sites-available/devblog /etc/nginx/sites-enabled/"
echo "6. sudo nginx -t && sudo systemctl restart nginx"
