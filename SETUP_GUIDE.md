# TaskPlanet Social App — Complete Setup & Deployment Guide

## Project Structure

```
taskplanet-social/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreatePostBar.js
│   │   │   ├── CreatePostModal.js
│   │   │   ├── LoadingSpinner.js
│   │   │   ├── Navbar.js
│   │   │   └── PostCard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Feed.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
├── .gitignore
└── render.yaml
```

---

## Prerequisites

Install these tools first:
- **Node.js v18+** → https://nodejs.org
- **Git** → https://git-scm.com
- **VS Code** (recommended) → https://code.visualstudio.com

---

## STEP 1: Set Up External Services

### 1A. MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** → Sign up
3. Choose **Free Tier (M0)** → Select a region → Create Cluster
4. Go to **Database Access** → Add New User
   - Username: `taskplanet`
   - Password: Generate a strong password (save it!)
   - Role: **Atlas Admin**
5. Go to **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
6. Go to **Clusters** → **Connect** → **Connect your application**
   - Copy the connection string:
   - `mongodb+srv://taskplanet:<password>@cluster0.xxxxx.mongodb.net/taskplanet?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

### 1B. Cloudinary (Free Image Hosting)

1. Go to https://cloudinary.com → Sign up free
2. After login, go to **Dashboard**
3. Copy these 3 values:
   - Cloud Name
   - API Key
   - API Secret

---

## STEP 2: Local Development Setup

### Clone / Set up the project

```bash
# If using the provided code, create the folder and add the files
# Or if cloning from GitHub:
git clone https://github.com/YOUR_USERNAME/taskplanet-social.git
cd taskplanet-social
```

### Set up Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env
```

Now **edit `backend/.env`** with your actual values:

```env
PORT=5000
MONGO_URI=mongodb+srv://taskplanet:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskplanet?retryWrites=true&w=majority
JWT_SECRET=make_this_a_long_random_string_like_xK9mP2qR7vN4tL1
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

```bash
# Start backend server
npm run dev
# ✅ Should show: MongoDB connected + Server running on port 5000
```

### Set up Frontend

```bash
# Open a NEW terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `frontend/.env`:**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
# Start frontend
npm start
# ✅ Opens at http://localhost:3000
```

---

## STEP 3: Test Locally

1. Open http://localhost:3000
2. Click **Sign Up** → Create an account
3. You'll be redirected to the Feed
4. Click **"What's on your mind?"** → Write a post → Click Post
5. Like and comment on posts
6. Try logging out and back in

---

## STEP 4: Deploy to GitHub

### Create Repository

1. Go to https://github.com → New Repository
2. Name: `taskplanet-social`
3. Set to **Public**
4. Don't initialize with README (you have existing code)

### Push Code

```bash
# From project root (taskplanet-social/)
git init
git add .
git commit -m "Initial commit: TaskPlanet Social App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/taskplanet-social.git
git push -u origin main
```

---

## STEP 5: Deploy Backend to Render

1. Go to https://render.com → Sign up with GitHub
2. Click **New** → **Web Service**
3. Connect your **taskplanet-social** repository
4. Fill in settings:
   - **Name:** `taskplanet-social-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Click **Add Environment Variables** → Add all these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | Your MongoDB Atlas URI |
| `JWT_SECRET` | Your long random string |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `CLIENT_URL` | `https://YOUR_FRONTEND.vercel.app` (update after frontend deploy) |

6. Click **Create Web Service**
7. Wait 2-3 minutes → Copy your backend URL:
   `https://taskplanet-social-backend.onrender.com`

> ⚠️ **Free Render servers sleep after 15 min of inactivity** and take ~30s to wake up on first request. This is normal.

---

## STEP 6: Deploy Frontend to Vercel

1. Go to https://vercel.com → Sign up with GitHub
2. Click **New Project** → Import `taskplanet-social`
3. Settings:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Click **Environment Variables** → Add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://taskplanet-social-backend.onrender.com/api` |

5. Click **Deploy**
6. Wait 1-2 minutes → Your app is live at:
   `https://taskplanet-social-YOUR_NAME.vercel.app`

---

## STEP 7: Final Configuration

After Vercel gives you the URL, go back to **Render**:
1. Open your backend service
2. Go to **Environment** tab
3. Update `CLIENT_URL` to your Vercel URL: `https://taskplanet-social-xyz.vercel.app`
4. Click **Save Changes** → Render will redeploy automatically

---

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/posts?page=1&limit=10&filter=all` | ❌ | Get all posts |
| POST | `/api/posts` | ✅ | Create post (multipart) |
| PATCH | `/api/posts/:id/like` | ✅ | Like/unlike post |
| POST | `/api/posts/:id/comment` | ✅ | Add comment |
| GET | `/api/posts/:id/comments` | ❌ | Get comments |
| DELETE | `/api/posts/:id` | ✅ | Delete own post |

---

## Troubleshooting

### Backend won't connect to MongoDB
- Double-check the MONGO_URI format
- Make sure IP Whitelist in MongoDB Atlas has 0.0.0.0/0
- Check username/password in the URI

### Images not uploading
- Verify all 3 Cloudinary env vars are correct
- Check file size is under 5MB

### CORS errors in browser
- Make sure `CLIENT_URL` in backend `.env` matches your frontend URL exactly
- On Render, update the env var and redeploy

### "Not authorized" errors
- The JWT token may be expired — log out and log in again
- Check that `JWT_SECRET` is the same across all deploys

### Render backend takes long to respond
- Normal on Free tier — server sleeps after inactivity
- First request after sleep takes 30-50 seconds

---

## MongoDB Collections

Only **2 collections** are used (as per task requirement):

**users** — stores user accounts
```json
{
  "_id": "ObjectId",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "<bcrypt hash>",
  "avatar": "",
  "bio": "",
  "followers": [],
  "following": [],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**posts** — stores all posts with embedded comments
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref users)",
  "username": "john_doe",
  "avatar": "",
  "text": "Post content here",
  "image": "https://cloudinary.com/...",
  "likes": ["ObjectId", "ObjectId"],
  "likedBy": ["john_doe", "jane_doe"],
  "comments": [
    {
      "_id": "ObjectId",
      "user": "ObjectId",
      "username": "jane_doe",
      "text": "Nice post!",
      "createdAt": "..."
    }
  ],
  "shares": 0,
  "createdAt": "2024-01-01T00:00:00Z"
}
```
