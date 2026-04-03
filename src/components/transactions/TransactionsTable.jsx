import { useMemo, useState } from 'react';
import { Search, Filter, Download, Plus, ArrowUpDown, ChevronDown, X, Pencil, Trash2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { CATEGORIES } from '../../data/transactions';
import { formatCurrency, formatDate, exportToCSV } from '../../utils/formatters';
import EmptyState from '../shared/EmptyState';
import AddTransactionModal from '../shared/AddTransactionModal';
import { useToast } from '../shared/Toast';

export default function TransactionsTable() {
  const {
    transactions,
    activeFilters,
    updateFilter,
    resetFilters,
    selectedRole,
    deleteTransaction,
  } = useDashboard();
  const { addToast } = useToast();

  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

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

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteTransaction = (transaction) => {
    const confirmed = window.confirm(`Delete "${transaction.merchant}" from transactions?`);
    if (!confirmed) return;

    deleteTransaction(transaction.id);
    addToast(`${transaction.merchant} deleted from transactions`, 'info');
  };

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
            className="app-ghost-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handleAddTransaction}
            className={`
              app-accent-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 cursor-pointer
              ${selectedRole !== 'admin' ? 'opacity-0 pointer-events-none w-0 truncate p-0 overflow-hidden' : 'w-auto'}
            `}
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="app-panel-subtle rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by merchant name..."
              value={activeFilters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="app-input w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer
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
                className="app-input appearance-none pl-4 pr-9 py-2.5 rounded-xl border text-sm text-slate-700 dark:text-slate-200 cursor-pointer focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all min-w-[140px] font-medium"
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
                className="app-input appearance-none pl-4 pr-9 py-2.5 rounded-xl border text-sm text-slate-700 dark:text-slate-200 cursor-pointer focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all min-w-[120px] font-medium"
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
        <div className="app-panel-subtle rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/6 bg-white/90 dark:bg-white/[0.03]">
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
                  {selectedRole === 'admin' && (
                    <th className="text-right px-6 py-4 hidden md:table-cell text-[14px] font-semibold text-slate-500 uppercase tracking-widest">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((t, index) => {
                  const styleStr = {
                    'Food & Dining': 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/15',
                    'Transport': 'bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/15',
                    'Utilities': 'bg-cyan-50 text-cyan-700 border border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/15',
                    'Health': 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/15',
                    'Shopping': 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/15',
                    'Rent': 'bg-violet-50 text-violet-700 border border-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/15',
                    'Entertainment': 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:border-fuchsia-500/15',
                    'Income': 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/15',
                  }[t.category] || 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/15';

                  return (
                    <tr
                      key={t.id}
                      className="border-b border-slate-200/80 dark:border-white/[0.05] last:border-b-0 hover:bg-white/80 dark:hover:bg-white/[0.025] transition-colors duration-150 animate-row-fade-in"
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
                          {selectedRole === 'admin' && (
                            <button
                              onClick={() => handleEditTransaction(t)}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-900/[0.04] dark:bg-white/[0.05] text-slate-500 dark:text-slate-300"
                              aria-label={`Edit ${t.merchant}`}
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          )}
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
                      {selectedRole === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditTransaction(t)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(t)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200/80 dark:border-rose-500/15 bg-rose-50/80 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/15 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
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
          onClick={handleAddTransaction}
          className="app-accent-button md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center z-[40] text-white transition-colors active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTransaction(null);
        }}
        initialData={editingTransaction}
      />
    </div>
  );
}
