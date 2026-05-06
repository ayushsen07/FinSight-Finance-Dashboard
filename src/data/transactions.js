// 60 realistic transactions across Jan–Mar 2026
// Categories: Food & Dining, Transport, Entertainment, Utilities, Rent, Shopping, Health
// Types: income, expense



const transactions = [
  // ── January 2026 ──────────────────────────────────────────
  { id: 1,  date: '2026-01-02', merchant: 'Salary Credit',           category: 'Income',          type: 'income',  amount: 85000 },
  { id: 2,  date: '2026-01-03', merchant: 'Swiggy',                  category: 'Food & Dining',   type: 'expense', amount: 456 },
  { id: 3,  date: '2026-01-04', merchant: 'Uber',                    category: 'Transport',        type: 'expense', amount: 312 },
  { id: 4,  date: '2026-01-05', merchant: 'Netflix',                 category: 'Entertainment',    type: 'expense', amount: 649 },
  { id: 5,  date: '2026-01-06', merchant: 'Electricity Bill - BSES', category: 'Utilities',        type: 'expense', amount: 2340 },
  { id: 6,  date: '2026-01-07', merchant: 'Amazon',                  category: 'Shopping',         type: 'expense', amount: 3499 },
  { id: 7,  date: '2026-01-08', merchant: 'Zomato',                  category: 'Food & Dining',   type: 'expense', amount: 589 },
  { id: 8,  date: '2026-01-09', merchant: 'Apollo Pharmacy',         category: 'Health',           type: 'expense', amount: 1230 },
  { id: 9,  date: '2026-01-10', merchant: 'Rent Payment',            category: 'Rent',             type: 'expense', amount: 18000 },
  { id: 10, date: '2026-01-11', merchant: 'Ola',                     category: 'Transport',        type: 'expense', amount: 245 },
  { id: 11, date: '2026-01-12', merchant: 'Freelance Payment',       category: 'Income',          type: 'income',  amount: 15000 },
  { id: 12, date: '2026-01-13', merchant: 'Starbucks',               category: 'Food & Dining',   type: 'expense', amount: 520 },
  { id: 13, date: '2026-01-15', merchant: 'HDFC Credit Card Payment',category: 'Utilities',        type: 'expense', amount: 8500 },
  { id: 14, date: '2026-01-16', merchant: 'Spotify',                 category: 'Entertainment',    type: 'expense', amount: 119 },
  { id: 15, date: '2026-01-18', merchant: 'Myntra',                  category: 'Shopping',         type: 'expense', amount: 2199 },
  { id: 16, date: '2026-01-20', merchant: 'Rapido',                  category: 'Transport',        type: 'expense', amount: 89 },
  { id: 17, date: '2026-01-22', merchant: 'McDonald\'s',             category: 'Food & Dining',   type: 'expense', amount: 350 },
  { id: 18, date: '2026-01-24', merchant: 'Airtel Recharge',         category: 'Utilities',        type: 'expense', amount: 599 },
  { id: 19, date: '2026-01-26', merchant: 'BookMyShow',              category: 'Entertainment',    type: 'expense', amount: 750 },
  { id: 20, date: '2026-01-28', merchant: 'Dividend Credit',         category: 'Income',          type: 'income',  amount: 4200 },

  // ── February 2026 ────────────────────────────────────────
  { id: 21, date: '2026-02-01', merchant: 'Salary Credit',           category: 'Income',          type: 'income',  amount: 85000 },
  { id: 22, date: '2026-02-02', merchant: 'Swiggy',                  category: 'Food & Dining',   type: 'expense', amount: 678 },
  { id: 23, date: '2026-02-03', merchant: 'Uber',                    category: 'Transport',        type: 'expense', amount: 428 },
  { id: 24, date: '2026-02-04', merchant: 'Amazon Prime',            category: 'Entertainment',    type: 'expense', amount: 1499 },
  { id: 25, date: '2026-02-05', merchant: 'Piped Gas Bill',          category: 'Utilities',        type: 'expense', amount: 890 },
  { id: 26, date: '2026-02-06', merchant: 'Flipkart',                category: 'Shopping',         type: 'expense', amount: 5670 },
  { id: 27, date: '2026-02-07', merchant: 'Domino\'s Pizza',         category: 'Food & Dining',   type: 'expense', amount: 445 },
  { id: 28, date: '2026-02-08', merchant: 'Dr. Lal PathLabs',        category: 'Health',           type: 'expense', amount: 2100 },
  { id: 29, date: '2026-02-09', merchant: 'Rent Payment',            category: 'Rent',             type: 'expense', amount: 18000 },
  { id: 30, date: '2026-02-10', merchant: 'Metro Recharge',          category: 'Transport',        type: 'expense', amount: 500 },
  { id: 31, date: '2026-02-12', merchant: 'Freelance Payment',       category: 'Income',          type: 'income',  amount: 12000 },
  { id: 32, date: '2026-02-13', merchant: 'Chai Point',              category: 'Food & Dining',   type: 'expense', amount: 180 },
  { id: 33, date: '2026-02-14', merchant: 'Electricity Bill - BSES', category: 'Utilities',        type: 'expense', amount: 1980 },
  { id: 34, date: '2026-02-16', merchant: 'YouTube Premium',         category: 'Entertainment',    type: 'expense', amount: 149 },
  { id: 35, date: '2026-02-18', merchant: 'Ajio',                    category: 'Shopping',         type: 'expense', amount: 1890 },
  { id: 36, date: '2026-02-20', merchant: 'Ola',                     category: 'Transport',        type: 'expense', amount: 356 },
  { id: 37, date: '2026-02-22', merchant: 'Burger King',             category: 'Food & Dining',   type: 'expense', amount: 410 },
  { id: 38, date: '2026-02-24', merchant: 'Jio Recharge',            category: 'Utilities',        type: 'expense', amount: 399 },
  { id: 39, date: '2026-02-26', merchant: 'PVR Cinemas',             category: 'Entertainment',    type: 'expense', amount: 620 },
  { id: 40, date: '2026-02-28', merchant: 'Interest Credit',         category: 'Income',          type: 'income',  amount: 3500 },

  // ── March 2026 ────────────────────────────────────────────
  { id: 41, date: '2026-03-01', merchant: 'Salary Credit',           category: 'Income',          type: 'income',  amount: 85000 },
  { id: 42, date: '2026-03-02', merchant: 'Zomato',                  category: 'Food & Dining',   type: 'expense', amount: 734 },
  { id: 43, date: '2026-03-03', merchant: 'Uber',                    category: 'Transport',        type: 'expense', amount: 289 },
  { id: 44, date: '2026-03-04', merchant: 'Disney+ Hotstar',         category: 'Entertainment',    type: 'expense', amount: 299 },
  { id: 45, date: '2026-03-05', merchant: 'Water Bill - DJB',        category: 'Utilities',        type: 'expense', amount: 450 },
  { id: 46, date: '2026-03-06', merchant: 'Amazon',                  category: 'Shopping',         type: 'expense', amount: 7890 },
  { id: 47, date: '2026-03-07', merchant: 'Haldiram\'s',             category: 'Food & Dining',   type: 'expense', amount: 390 },
  { id: 48, date: '2026-03-08', merchant: 'Max Healthcare',          category: 'Health',           type: 'expense', amount: 3500 },
  { id: 49, date: '2026-03-09', merchant: 'Rent Payment',            category: 'Rent',             type: 'expense', amount: 18000 },
  { id: 50, date: '2026-03-10', merchant: 'Rapido',                  category: 'Transport',        type: 'expense', amount: 120 },
  { id: 51, date: '2026-03-12', merchant: 'Cashback Reward',         category: 'Income',          type: 'income',  amount: 1500 },
  { id: 52, date: '2026-03-13', merchant: 'KFC',                     category: 'Food & Dining',   type: 'expense', amount: 560 },
  { id: 53, date: '2026-03-15', merchant: 'HDFC Credit Card Payment',category: 'Utilities',        type: 'expense', amount: 9200 },
  { id: 54, date: '2026-03-16', merchant: 'Gaana Plus',              category: 'Entertainment',    type: 'expense', amount: 99 },
  { id: 55, date: '2026-03-18', merchant: 'Nykaa',                   category: 'Shopping',         type: 'expense', amount: 1450 },
  { id: 56, date: '2026-03-20', merchant: 'Ola',                     category: 'Transport',        type: 'expense', amount: 198 },
  { id: 57, date: '2026-03-22', merchant: 'Barbeque Nation',         category: 'Food & Dining',   type: 'expense', amount: 1850 },
  { id: 58, date: '2026-03-24', merchant: 'Broadband Bill - ACT',    category: 'Utilities',        type: 'expense', amount: 1100 },
  { id: 59, date: '2026-03-26', merchant: 'Freelance Payment',       category: 'Income',          type: 'income',  amount: 20000 },
  { id: 60, date: '2026-03-28', merchant: 'Practo Consultation',     category: 'Health',           type: 'expense', amount: 800 },
];

export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Entertainment',
  'Utilities',
  'Rent',
  'Shopping',
  'Health',
  'Income',
];

export const CATEGORY_COLORS = {
  'Food & Dining':  '#f59e0b',
  'Transport':      '#3b82f6',
  'Entertainment':  '#ec4899',
  'Utilities':      '#00c2ff',
  'Rent':           '#8b5cf6',
  'Shopping':       '#f43f5e',
  'Health':         '#10b981',
  'Income':         '#22c55e',
};

export default transactions;
