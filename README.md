# GlobalTNA — Service Request Board

A full-stack web application designed for homeowners to post service requests and tradespeople to manage them.

---

## 🔗 Dedicated Repositories

To track commits and codebases independently, the project is separated into two dedicated sub-repositories:

* 🖥️ **Frontend App**: [github.com/sadhurka/frontend](https://github.com/sadhurka/frontend)
* ⚙️ **Backend API**: [github.com/sadhurka/backend](https://github.com/sadhurka/backend)

---

## 🔑 Required Environment Variables

To run the application locally, verify or configure the `.env` files in both the `backend/` and `frontend/` directories:

### 1. Backend Configuration (`backend/.env`)

    
```bash
PORT=5000
MONGO_URI=mongodb://<username>:<password>@ac-eutd3lz-shard-00-00.vry2zue.mongodb.net:27017,ac-eutd3lz-shard-00-01.vry2zue.mongodb.net:27017,ac-eutd3lz-shard-00-02.vry2zue.mongodb.net:27017/?ssl=true&replicaSet=atlas-qhpmpj-shard-0&authSource=admin&appName=Cluster0
ADMIN_PASSWORD=1111
```
  * *Credentials:* Username: `user1` | Password: `user1`


### 2. Frontend Configuration (`frontend/.env`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```
---

## 🛠️ Setup & Run Instructions

Ensure you have **Node.js (v18 or higher)** installed.

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

To run the integrated Express endpoint suite:
```bash
cd backend
npm test
```

---

## 📡 API Endpoints Reference

All endpoints use `http://localhost:5000` as their base URL.

| Method | Endpoint | Authentication | Description |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/api/auth/login` | None | Authenticate admin passcode and receive session token. |
| **`GET`** | `/api/jobs` | None | Fetch all jobs (Supports filters: `?category=`, `?status=`, `?search=`). |
| **`GET`** | `/api/jobs/:id` | None | Fetch details of a single job post. |
| **`POST`** | `/api/jobs` | **Admin Token** | Create a new homeowner service request. |
| **`PATCH`** | `/api/jobs/:id` | None | Update job status (`Open` ➡️ `In Progress` ➡️ `Closed`). |
| **`PUT`** | `/api/jobs/:id` | **Admin Token** | Edit all fields of a job post. |
| **`DELETE`** | `/api/jobs/:id` | None | Delete a job post permanently from the board. |
