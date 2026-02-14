Finaura
=======

Finaura is a full-stack personal finance management system designed to help users track expenses, analyze spending patterns, and monitor financial goals through real-time analytics and automated categorization.The platform combines secure authentication, structured data processing, and interactive financial visualizations to deliver actionable insights into user spending behaviour.

**Live Link: https://finaura-app.vercel.app/**

> **PROBLEM STATEMENT**

Most individuals track expenses manually or not at all. Traditional tracking methods:
- Lack automated categorization
- Provide limited financial insights
- Fail to visualize spending behaviour
- Do not connect expenses with savings goals

This results in poor financial awareness and weak decision-making.

> **SOLUTION**

Finaura provides an integrated expense intelligence platform that:
- Records and manages expenses
- Automatically categorizes spending
- Calculates savings and financial summaries
- Generates monthly analytics dashboards
- Visualizes financial behaviour
- Tracks progress toward savings goals

> **ARCHITECTURE**
1. #### Frontend
    - Next.js App Router
    - React client components
    - Interactive financial charts (Recharts)
    - Responsive dashboard UI

2. #### Backend
    - Next.js API routes (REST architecture)
    - JWT session-based authentication
    - MongoDB database
    - Zod schema validation
    - Rate limiting middleware

3. #### Security Layer
    - Bcrypt password hashing
    - HTTP-only session cookies
    - Request rate limiting
    - Input validation schemas

> **FEATURES**
1. #### Authentication & Security
    - Secure signup/login with hashed passwords
    - JWT-based session management
    - HTTP-only cookies
    - API rate limiting protection
    - Input validation using Zod schemas
2. #### Expense Management
    - Add, edit, delete, and list expenses
    - Automatic expense categorization engine
    - Timestamped transaction tracking
    - Merchant and notes metadata support
3. #### Financial Analytics Dashboard
    - Monthly spending summaries
    - Category-wise expenditure breakdown
    - Salary vs spending vs savings visualization
    - Dynamic month/year filtering
4. #### Savings Goal Tracking
    - Configurable savings target
    - Progress tracking visualization
    - Financial performance monitoring
5. #### Automated Expense Categorization
    - Rule-based classification across categories like grocery, travel, fast food, shopping, entertainment, health, bills, fuel, investments.
6. #### Data Visualization
    - Category distribution pie charts
    - Financial comparison bar charts
    - Interactive financial summaries

> **API MODULES**
1. **Authentication**: signup, login, logout
2. **Expense Management**: add , update , delete , list expenses
3. **Financial Analytics**: monthly summary, spending insights
4. **User Profile**: fetch profile, update profile

> **DATABASE MODELS**
1. **User**: name, email, password (hashed), salary, savings goal amount, target year
2. **Expense**: user reference, amount, item, merchant, notes, category, date

> **DATA PROCESSING FLOW**
1. User records expense
2. Input validated via schema
3. Category auto-generated
4. Stored in MongoDB
5. Monthly aggregation computed
6. Dashboard analytics generated
7. Visual charts rendered

> **TECH STACK**
- **Frontend**: Next.js, React, Tailwind CSS, Recharts
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB, Mongoose
- **Security**: JWT, bcrypt, Rate limiting, Zod schemas

> **FUTURE IMPROVEMENTS**
- AI-based spending predictions
- Bank API integration
- Recurring expense detection
- Anomaly detection in spending
- Exportable financial reports