# Goddess Aradhya - MERN BDSM Platform

This project implements a secure, high-aesthetic BDSM service platform.

## Architecture

This codebase provides a **Fully Functional Frontend Simulation** that works in the browser, plus the **Backend Source Code** for reference implementation.

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Custom Dark/Crimson Theme)
- **State**: React Context API (Auth + Data)
- **Features**: 
  - 18+ Age Gate (Persisted)
  - Role-Based Dashboard (Admin vs User)
  - Secure Gallery (Simulated)
  - Booking Request System

### Backend (Code Provided in `/server`)
- **Runtime**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Security**: Helmet, Rate Limiting, BCrypt, JWT
- **Storage**: Cloudinary (Image/Video)

## Setup Instructions

1. **Frontend**:
   - `npm install`
   - `npm run dev`
   
2. **Backend**:
   - Navigate to `/server`
   - Create `.env`:
     ```
     MONGO_URI=mongodb://localhost:27017/aradhya
     JWT_SECRET=supersecretkey
     CLOUDINARY_CLOUD_NAME=xxx
     CLOUDINARY_API_KEY=xxx
     CLOUDINARY_API_SECRET=xxx
     ```
   - `npm install`
   - `node server.js`

## Security Features
- **Age Verification**: Mandatory modal overlay.
- **Route Protection**: Gallery and Dashboards are protected via `ProtectedRoute` logic.
- **Data Validation**: Inputs are validated before submission.
- **RBAC**: Admin-only controls are conditionally rendered.

## Disclaimer
This is a fictional website generated for educational purposes regarding secure full-stack architecture.