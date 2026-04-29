# Mern-auth-2

A full-stack authentication system with email verification and password reset. Built with the MERN stack.

## Tech stack

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express 5 + MongoDB + Mongoose + JWT + Nodemailer

## Features

- Sign up / Sign in / Sign out
- Email verification on registration
- Password reset via email link
- JWT stored in HttpOnly cookies
- Protected frontend routes

## Getting started

```bash
git clone https://github.com/astrolabscig/Mern-auth-2.git
cd Mern-auth-2
npm install
npm install --prefix frontend
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS
```

**Dev:**  
```bash
npm run dev          # backend (port 5000)
npm run dev --prefix frontend  # frontend (port 5173)
```

**Production:**  
```bash
npm run build && npm start
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Sign in |
| POST | /api/auth/logout | Sign out |
| POST | /api/auth/verify-email | Verify OTP |
| POST | /api/auth/forgot-password | Send reset email |
| POST | /api/auth/reset-password/:token | Reset password |
| GET | /api/auth/check-auth | Get current user |

## Author

Joseph Afful - astrolabscig@gmail.com
