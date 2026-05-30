# DevBlog Hub

A modern, high-performance full-stack blogging platform with CRUD operations, JWT authentication, AI chatbot integration, and AWS-ready deployment.

## Features

- **Full CRUD Blog** — Create, read, update, and delete blog posts
- **JWT Authentication** — Secure register/login with bcrypt password hashing
- **AI Chatbot** — Groq-powered assistant for blog help and tech questions
- **Rich UI** — Glassmorphic design, responsive grids, dark theme, CSS animations
- **Search & Pagination** — Search by title/content, filter by category, paginated results
- **Owner-Only Control** — Only the author can edit or delete their posts
- **AWS Ready** — Deployment configs for EC2, Nginx, S3, and CloudFront

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Styling | Custom CSS (HSL variables, glassmorphism, no Tailwind) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| AI | Groq SDK (Llama 3 8B) |
| Deployment | AWS EC2, Nginx, S3, CloudFront |

## Project Structure

```
E:\Blogify\
├── backend\
│   ├── config\db.js           # MongoDB Atlas connection
│   ├── middleware\auth.js      # JWT verification middleware
│   ├── models\Post.js          # Post schema (title, content, author, category, imageUrl)
│   ├── models\User.js          # User schema (username, email, hashed password)
│   ├── routes\auth.js          # POST /api/auth/register, POST /api/auth/login
│   ├── routes\posts.js         # CRUD /api/posts with search & pagination
│   ├── routes\chat.js          # POST /api/chat — Groq AI assistant
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Express entry point
├── frontend\
│   ├── public\
│   ├── src\
│   │   ├── assets\
│   │   ├── components\
│   │   │   ├── Navbar.jsx      # Glassmorphic responsive navigation
│   │   │   ├── PostCard.jsx    # Blog post card with hover effects
│   │   │   ├── Toast.jsx       # Animated toast notifications
│   │   │   ├── Loader.jsx      # Skeleton & spinner loading states
│   │   │   └── ChatWidget.jsx  # Floating AI chatbot widget
│   │   ├── context\
│   │   │   └── AuthContext.jsx  # Global auth state (login, register, logout)
│   │   ├── pages\
│   │   │   ├── Home.jsx        # Landing page with search, filter, pagination
│   │   │   ├── PostDetail.jsx  # Single article view
│   │   │   ├── CreatePost.jsx  # Post editor with live preview
│   │   │   ├── EditPost.jsx    # Pre-populated edit form
│   │   │   ├── Login.jsx       # Unified login/register with toggle
│   │   │   └── Dashboard.jsx   # User stats & post management
│   │   ├── App.jsx             # Router & layout
│   │   ├── main.jsx            # Vite entry
│   │   └── index.css           # Full design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Sign in | No |

### Posts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/posts` | List posts (paginated, searchable) | No |
| GET | `/api/posts/:id` | Get single post | No |
| POST | `/api/posts` | Create a post | Yes |
| PUT | `/api/posts/:id` | Update own post | Yes (owner) |
| DELETE | `/api/posts/:id` | Delete own post | Yes (owner) |

### AI Chat
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat` | Send message to AI assistant | No |

### Query Parameters for GET /api/posts
- `page` — Page number (default: 1)
- `limit` — Posts per page (default: 9)
- `search` — Keyword search in title/content
- `category` — Filter by category (Tech, Design, Tutorial, AI, DevOps, JavaScript, CSS, General)

## Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (free at console.groq.com)

### 1. Clone & Install
```bash
git clone https://github.com/Aveek29/devblog-hub.git
cd devblog-hub

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment
Copy `backend/.env.example` to `backend/.env` and fill in:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/devblog
JWT_SECRET=your_random_jwt_secret
GROQ_API_KEY=gsk_your_groq_api_key
```

### 3. Run the Backend
```bash
cd backend
npm run dev
```
Server starts at `http://localhost:5000`

