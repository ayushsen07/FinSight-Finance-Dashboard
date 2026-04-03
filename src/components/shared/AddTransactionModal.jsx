import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/transactions';
import { useDashboard } from '../../context/DashboardContext';
import { useToast } from './Toast';

function createDefaultFormData() {
  return {
    date: new Date().toISOString().slice(0, 10),
    merchant: '',
    category: '',
    type: 'expense',
    amount: '',
  };
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  initialData = null,
}) {
  const { addTransaction, updateTransaction } = useDashboard();
  const { addToast } = useToast();
  const [formData, setFormData] = useState(createDefaultFormData);
  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(initialData?.id);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ...initialData,
        amount: String(initialData.amount ?? ''),
      });
    } else if (isOpen && !initialData) {
      setFormData(createDefaultFormData());
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const activeFormData = formData;

  const validate = () => {
    const newErrors = {};
    if (!activeFormData.date) newErrors.date = 'Date is required';
    if (!activeFormData.merchant.trim()) newErrors.merchant = 'Merchant name is required';
    if (!activeFormData.category) newErrors.category = 'Select a category';
    if (!activeFormData.amount || Number(activeFormData.amount) <= 0)
      newErrors.amount = 'Enter a valid amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...activeFormData,
      amount: Number(activeFormData.amount),
    };

    if (isEditMode) {
      updateTransaction(payload);
      addToast('Transaction updated successfully', 'success');
    } else {
      addTransaction(payload);
      addToast('Transaction added successfully', 'success');
    }

    setFormData(createDefaultFormData());
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      if (field === 'type') {
        return {
          ...prev,
          type: value,
          category: value === 'income' ? 'Income' : prev.category === 'Income' ? '' : prev.category,
        };
      }

      return { ...prev, [field]: value };
    });
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Filter out 'Income' from selectable expense categories
  const expenseCategories = CATEGORIES.filter((c) => c !== 'Income');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-[#080e1a]/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md app-panel rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02]">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div className="flex rounded-xl bg-slate-200/50 dark:bg-[#080e1a] border border-slate-200/80 dark:border-white/5 p-1">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleChange('type', t)}
                className={`
                  flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer
                  ${
                    activeFormData.type === t
                      ? t === 'expense'
                        ? 'bg-white border border-slate-100 text-rose-600 shadow-sm dark:bg-rose-500 dark:text-white dark:border-transparent dark:shadow-rose-500/20'
                        : 'bg-white border border-slate-100 text-emerald-600 shadow-sm dark:bg-emerald-500 dark:text-white dark:border-transparent dark:shadow-emerald-500/20'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
                  }
                `}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Date
            </label>
            <input
              type="date"
              value={activeFormData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`app-input w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white transition-colors
                ${errors.date ? 'border-rose-400 dark:border-rose-500/50 dark:focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/10'}
              `}
            />
            {errors.date && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">{errors.date}</p>
            )}
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Merchant
            </label>
            <input
              type="text"
              placeholder="e.g., Swiggy, Amazon"
              value={activeFormData.merchant}
              onChange={(e) => handleChange('merchant', e.target.value)}
              className={`app-input w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors
                ${errors.merchant ? 'border-rose-400 dark:border-rose-500/50 dark:focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/10'}
              `}
            />
            {errors.merchant && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">{errors.merchant}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Category
            </label>
            <select
              value={activeFormData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`app-input w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white transition-colors cursor-pointer
                ${errors.category ? 'border-rose-400 dark:border-rose-500/50 dark:focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/10'}
              `}
            >
              <option value="" className="text-slate-800">Select category</option>
              {activeFormData.type === 'income' ? (
                <option value="Income" className="text-slate-800">Income</option>
              ) : (
                expenseCategories.map((cat) => (
                  <option key={cat} value={cat} className="text-slate-800">
                    {cat}
                  </option>
                ))
              )}
            </select>
            {errors.category && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">{errors.category}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={activeFormData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={`app-input w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors
                ${errors.amount ? 'border-rose-400 dark:border-rose-500/50 dark:focus:ring-rose-500/20' : 'border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/10'}
              `}
            />
            {errors.amount && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5">{errors.amount}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="app-accent-button w-full mt-2 py-3 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            {isEditMode ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
