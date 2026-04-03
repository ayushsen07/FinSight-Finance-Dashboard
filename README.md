# FinSight Finance Dashboard

FinSight — Finance Dashboard UI
Screening assignment submission for zorvyn FinTech | Built by Ayush Sen

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-2-ff6b6b)

---

## 🚀 Setup & Installation

```bash
# 1. Clone / navigate to the project
cd zorvyn-task

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardOverview.jsx    # Main dashboard layout
│   │   ├── SummaryCards.jsx         # Balance, Income, Expense cards
│   │   ├── BalanceTrendChart.jsx    # Area chart – running balance
│   │   └── SpendingPieChart.jsx     # Donut chart – category breakdown
│   ├── transactions/
│   │   └── TransactionsTable.jsx    # Full table with search/filter/sort
│   ├── insights/
│   │   └── InsightsPanel.jsx        # Smart observations & bar chart
│   └── shared/
│       ├── Sidebar.jsx              # Dark sidebar navigation
│       ├── Header.jsx               # Role toggle, dark mode, mobile menu
│       ├── EmptyState.jsx           # Zero-result empty states
│       └── AddTransactionModal.jsx  # Validated add-transaction form
├── context/
│   └── DashboardContext.jsx         # Global state via React Context
├── data/
│   └── transactions.js             # 60 mock transactions (Jan–Mar 2026)
├── hooks/
│   └── useAnimatedCounter.js       # Animated number counter hook
├── utils/
│   └── formatters.js               # Currency, date, CSV export utils
├── App.jsx                          # Root layout & section routing
├── main.jsx                         # Entry point
└── index.css                        # Tailwind + custom animations
```

---

## 🧠 State Management Rationale

### Why React Context + useState?

For a single-page dashboard of this scope, **React Context + useState** provides the optimal balance of simplicity and power:

- **No external dependencies** – Zero additional bundle size for state management
- **Sufficient for this scale** – The data model is flat (transactions array + a few UI flags); Redux or Zustand would be over-engineering
- **Single context, co-located logic** – `DashboardContext` holds all state and dispatch functions in one place, making the data flow easy to trace
- **Memoized callbacks** – `useCallback` prevents unnecessary re-renders of child components
- **Computed values at context level** – `totalIncome`, `totalExpenses`, and `balance` are derived in the provider, avoiding redundant calculations

### State Shape

```javascript
{
  transactions: [],       // Array of transaction objects
  activeFilters: {        // Current filter state
    category: '',
    type: '',
    search: ''
  },
  selectedRole: 'admin',  // 'admin' | 'viewer'
  darkMode: false,        // Dark mode toggle
  activeSection: 'dashboard' // Current sidebar section
}
```

---

## ⚙️ Tech Choices & Rationale

| Technology | Why |
|---|---|
| **React 19 + Vite 8** | Lightning-fast HMR, modern ESM-first tooling |
| **Tailwind CSS v4** | Utility-first CSS with the new Vite plugin for zero-config setup |
| **Recharts** | Lightweight, composable React charting library with excellent defaults |
| **Lucide React** | Modern, consistent icon set with tree-shakeable imports |
| **localStorage** | Lightweight persistence without backend – transactions survive page refreshes |

---

## ✨ Features

### Dashboard Overview
- 3 summary cards (Balance, Income, Expenses) with **animated counters on mount**
- Area chart showing balance trend over time
- Donut pie chart for spending by category with interactive legend

### Transactions
- Sortable table (date/amount) with row entrance animations
- Filter by category and type (income/expense)
- Search by merchant name with real-time filtering
- **CSV export** of filtered results
- Role-based "Add Transaction" button (admin only)

### Role-Based UI
- Prominent role toggle in header (Admin ↔ Viewer)
- Admin: sees "Add Transaction" button with modal form + validation
- Viewer: read-only experience

### Insights
- Top spending category card
- Month-over-month comparison with percentage change
- Most visited merchant
- Monthly Income vs Expenses bar chart
- Data-derived "Did you know?" observations

### Bonus Features
- ✅ **localStorage persistence** – transactions persist across sessions
- ✅ **CSV export** – download filtered transactions as CSV
- ✅ **Entrance animations** – slide-up, fade-in, scale-in with staggered delays
- ✅ **Dark mode** – full dark theme toggle with persistent preference
- ✅ **Responsive design** – mobile-first with sidebar overlay on small screens
- ✅ **Empty states** – graceful zero-result UI for all filterable views

### 🌟 Best Practices Implemented
- **Performance**: `useMemo` is used extensively for derived state (filtering, sorting, chart aggregations) to prevent unnecessary recalculations on re-renders.
- **Accessibility (a11y)**: Semantic HTML tags (`<header>`, `<nav>`, `<main>`), contrasting colors in the dark theme, and focus rings (`focus-visible`) for keyboard navigation.
- **Micro-interactions**: Subtle but impactful animations (staggered list entrances, numeric counters) using `requestAnimationFrame` for 60fps smoothness without bloating the bundle.
- **Component Modularity**: Large views are broken down into logical, reusable components (e.g. `InsightCard`, `SummaryCard`).
- **CSS-in-JS alternative**: Leveraged Tailwind v4's modern features to keep styles cleanly co-located without shipping a runtime CSS string parser.

---

## 🎨 Design Decisions

- **Color system**: Blue (#3b82f6) as primary accent, emerald for income, red for expenses – consistent fintech visual language
- **Dark sidebar** (#0f172a): Creates visual hierarchy and anchors navigation
- **Typography**: Inter font for professional, modern readability
- **Glassmorphism header**: backdrop-blur effect for depth
- **Micro-animations**: Staggered card entrances, hover effects, and animated counters create a polished feel

---

## ⚠️ Known Trade-offs

1. **No React Router** – Section switching is managed via context state; this is intentional per the single-page requirement but would need routing for deep-linking/bookmarking
2. **localStorage limits** – ~5MB per origin; sufficient for this demo but not suitable for production-scale data
3. **No backend validation** – All data validation is client-side only
4. **No pagination** – With 60 transactions rendering is instant, but 10,000+ would need virtual scrolling or API pagination
5. **Tailwind v4 (not v3)** – The project was initialized with v4's Vite plugin; kept it since it's production-ready and uses the same utility classes
6. **No unit tests** – Time constraints; would add Vitest + React Testing Library for production

---

## 📊 Mock Data

60 transactions across **January–March 2026** featuring:
- Real Indian merchants: Swiggy, Zomato, Amazon, Netflix, Uber, HDFC Credit Card, etc.
- 8 categories: Food & Dining, Transport, Entertainment, Utilities, Rent, Shopping, Health, Income
- Realistic INR amounts ranging from ₹89 to ₹85,000
- Mix of regular income (salary), freelance payments, and varied daily expenses

---

*Built with ❤️ by Ayush Sen for Zorvyn FinTech*
