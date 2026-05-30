# 🚀 Deploy to Vercel + Render

---

## 📦 Backend → Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "ready"
git remote add origin https://github.com/Aveek29/Blogify.git
git push -u origin main
```

### Step 2: Create Render Web Service
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. **Dashboard → New + → Web Service**
3. Connect your `Blogify` repo
4. Configure:

| Setting | Value |
|---------|-------|
| Name | `devblog-backend` |
| Root Directory | `backend/` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Plan | Free |

5. Add **Environment Variables** (click "Advanced" → "Add Environment Variable"):

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://...` (your Atlas string) |
| `JWT_SECRET` | any random string |
| `GROQ_API_KEY` | from console.groq.com |

6. Click **Create Web Service**

Render will build and deploy. Wait 2-3 minutes, then copy the URL:  
**`https://devblog-backend.onrender.com`**

### Step 3: Test Backend
Open `https://devblog-backend.onrender.com/api/health` → should show `{ "status": "ok" }`

### Step 4: MongoDB Atlas
Go to Atlas → Network Access → Add IP → `0.0.0.0/0` (allows Render to connect)

---

## 🎨 Frontend → Vercel

### Step 1: Create Vercel Project
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New → Project**
3. Import your `Blogify` repo
4. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `frontend/` |
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |

5. **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://devblog-backend.onrender.com` |

6. Click **Deploy**

### Step 2: Done
Vercel gives you a URL: **`https://blogify.vercel.app`**

Your SPA routing is handled automatically by the `vercel.json` rewrite rule.

---

## 🔗 Final System Flow

```
User → Vercel (blogify.vercel.app)
              │
              ▼
        Render API (devblog-backend.onrender.com/api/*)
              │
              ▼
        MongoDB Atlas
```

## ⚡ 3 Things to Set

| # | Where | Key | Value |
|---|-------|-----|-------|
| 1 | Render Dashboard | `MONGODB_URI` | Your Atlas connection string |
| 2 | Render Dashboard | `JWT_SECRET` | Random secret |
| 3 | Vercel Dashboard | `VITE_API_URL` | `https://your-app.onrender.com` |
