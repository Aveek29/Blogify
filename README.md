# Blogify

A full-stack blog platform with CRUD, JWT auth, Groq AI chatbot, 70+ categories, and image uploads.

**Frontend** → Vercel · **Backend** → Render · **Database** → MongoDB Atlas

## Features

- Full CRUD blog posts with image upload
- JWT authentication (login/register)
- Groq AI assistant chatbot (12 languages)
- 70+ categories with searchable selector
- 12 themes (dark/light variants)
- Owner-only edit/delete
- Search & pagination
- Fully responsive

## Quick Deploy

### Backend → Render

1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo → select `backend/` as root directory
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   - `MONGODB_URI` — your MongoDB Atlas string
   - `JWT_SECRET` — random string
   - `GROQ_API_KEY` — from console.groq.com
7. Deploy → copy the URL (e.g. `https://devblog-backend.onrender.com`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo → select `frontend/` as root directory
3. Framework preset: **Vite**
4. Environment variable:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com`
5. Deploy

## Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Frontend at `http://localhost:3000`, backend at `http://localhost:5000`.

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<random_string>
GROQ_API_KEY=<groq_api_key>
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, Vite, React Router |
| Styling | Custom CSS (HSL vars, glassmorphism) |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcryptjs |
| AI | Groq SDK (Llama 3.1) |
| Hosting | Vercel + Render |

## Author

**Aveek29** — [GitHub](https://github.com/Aveek29)
