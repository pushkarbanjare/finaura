# FinAura

FinAura is a Personal Finance Management Platform designed to help users track their expenses, analyze spending patterns, and monitor financial goals through real-time analytics and automated categorization.The platform combines secure authentication, structured data processing, and interactive financial visualizations to deliver actionable insights into user spending behaviour.

**Live at: https://finaura-app.vercel.app/**

## PROBLEM STATEMENT

Most individuals track expenses manually or not at all. Traditional tracking methods:

- Provide limited financial insights
- Fail to visualize spending behaviour
- Do not connect expenses with savings goals

This results in poor financial awareness and weak decision-making.

## SOLUTION

FinAura provides an integrated expense intelligence platform that:

- Records and categorizes expenses
- Calculates savings and financial summaries
- Generates monthly analytics dashboards
- Visualizes financial behaviour
- Tracks progress toward savings goals

## ARCHITECTURE

1. **Frontend**
   - Next.js App Router
   - React client components
   - Interactive financial charts (Recharts)
   - Responsive dashboard UI
2. **Backend**
   - Next.js API routes (REST architecture)
   - JWT session-based authentication
   - MongoDB database
   - Zod schema validation
   - Rate limiting middleware
3. **Security Layer**
   - Bcrypt password hashing
   - HTTP-only session cookies
   - Request rate limiting
   - Input validation schemas

## FEATURES

- **Secure Authentication:** JWT session management with Bcrypt password hashing and HTTP-only cookies.
- **Expense Intelligence:** Automated categorization engine with support for metadata and notes.
- **Financial Analytics:** Dynamic dashboards using Recharts for category distribution and trend analysis.
- **Goal Tracking:** Real-time monitoring of savings targets vs. actual expenditure.
- **Data Integrity:** Strict server-side validation using Zod schemas and API rate limiting.

## API MODULE

1. **Authentication**: signup, login, logout
2. **Expense Management**: add, update, delete, list expenses
3. **Financial Analytics**: monthly summary, spending insights
4. **User Profile**: fetch profile, update profile

## DATABASE MODEL

1. **User**: Name, Email, Password, Salary, Savings Goals.
2. **Expense**: Amount, Item, Merchant, Category, Date, User Reference

## DATA PROCESSING FLOW

1. User records expense
2. Input validated via schema
3. Category auto-generated
4. Stored in MongoDB
5. Monthly aggregation computed
6. Dashboard analytics generated
7. Visual charts rendered

## TECH STACK

- **Frontend**: Next.js, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Security**: Zod (Schemas-based validation)

## FUTURE IMPROVEMENTS

- AI-based spending predictions
- Recurring expense detection
- Anomaly detection in spending
- Exportable financial reports
