# FinSight — Finance Dashboard


## Overview

FinSight is a personal finance dashboard built as part of the Zorvyn FinTech 
frontend screening assignment. It allows users to track financial activity, 
explore transactions, and understand spending patterns through clean 
visualizations — all powered by mock data and client-side state.

---

## Live Demo

🔗 [finsight-demo.vercel.app](https://your-vercel-url.vercel.app)

- Toggle between **Admin** (add/edit) and **Viewer** (read-only) roles
- All transactions are pre-loaded; data persists via localStorage

---

## What is included

- Dashboard overview with summary cards for balance, income, and expenses
- Time-based chart for balance trend
- Category-based chart for spending breakdown
- Transactions section with search, filter, and sorting
- Role-based UI with `Admin` and `Viewer` modes
- Admin actions to add, edit, and delete transactions
- Insights section with top category, month-over-month comparison, and merchant/activity observations
- Empty states for views with no data
- Dark mode
- Local storage persistence for transactions and theme preference
- CSV export for transactions

---

## Screenshots

| Dashboard | Transactions | Insights |
|---|---|---|
|  | ![](./screenshots/transactions.png) | ![](./screenshots/insights.png) |

---

## Features


| Feature | Details |
|---|---|
| Dashboard Overview | Summary cards with animated counters, area chart, donut chart |
| Transactions | Search, filter by category/type, sort by date/amount |
| Role-based UI | Admin adds/edits; Viewer is read-only with smooth transition |
| Insights | Top category, MoM comparison, most visited merchant, bar chart |
| State Management | React Context + useState, memoized derived values |
| Responsiveness | Mobile sidebar collapses, table adapts, FAB on small screens |
| Empty States | Illustrated zero-result states for all filterable views |

---

## Tech stack

- React
- Vite
- Tailwind CSS v4
- Recharts
- Lucide React

---

## Setup

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

---


## File Structure
```
src/
├── components/
│   ├── dashboard/        # SummaryCards, BalanceTrendChart, SpendingPieChart
│   ├── transactions/     # TransactionsTable with search/filter/sort
│   ├── insights/         # InsightsPanel, monthly bar chart
│   └── shared/           # Sidebar, Header, EmptyState, AddTransactionModal
├── context/
│   └── DashboardContext.jsx   # Global state + dispatch
├── data/
│   └── transactions.js        # 61 mock transactions, Jan–Mar 2026
├── hooks/
│   └── useAnimatedCounter.js  # requestAnimationFrame counter
└── utils/
    └── formatters.js          # INR formatting, date, CSV export
```

---

## State Management

**Approach: React Context + useState**

Chose Context over Redux/Zustand deliberately — the data model is flat
(one transactions array + a few UI flags) and a single-page dashboard
doesn't warrant the boilerplate. Key decisions:

- `useCallback` on all dispatch functions to prevent child re-renders
- `useMemo` for all derived values (filtered list, chart aggregations,
  category totals) — computed once at context level, not in each component
- No selector pattern needed at this scale; would add one if the context
  grew beyond 5–6 consumers

**State shape:**
```javascript
{
  transactions: Transaction[],
  activeFilters: { category: string, type: string, search: string },
  selectedRole: 'admin' | 'viewer',
  darkMode: boolean,
  activeSection: 'dashboard' | 'transactions' | 'insights'
}
```

---

## Notes

- The app uses mock data and does not depend on a backend
- Transactions are stored in local storage so changes remain after refresh
- This is an assignment submission, so the focus is clarity, structure, and frontend behavior rather than production-scale architecture

---

## Trade-offs

- No backend or server-side validation
- No authentication or real RBAC
- No pagination or API integration
- No automated tests included in this version

---

## Mock Data

61 transactions across Jan–Mar 2026:
- Indian merchants: Swiggy, Zomato, Amazon, Netflix, Uber, HDFC, Nykaa, etc.
- 8 categories: Food & Dining, Transport, Entertainment, Utilities,
  Rent, Shopping, Health, Income
- INR amounts: ₹89 (Ola ride) to ₹85,000 (monthly salary)
- 3-month spread with realistic spending patterns

---

*Built by [Ayush Sen](https://www.linkedin.com/in/ayushsen07) · 
Submission for Zorvyn FinTech Frontend Intern screening*