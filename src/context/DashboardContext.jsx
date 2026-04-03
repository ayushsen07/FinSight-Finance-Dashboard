import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import defaultTransactions from '../data/transactions';

const DashboardContext = createContext(null);

const STORAGE_KEY = 'finsight_dashboard_transactions';

function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fall through
  }
  return defaultTransactions;
}

function saveTransactions(txns) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
  } catch {
    // storage full – silently fail
  }
}

export function DashboardProvider({ children }) {
  const [transactions, setTransactions] = useState(loadTransactions);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    type: '',
    search: '',
  });
  const [selectedRole, setSelectedRole] = useState('admin');
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('zorvyn_dark_mode') === 'true';
    } catch {
      return false;
    }
  });
  const [activeSection, setActiveSection] = useState('dashboard');

  // Persist transactions
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('zorvyn_dark_mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTransaction = useCallback((txn) => {
    setTransactions((prev) => {
      const maxId = prev.reduce((max, t) => Math.max(max, t.id), 0);
      return [...prev, { ...txn, id: maxId + 1 }];
    });
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateFilter = useCallback((key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters({ category: '', type: '', search: '' });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const toggleRole = useCallback(() => {
    setSelectedRole((prev) => (prev === 'admin' ? 'viewer' : 'admin'));
  }, []);

  // Computed values
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const value = {
    transactions,
    activeFilters,
    selectedRole,
    darkMode,
    activeSection,
    totalIncome,
    totalExpenses,
    balance,
    addTransaction,
    deleteTransaction,
    setActiveFilters,
    updateFilter,
    resetFilters,
    setSelectedRole,
    toggleRole,
    toggleDarkMode,
    setActiveSection,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export default DashboardContext;
