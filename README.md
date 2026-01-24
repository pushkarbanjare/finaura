# Finaura — Personal Finance & Expense Intelligence App
Finaura is a full-stack personal finance application built with Next.js App Router, focusing on secure authentication, real-world backend practices, and clean analytics-driven UI.
It allows users to track expenses, analyze monthly spending patterns, and manage financial goals in a secure, multi-user environment.

**Link: https://finaura-app.vercel.app/**

### Demo Access
To explore the application without creating an account, you can use the demo credentials below:\
Email: test@mail.com | Password: 123456

The demo account includes pre-filled expense data which allows you to view analytics and overall user experience for <u>December 2025</u> & <u>January 2026</u>

### Features
- Session-based authentication using HttpOnly cookies (JWT-backed)
- Rate-limited auth to prevent abuse and spam 
- Monthly analytics with interactive Bar and Donut charts
- Protected routes with server-side session validation
- Category-wise spending breakdown
- Profile settings (name, salary, goal amount/year)  
- Responsive UI with clean layout  
- Custom toast notifications  
- Optimized UX for desktop and mobile

### Security & Backend Highlights
- HttpOnly cookie-based sessions
- Centralized session validation for protected APIs
- Zod-based request validation for all mutations
- Secure logout with session invalidation
- Server-first data fetching using Next.js App Router

### Tech Stack
- **Frontend:** Nextjs, React, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB, Mongoose
- **Auth:** JWT-backed sessions via HttpOnly cookies
- **Validation:** Zod
- **Security:** Rate limiting, protected routes
- **Charts:** Recharts

### Architecture
- Server Components for protected pages
- Client Components only where interactivity is required
- Centralized auth/session utilities
- Consistent API error handling and response structure