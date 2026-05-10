# SWEEPER.CO - Home Cleaning Subscription Startup

This is a modern, premium MERN stack application built for SWEEPER.CO, a local home cleaning subscription startup.

## Features

- **Frontend:** React.js + Vite, Tailwind CSS (v4), Framer Motion, Lucide React
- **Backend:** Node.js, Express.js, MongoDB
- **Design:** Modern minimal, soft premium, glassmorphism, responsive, mobile-first.
- **WhatsApp Integration:** Dynamic subscription inquiry via WhatsApp.
- **Admin Dashboard:** Secure JWT-based admin dashboard to manage inquiries.

## Project Structure

```text
swepper/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── layouts/     # Page layouts (Main, Admin)
│   │   ├── pages/       # Home, Admin Login, Admin Dashboard
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
└── backend/           # Node.js + Express backend
    ├── config/        # Database configuration
    ├── middleware/    # Auth middleware
    ├── models/        # Mongoose schemas
    ├── routes/        # API routes
    ├── server.js      # Entry point
    └── package.json
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   node server.js
   ```
   *(Optional: Run `node seedAdmin.js` to create the default admin account `admin@sweeper.co` / `adminpassword123`)*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend folder (or use `.env.local`) and add:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment Guide

### Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string.
3. Replace the `MONGO_URI` in the backend environment variables with your Atlas string.

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI`: (Your Atlas string)
   - `JWT_SECRET`: (Your secret)
7. Deploy. Note your Render URL (e.g., `https://sweeper-api.onrender.com`).

### Frontend (Vercel)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the project.
3. Set the Framework Preset to `Vite`.
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add Environment Variables:
   - `VITE_API_URL`: (Your backend URL from Render)
8. Deploy.

## Admin Access
Default admin credentials:
- **Email:** admin@sweeper.co
- **Password:** adminpassword123
*(Please change this in production)*
