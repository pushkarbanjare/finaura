# FinAura

FinAura is an Automated Financial Intelligence Platform that transforms raw expense data into actionable savings strategies. By bridging the gap between current income and future financial targets, it provides users with high-performance data visualization and scalable financial planning tools.

**Live at: https://finaura-app.vercel.app/**

## PROBLEM STATEMENT

Traditional expense tracking is often manual, retrospective, and disconnected from long-term objectives. Most methods:

- **Lack Depth**: Provide static lists rather than behavioral insights.
- **Manual Friction**: High user effort leads to inconsistent tracking.
- **Goal Isolation**: Expenses are viewed in a vacuum, failing to connect daily spending to future savings targets.

## SOLUTION

FinAura delivers an Expense Intelligence Ecosystem that:

- **Automates Classification**: Uses an intelligent categorization engine to reduce manual input.
- **Analyzes Volatility**: Calculates Month-over-Month (MoM) analytics to identify spending outliers.
- **Forecasts Growth**: Connects current expenditure patterns with predictive goal-tracking modules.
- **Visualizes Behavior**: Transforms data into interactive trend analysis and category distribution models.

## ARCHITECTURE

1. **Frontend**
   - **Next.js App Router**: Optimized for fast, edge-based rendering.
   - **Recharts Integration**: Responsive, data-heavy visualizations for behavioral tracking.
2. **Backend**
   - **LLM Ingestion Engine**: Integrated AI layer for semantic analysis and automated data labeling.
   - **Zod Schema Validation**: Strict server-side type-safety and data integrity.
   - **Singleton Pattern**: Optimized MongoDB/Mongoose connection pooling for serverless performance.
3. **Security Layer**
   - **Authentication**: JWT session management with Bcrypt hashing.
   - **Data Protection**: HTTP-only cookies and protected middleware layers.
   - **Traffic Control**: API rate-limiting to prevent brute-force and DDoS vectors.

## FEATURES

   - **Automated Intelligence**: Smart categorization of raw expense items using LLM and tranforms into structured financial buckets.
   - **Predictive Goal Tracking**: Real-time monitoring of savings targets vs. actual expenditure velocity.
   - **Volatility Analytics**: Dynamic dashboards utilizing MoM analysis to identify spending trends and anomalies.
   - **Data Integrity**: Multi-layer validation ensuring zero-leakage in financial reporting.

## DATA PROCESSING FLOW

   1. **Ingestion**: User records expense; payload is validated via Zod schemas.
   2. **Intelligence**: Category is auto-assigned; MoM volatility is updated in real-time.
   3. **Storage**: Atomic transactions in MongoDB ensure data consistency.
   4. **Aggregation**: Financial summaries are computed on-the-fly for the current billing cycle.
   5. **Visualization**: Data is piped into Recharts for interactive behavioral analysis.

## TECH STACK

   - **Frontend**: Next.js (React), Tailwind CSS, Recharts
   - **Backend**: Node.js, MongoDB (Mongoose), Zod, LLM Ingestion Engine
   - **Security**: JWT, Bcrypt, Rate-Limiting Middleware

## FUTURE IMPROVEMENTS

- AI-based spending predictions
- Recurring expense detection
- Anomaly detection in spending
- Exportable financial reports
