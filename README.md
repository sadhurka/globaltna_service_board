# GlobalTNA — Mini Service Request Board

A full-stack web application designed for homeowners to post service requests and tradespeople to search, browse, view, and manage them. 

Built for the **GlobalTNA Full-Stack Developer Intern Technical Assessment**, this application features a beautiful, highly polished custom design system built with plain CSS, featuring custom glassmorphism components, harmonic color palettes, micro-animations, and administrative security control.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Styling** | Plain CSS (Custom Design System, Glassmorphism, Dark/Harmonic Aesthetics) |
| **Testing** | Jest + Supertest |

---

## 📁 Project Structure

```text
globaltna/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js            # Password-token verification middleware for administrative actions
│   │   ├── models/
│   │   │   └── JobRequest.js      # Mongoose schema and MongoDB Text Index definition
│   │   ├── routes/
│   │   │   ├── auth.js            # Administration login and session creation
│   │   │   └── jobs.js            # REST API endpoints for job requests
│   │   ├── index.js               # Express application entry & DB connection
│   │   ├── seed.js                # Database seeder (inserts 8 realistic service jobs)
│   │   └── __tests__/
│   │       └── jobs.test.js       # Jest & Supertest integration tests
│   ├── .env                       # Local backend environment configuration
│   └── package.json               # Backend dependencies, Jest setup, and run scripts
└── frontend/
    ├── app/
    │   ├── admin/
    │   │   └── page.js            # Administrative password authentication page
    │   ├── jobs/
    │   │   ├── [id]/
    │   │   │   └── page.js        # Detailed job request view with status management controls
    │   │   └── new/
    │   │       └── page.js        # Interactive service request submission form
    │   ├── globals.css            # Core design tokens, gradients, custom CSS variables
    │   ├── layout.js              # Global layout with responsive navbar
    │   └── page.js                # Service request feed with dynamic filtering and keyword search
    ├── components/
    │   └── Badges.js              # Reusable state & category visual tags
    ├── lib/
    │   └── api.js                 # API fetch wrapper with sanitization and helper methods
    ├── .env                       # Local frontend environment configuration
    └── package.json               # Frontend dependencies, Next.js build and run scripts
```

---

## 🔑 Required Environment Variables

To run the application, configure the `.env` environment files located inside both the `frontend/` and `backend/` directories.

### 1. Backend Configuration (`backend/.env`)

Configure these key-value pairs in `backend/.env`:

| Variable | Type | Default Value | Description |
|---|---|---|---|
| `PORT` | Number | `5000` | The port the Express.js server listens on. |
| `MONGODB_URI` | String | `mongodb://user1:user1@ac-eutd3lz-shard-00-00.vry2zue.mongodb.net:27017,ac-eutd3lz-shard-00-01.vry2zue.mongodb.net:27017,ac-eutd3lz-shard-00-02.vry2zue.mongodb.net:27017/?ssl=true&replicaSet=atlas-qhpmpj-shard-0&authSource=admin&appName=Cluster0` | MongoDB Connection URI (Local database or MongoDB Atlas cluster connection string). |
| `ADMIN_PASSWORD` | String | `GlobalTnaAdmin2026` | The administrative passcode required to access trade management operations. |

### 2. Frontend Configuration (`frontend/.env`)

Configure this key-value pair in `frontend/.env`:

| Variable | Type | Default Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | String | `http://localhost:5000` | The absolute base URL pointing to the running backend Express API. |

---

## 🛠️ Setup & Run Instructions

Ensure you have **Node.js (v18 or higher)** installed. The MongoDB Atlas sandbox is already configured directly in the environment files.

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd globaltna
```

### Step 2: Backend Setup & Running
1. Navigate into the backend folder:
   ```bash
   cd backend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. **Configure your Environment:**
   Open the existing `.env` file in the `backend/` directory in your text editor and verify or update the `PORT`, `MONGODB_URI` (pre-configured with the live MongoDB Atlas string), and `ADMIN_PASSWORD` as needed.

4. **Seed Sample Data (Highly Recommended):**
   Run the database seeder to populate the MongoDB database with 8 realistic mock service requests:
   ```bash
   npm run seed
   ```

5. **Start the Backend Server:**
   * **Development Mode** (Runs with Live Reload using `nodemon`):
     ```bash
     npm run dev
     ```
     *Server will run at: http://localhost:5000*
   * **Production Mode**:
     ```bash
     npm start
     ```

---

### Step 3: Frontend Setup & Running
1. Open a new terminal tab/window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. **Configure your Environment:**
   Open the existing `.env` file in the `frontend/` directory in your text editor and verify that `NEXT_PUBLIC_API_URL` points to the running backend (default is `http://localhost:5000`).

4. **Start the Frontend Application:**
   * **Development Mode** (Next.js development server):
     ```bash
     npm run dev
     ```
     *Application will run at: http://localhost:3000*
   * **Production Build**:
     ```bash
     npm run build
     npm start
     ```

Now, navigate to **[http://localhost:3000](http://localhost:3000)** in your browser to experience the application!

---

## 🧪 Running Integration Tests

Our backend is fully tested using **Jest** and **Supertest** on independent endpoints (running against an isolated test database `globaltna_test` to keep development data pristine).

To execute the suite:
```bash
cd backend
npm test
```

### Test Coverage includes:
* **POST Request Validation:** Ensures missing or invalid parameters (e.g., malformed email addresses) fail gracefully.
* **GET Filters & Full-Text Search:** Verifies that searches, status filters, and category queries filter correctly.
* **PATCH Validation:** Enforces permission controls, preventing status modifications without administrative headers.
* **DELETE Protection:** Guarantees that only authentic trade administrators can remove service request listings.

---

## 📡 API Endpoints Reference

The backend exposes a highly robust RESTful JSON API on the base URL `http://localhost:5000`.

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | None | Authenticates administrative password and returns the session token. |
| `GET` | `/api/jobs` | None | Lists all jobs. Supports query filters: `?category=`, `?status=`, and text index query `?search=`. |
| `GET` | `/api/jobs/:id` | None | Fetches detailed info for a single job request. |
| `POST` | `/api/jobs` | **Required (Bearer Token)** | Creates a new homeowner service request (validates email, phone, and category). |
| `PATCH` | `/api/jobs/:id` | None | Updates job state (`Open` ➡️ `Accepted` ➡️ `Completed`). |
| `PUT` | `/api/jobs/:id` | **Required (Bearer Token)** | Updates all job details. |
| `DELETE` | `/api/jobs/:id` | None | Deletes a job request permanently. |

*All responses are standard JSON formatted as `{ success: true, data: ... }` or `{ success: false, message: ... }`.*

---

## ✨ Features Implemented

* 🔍 **Smart Keyword Search & Category/Status Filters:** Leverages a high-performance MongoDB text index for robust matching across titles and descriptions.
* 🔐 **Secure Administration Control:** Fully protected endpoints requiring administrative passcode validation.
* ⚡ **Next.js 14 App Router Architecture:** Utilizes layout routing, smooth state transitions, and responsive server-client synergy.
* 🎨 **Breathtaking Custom Aesthetic:** Plain CSS style rules, fluid grid alignments, glassmorphism containers, smooth hover scales, active feedback elements, and custom status badge layouts.
