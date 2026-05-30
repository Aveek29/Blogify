# 🚀 DevBlog Hub — Full AWS Deployment Guide

Follow these steps exactly to deploy the full stack.

---

## 🧱 PHASE 1 — PREPARE BACKEND (LOCAL CHECK)

```bash
cd backend
npm install
npm start
```

Verify these endpoints work locally:
- `http://localhost:5000/api/health` → `{ "status": "ok" }`
- `http://localhost:5000/api/posts` → `{ "posts": [] }`
- `POST http://localhost:5000/api/auth/register` → creates user
- `POST http://localhost:5000/api/chat` → AI replies

---

## ☁️ PHASE 2 — CREATE EC2 SERVER

### Step 2: Launch EC2
1. **AWS Console → EC2 → Launch Instance**
2. Name: `devblog-backend`
3. **AMI**: Ubuntu 22.04 LTS (free tier)
4. **Instance type**: `t2.micro` (free tier)
5. **Key pair**: Create or select existing (download `.pem`)

### Step 3: Security Group (VERY IMPORTANT)
Add these inbound rules:

| Type | Protocol | Port Range | Source |
|------|----------|-----------|--------|
| SSH | TCP | 22 | Your IP (`x.x.x.x/32`) |
| HTTP | TCP | 80 | `0.0.0.0/0` |
| HTTPS | TCP | 443 | `0.0.0.0/0` |

### Step 4: Connect to EC2
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 5: Install Tools
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
node --version   # v20.x
npm --version
```

---

## 🧠 PHASE 3 — DEPLOY BACKEND ON EC2

### Step 6: Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/devblog-hub.git
cd devblog-hub/backend
npm install
```

### Step 7: Create Backend `.env`
```bash
nano .env
```

Paste (fill with your real values):
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/devblog?retryWrites=true&w=majority
JWT_SECRET=<generate-a-random-string>
GROQ_API_KEY=gsk_your_groq_key
```

### Step 8: Test Backend
```bash
node server.js
```

Open `http://YOUR_EC2_IP:5000/api/posts` in your browser — you should see JSON.

Press `Ctrl+C` to stop.

### Step 9: Keep Backend Running with PM2
```bash
sudo npm install -g pm2
pm2 start server.js --name devblog
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### Step 10: Setup Nginx Reverse Proxy
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/devblog
sudo ln -s /etc/nginx/sites-available/devblog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Now `http://YOUR_EC2_IP/api/posts` works without the `:5000` port.

---

## 🔐 PHASE 4 — MONGODB ATLAS SETUP

1. Go to **MongoDB Atlas → Network Access → Add IP Address**
2. Add your EC2 instance's **public IP**
   - Or use `0.0.0.0/0` (allows any IP — okay for dev, not for production)
3. Ensure the connection string in `backend/.env` matches your database

---

## 🎨 PHASE 5 — FRONTEND SETUP

### Step 11: Install Frontend Dependencies
```bash
cd ~/devblog-hub/frontend
npm install
```

### Step 12: Set API URL
```bash
nano .env
```

Set `VITE_API_URL` to your EC2 public IP:
```env
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP
```

### Step 13: Test Frontend Locally
```bash
npm run dev
```

Open `http://localhost:3000` — everything should work against your EC2 backend.

---

## ☁️ PHASE 6 — DEPLOY FRONTEND TO S3 + CLOUDFRONT

### Step 14: Build Production Assets
```bash
npm run build
```

### Step 15: Upload to S3
```bash
# Install AWS CLI (if not already)
sudo apt install -y awscli
aws configure
# Enter your AWS Access Key ID & Secret Access Key

# Create bucket in AWS Console first, then:
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

### Step 16: Setup CloudFront
1. **AWS Console → CloudFront → Create Distribution**
2. **Origin**: Select your S3 bucket
3. **Origin access**: Origin access control settings (recommended)
4. **Viewer protocol**: Redirect HTTP to HTTPS
5. **Default root object**: `index.html`
6. **Custom error response**: Yes
   - Error 403 → Response page: `/index.html` → 200
   - Error 404 → Response page: `/index.html` → 200
7. Click **Create**
8. Apply the S3 bucket policy that CloudFront provides

---

## 🔗 FINAL SYSTEM FLOW

```
User's Browser
     │
     ▼
CloudFront CDN (https://xxxxx.cloudfront.net)
     │
     ├── Static files (HTML, JS, CSS) → S3 bucket
     │
     └── API calls (/api/*) → EC2 Nginx → Node.js (port 5000)
                                             │
                                             ▼
                                        MongoDB Atlas
```

---

## ⚡ 3 THINGS YOU MUST CHANGE

| # | File | Variable | Your Value |
|---|------|----------|-----------|
| 1 | `frontend/.env` | `VITE_API_URL` | `http://YOUR_EC2_PUBLIC_IP` |
| 2 | `backend/.env` | `MONGODB_URI` | Your Atlas connection string |
| 3 | MongoDB Atlas | Network IP | Your EC2 public IP |

---

## 📁 Project Structure

```
E:\Blogify\
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── deploy/
│   ├── nginx.conf              # Copy to /etc/nginx/sites-available/
│   ├── setup-ec2.sh            # First-time EC2 setup
│   ├── deploy-backend.sh       # Push code updates to EC2
│   └── deploy-frontend.sh      # Build + sync to S3
├── DEPLOY.md
└── README.md
```
