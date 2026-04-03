import { useMemo, useState } from 'react';
import { Search, Filter, Download, Plus, ArrowUpDown, ChevronDown, X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { CATEGORIES, CATEGORY_COLORS } from '../../data/transactions';
import { formatCurrency, formatDate, exportToCSV } from '../../utils/formatters';
import EmptyState from '../shared/EmptyState';
import AddTransactionModal from '../shared/AddTransactionModal';

export default function TransactionsTable() {
  const {
    transactions,
    activeFilters,
    updateFilter,
    resetFilters,
    selectedRole,
  } = useDashboard();

  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (activeFilters.category) {
      result = result.filter((t) => t.category === activeFilters.category);
    }
    if (activeFilters.type) {
      result = result.filter((t) => t.type === activeFilters.type);
    }
    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      result = result.filter((t) =>
        t.merchant.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (sortField === 'amount') {
        cmp = a.amount - b.amount;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [transactions, activeFilters, sortField, sortDirection]);

  const hasActiveFilters =
    activeFilters.category || activeFilters.type || activeFilters.search;

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
            Transactions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredAndSorted.length} of {transactions.length} transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filteredAndSorted)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/8 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-sm dark:shadow-none"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 shadow-md shadow-cyan-500/20 cursor-pointer
              ${selectedRole !== 'admin' ? 'opacity-0 pointer-events-none w-0 truncate p-0 overflow-hidden' : 'bg-cyan-500 hover:bg-cyan-600 dark:hover:bg-cyan-400 w-auto'}
            `}
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-50 dark:bg-[#0d1526] rounded-2xl border border-slate-200 dark:border-white/5 p-4 space-y-4 shadow-sm dark:shadow-none">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by merchant name..."
              value={activeFilters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium shadow-sm dark:shadow-none"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer shadow-sm dark:shadow-none
              ${hasActiveFilters ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' : 'border-slate-200 dark:border-white/8 text-slate-700 dark:text-slate-400 bg-white dark:bg-white/5 hover:bg-slate-50'}
            `}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 dark:shadow-[0_0_6px_#00c2ff]" />
            )}
          </button>

          {/* Desktop Filters */}
          <div className={`flex flex-col sm:flex-row gap-3 ${showFilters ? 'flex' : 'hidden sm:flex'}`}>
            <div className="relative">
              <select
                value={activeFilters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#162035] text-sm text-slate-700 dark:text-slate-200 cursor-pointer focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all min-w-[140px] font-medium shadow-sm dark:shadow-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={activeFilters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#162035] text-sm text-slate-700 dark:text-slate-200 cursor-pointer focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all min-w-[120px] font-medium shadow-sm dark:shadow-none"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredAndSorted.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description={
            hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'No transactions recorded yet. Add your first transaction!'
          }
          hasFilters={hasActiveFilters}
          onClear={resetFilters}
        />
      ) : (
        <div className="bg-slate-50 dark:bg-[#0d1526] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a1020]">
                  <th className="text-left px-6 py-4 hidden md:table-cell">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1.5 text-[14px] font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors"
                    >
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-6 lg:px-4 py-4 text-[14px] font-semibold text-slate-500 uppercase tracking-widest">
                    Merchant
                  </th>
                  <th className="text-left px-6 py-4 text-[14px] font-semibold text-slate-500 uppercase tracking-widest hidden sm:table-cell">
                    Category
                  </th>
                  <th className="text-right px-6 py-4">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center justify-end w-full gap-1.5 text-[14px] font-semibold text-slate-500 uppercase tracking-widest hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors"
                    >
                      Amount
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((t, index) => {
                  const styleStr = {
                    'Food & Dining': 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20',
                    'Transport': 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
                    'Utilities': 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20',
                    'Health': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
                    'Shopping': 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20',
                    'Rent': 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20',
                    'Entertainment': 'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-500/20',
                    'Income': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
                  }[t.category] || 'bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20';

                  return (
                    <tr
                      key={t.id}
                      className="border-b border-slate-200 dark:border-white/[0.04] last:border-b-0 hover:bg-white dark:hover:bg-white/[0.02] transition-colors duration-150 animate-row-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap hidden md:table-cell">
                        {formatDate(t.date)}
                      </td>
                      <td className="px-6 lg:px-4 py-4">
                        <p className="font-semibold text-slate-900 dark:text-slate-200">
                          {t.merchant}
                        </p>
                        <div className="flex items-center gap-2 mt-1 sm:hidden">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium leading-tight ${styleStr}`}>
                            {t.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {formatDate(t.date).slice(0, 6)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styleStr}`}>
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span
                          className={`font-semibold text-[15px] ${
                            t.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {t.type === 'income' ? '+' : '-'}
                          {formatCurrency(t.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) for mobile */}
      {selectedRole === 'admin' && (
        <button
          onClick={() => setShowModal(true)}
          className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full bg-cyan-600 dark:bg-cyan-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center z-[40] text-white hover:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
