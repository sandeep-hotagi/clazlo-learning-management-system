# Clazo LMS — Full-Stack Education Management System

Clazo is a production-ready Learning Management System (LMS) built with React (Vite), Node.js (Express), Socket.io, and MongoDB.

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      GitHub           │
                    │   Clazo Repository   │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ Vercel          │        │ Render          │
        │ React/Vite      │        │ Node/Express    │
        │ Frontend        │───────▶│ Backend         │
        └─────────────────┘        └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ MongoDB Atlas   │
                                    │ Production DB   │
                                    └─────────────────┘
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
npm run install-all
```

### 3. Run Locally
Start both backend and frontend concurrently:
```bash
npm start
```

- **Frontend**: `http://localhost:5176`
- **Backend API**: `http://localhost:5000/api`
- **Socket.IO Server**: `http://localhost:5000`

---

## 🚀 Production Deployment Guide

### 1. Backend Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure the deployment settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables in Render Dashboard:
   - `PORT`: `5000` (or leave default, Render sets `PORT` automatically)
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/clazlo?retryWrites=true&w=majority`
   - `JWT_SECRET`: `<your-super-secret-jwt-key>`
   - `CLIENT_ORIGIN`: `https://your-app-name.vercel.app`
   - `SERVER_PUBLIC_URL`: `https://your-backend-name.onrender.com`

---

### 2. Frontend Deployment (Vercel)

1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set Environment Variables in Vercel Dashboard:
   - `VITE_API_URL`: `https://your-backend-name.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://your-backend-name.onrender.com`
4. Vercel automatically reads `client/vercel.json` for SPA route rewrites (`/* -> /index.html`).

---

## 📁 Key Directories

```text
Clazo Final/
├── client/                 # React (Vite) Frontend
│   ├── src/                # Pages, Components, Context, Utils
│   ├── vercel.json         # SPA Rewrite Rules for Vercel
│   └── .env.example        # Frontend Environment Variables Template
├── server/                 # Node.js (Express) Backend
│   ├── models/             # Mongoose Schemas (User, Feedback, Exam, etc.)
│   ├── routes/             # Express API Endpoints
│   ├── index.js            # Server Entry Point & Socket.IO Setup
│   └── .env.example        # Backend Environment Variables Template
├── package.json            # Workspace Concurrent Scripts
└── README.md               # Project Deployment & Setup Guide
```
