# GlobalTNA — Service Request Board

A full-stack web application designed for homeowners to post service requests and tradespeople to manage them.

---
seperated github repositories to track commits 

backend : https://github.com/sadhurka/backend
frontend : https://github.com/sadhurka/frontend

## 🔑 Required Environment Variables

To run the application, verify or configure the `.env` files in both the `backend/` and `frontend/` directories:

### 1. Backend (`backend/.env`)
- `PORT` — The port the backend server runs on (Default: `5000`)
- `MONGODB_URI` — Input your own MongoDB Atlas connection string or local database URL here (`mongodb://user1:<password>@ac-eutd3lz-shard-00-00.vry2zue.mongodb.net:27017,ac-eutd3lz-shard-00-01.vry2zue.mongodb.net:27017,ac-eutd3lz-shard-00-02.vry2zue.mongodb.net:27017/?ssl=true&replicaSet=atlas-qhpmpj-shard-0&authSource=admin&appName=Cluster0`) (username:user1 , password:user1)
- `ADMIN_PASSWORD` — The admin password to create or manage job posts (Default: `1111`)

### 2. Frontend (`frontend/.env`)
- `NEXT_PUBLIC_API_URL` — The API URL of the backend server (Default: `http://localhost:5000`)

---

## 🛠️ Setup & Run Instructions

Ensure you have **Node.js (v18 or higher)** installed on your machine.

### Step 1: Start the Backend Server
```bash
cd backend
npm install
npm run seed      # (Optional) Seed the database with sample job requests
npm run dev       # Starts the server on http://localhost:5000
```

### Step 2: Start the Frontend App
Open a new terminal tab/window and run:
```bash
cd frontend
npm install
npm run dev       # Starts the application on http://localhost:3000
```

Once both servers are running, open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🧪 Running Tests

To run the integration endpoint tests:
```bash
cd backend
npm test
```

---

## 📡 API Endpoints

All endpoints use `http://localhost:5000` as their base URL.

- **`POST` `/api/auth/login`** — Validate admin password and get session token
- **`GET` `/api/jobs`** — List all jobs (Supports filters: `?category=`, `?status=`, `?search=`)
- **`GET` `/api/jobs/:id`** — Get a single job's details
- **`POST` `/api/jobs`** — Create a new job post (Requires Admin Bearer Token)
- **`PATCH` `/api/jobs/:id`** — Update job status (`Open`, `In Progress`, `Closed`)
- **`PUT` `/api/jobs/:id`** — Edit all job details (Requires Admin Bearer Token)
- **`DELETE` `/api/jobs/:id`** — Delete a job post permanently
