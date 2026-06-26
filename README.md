# FinAura
An AI-powered personal finance platform that automates expense tracking, budgeting, and transaction categorization using an asynchronous Redis-Spring Boot processing pipeline.

**Live Demo: https://finaura-app.vercel.app/**

## PROBLEM STATEMENT
Managing personal expenses manually is repetitive and time-consuming. Traditional expense trackers require users to categorize every transaction themselves and often provide limited insights into spending behavior.

## SOLUTION
FinAura automates expense management by combining intelligent categorization, real-time analytics, and asynchronous AI processing.
- Automatically categorizes expenses into financial buckets.
- Tracks monthly budgets and spending patterns.
- Visualizes expense distribution and monthly trends.
- Minimizes AI cost using multi-layer caching.

## ARCHITECTURE
`User -> Next.js Frontend -> Node.js APIs -> MongoDB (Expense saved as PROCESSING) -> Redis Queue (Upstash) -> Spring Boot Worker -> File Cache -> MongoDB Cache -> Groq LLM -> MongoDB Updated (COMPLETED) -> Frontend Auto Refresh`

## KEY FEATURES
- AI-powered automatic expense categorization.
- Budget tracking with monthly spending insights.
- Interactive dashboards using Recharts.
- Background processing using Redis and Spring Boot.
- Cache-first categorization to minimize expensive LLM calls.
- Optimized MongoDB aggregation pipelines for fast dashboard loading.

## TECH STACK
- **Frontend**: Next.js, Tailwind CSS, Recharts
- **Backend**: Node.js, Spring Boot, MongoDB, Redis (Upstash)
- **AI**: Groq LLM, Rule-based File Cache, MongoDB Cache
- **Security**: JWT, Bcrypt, HTTP-only Cookies, Rate Limiting

## FUTURE IMPROVEMENTS
- OCR-based receipt scanning
- AI-powered spending recommendations
- Recurring expense detection
- Multi-currency support
- Exportable financial reports