### 4. Run the Frontend
```bash
cd frontend
npm run dev
```
App opens at `http://localhost:3000` — the Vite proxy forwards `/api` to the backend.

---

## Deployment Guide

### Backend — AWS EC2 + Nginx + PM2

#### Step 1: Launch EC2 Instance
1. Go to **AWS Console → EC2 → Launch Instance**
2. Choose **Ubuntu 22.04 LTS** (free tier eligible)
3. Select **t2.micro** (free tier)
4. Configure security group:
   - Port **22** (SSH) — your IP only
   - Port **80** (HTTP) — 0.0.0.0/0
   - Port **443** (HTTPS) — 0.0.0.0/0
5. Launch and download the `.pem` key file

#### Step 2: Connect & Setup
```bash
ssh -i your-key.pem ubuntu@<ec2-public-ip>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Verify
node --version
npm --version
```

#### Step 3: Deploy Backend
```bash
# Clone your repo
git clone https://github.com/Aveek29/devblog-hub.git
cd devblog-hub/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Paste your environment variables

# Test the server
node server.js
# Press Ctrl+C to stop
```

#### Step 4: Setup PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Start with PM2
pm2 start server.js --name devblog-backend

# Save PM2 config so it restarts on reboot
pm2 startup systemd
pm2 save
```

#### Step 5: Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/devblog
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name _;  # Replace with your domain if you have one

    client_max_body_size 50M;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/devblog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 6: Configure MongoDB Atlas Network Access
1. Go to **MongoDB Atlas → Network Access**
2. Click **Add IP Address**
3. Add your EC2 instance's public IP (or `0.0.0.0/0` for development — not recommended for production)

#### Step 7: SSL with Let's Encrypt (Optional but Recommended)
```bash
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires a domain name)
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

### Frontend — AWS S3 + CloudFront

#### Step 1: Build Production Assets
```bash
cd frontend
npm run build
```
This creates a `dist/` folder with optimized static files.

#### Step 2: Create S3 Bucket
1. Go to **AWS Console → S3 → Create Bucket**
2. Name: `devblog-hub-frontend` (globally unique)
3. Region: Choose one close to your users
4. Uncheck "Block all public access" (CloudFront will handle access)
5. Click **Create Bucket**

#### Step 3: Upload to S3
```bash
# Install AWS CLI
sudo apt install -y awscli
aws configure
# Enter your AWS Access Key & Secret

# Upload build files
aws s3 sync dist/ s3://devblog-hub-frontend/ --delete
```

#### Step 4: Create CloudFront Distribution
1. Go to **AWS Console → CloudFront → Create Distribution**
2. **Origin Domain**: Select your S3 bucket
3. **Origin Access**: Choose "Origin access control settings (recommended)"
4. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
5. **Default Root Object**: `index.html`
6. **Custom Error Response**: Yes
   - Error Code: 404 → Response Page: `/index.html` → 200 OK
   - Error Code: 403 → Response Page: `/index.html` → 200 OK
7. Click **Create Distribution**

#### Step 5: Update S3 Bucket Policy
After creating the distribution, CloudFront will provide a policy to attach to your S3 bucket. Copy it and apply it under S3 → Permissions → Bucket Policy.

#### Step 6: Update Backend CORS
In `backend/server.js`, update the CORS origin to your CloudFront URL:
```js
app.use(cors({
  origin: 'https://dxxxxxxxxxxxx.cloudfront.net',
  credentials: true,
}));
```

Then restart the backend:
```bash
pm2 restart devblog-backend
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port (default: 5000) | No |
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes |
| `GROQ_API_KEY` | API key for Groq AI assistant | Yes (for chat) |

## Development

```bash
# Run backend with auto-reload
cd backend && npm run dev

# Run frontend dev server
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

## Author

**Aveek29**
- GitHub: [https://github.com/Aveek29](https://github.com/Aveek29)

## License

MIT
