# Car Insurance Management System

SecureRide is a beginner-friendly car insurance management system built with the MERN stack.

## Features

- User registration and login with JWT authentication
- Admin and customer dashboards
- Agent and manager management for admins
- Account verification workflow for managers, agents, and customers
- Customer, vehicle, policy, claim, and payment management
- Customer claim submission and profile update
- Search and filter on management pages
- Responsive React UI with sidebar navigation

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios, Vite
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Security: bcrypt password hashing, JWT authentication

## Folder Structure

```text
car-insurance-management-system/
├── backend/
├── frontend/
├── screenshots/
├── README.md
└── package.json
```

## Setup

1. Install dependencies:

```bash
npm run install-all
```

2. Create backend environment file:

```bash
copy backend\.env.example backend\.env
```

3. Update `backend/.env` if needed. The project is already configured to use MongoDB Atlas.

4. Run the full app:

```bash
npm run dev
```

Frontend: `http://localhost:5175`

Backend API: `http://localhost:5002`

## Default Usage

Register a new account from the app. Choose `Admin` to access customer, vehicle, policy, claim, and payment management. Choose `Customer` to view policies, submit claims, and update your profile.
# SecureRide
