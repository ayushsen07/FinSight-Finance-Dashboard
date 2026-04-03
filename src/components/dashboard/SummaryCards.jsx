import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { formatCurrency } from '../../utils/formatters';

function getPercentChange(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return Number((((currentValue - previousValue) / Math.abs(previousValue)) * 100).toFixed(1));
}

function getComparisonCopy(changeValue) {
  if (changeValue > 0) return 'up from previous month';
  if (changeValue < 0) return 'down from previous month';
  return 'flat versus previous month';
}

function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconTone,
  accentColor,
  comparisonValue,
  comparisonLabel,
  delay,
}) {
  const animatedValue = useAnimatedCounter(amount, 1400);
  const changeDirection = comparisonValue > 0 ? 'up' : comparisonValue < 0 ? 'down' : 'flat';
  const changeTextColor =
    comparisonValue > 0
      ? 'text-emerald-700 dark:text-emerald-300'
      : comparisonValue < 0
      ? 'text-rose-700 dark:text-rose-300'
      : 'text-slate-600 dark:text-slate-300';

  return (
    <div
      className="app-panel relative overflow-hidden rounded-2xl p-6 transition-all duration-500 group animate-slide-up hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
      <div
        className="absolute -top-10 right-0 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 dark:opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {comparisonLabel}
            </p>
          </div>
          <div
            className={`app-icon-chip w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${iconTone}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-3xl sm:text-4xl font-semibold text-slate-950 dark:text-white mt-6 mb-3 tracking-tight">
          {formatCurrency(animatedValue)}
        </p>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/[0.04] px-2.5 py-1 dark:bg-white/[0.05]">
          {changeDirection === 'up' ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
          ) : changeDirection === 'down' ? (
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-300" />
          ) : (
            <span className="block h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
          )}
          <span className={`text-xs font-semibold ${changeTextColor}`}>
            {Math.abs(comparisonValue)}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {getComparisonCopy(comparisonValue)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { balance, totalIncome, totalExpenses, transactions } = useDashboard();

  const comparisonMeta = useMemo(() => {
    const monthlyTotals = {};
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let runningBalance = 0;

    sortedTransactions.forEach((transaction) => {
      const monthKey = transaction.date.slice(0, 7);
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = {
          income: 0,
          expenses: 0,
          closingBalance: 0,
        };
      }

      if (transaction.type === 'income') {
        monthlyTotals[monthKey].income += transaction.amount;
        runningBalance += transaction.amount;
      } else {
        monthlyTotals[monthKey].expenses += transaction.amount;
        runningBalance -= transaction.amount;
      }

      monthlyTotals[monthKey].closingBalance = runningBalance;
    });

    const monthKeys = Object.keys(monthlyTotals).sort();
    const currentMonth = monthKeys.at(-1);
    const previousMonth = monthKeys.at(-2);
    const currentData = currentMonth ? monthlyTotals[currentMonth] : { income: 0, expenses: 0, closingBalance: 0 };
    const previousData = previousMonth ? monthlyTotals[previousMonth] : { income: 0, expenses: 0, closingBalance: 0 };

    const formatMonthLabel = (monthKey) => {
      if (!monthKey) return 'Current snapshot';
      const [year, month] = monthKey.split('-');
      return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      });
    };

    return {
      balanceChange: getPercentChange(currentData.closingBalance, previousData.closingBalance),
      incomeChange: getPercentChange(currentData.income, previousData.income),
      expenseChange: getPercentChange(currentData.expenses, previousData.expenses),
      comparisonLabel: previousMonth
        ? `${formatMonthLabel(currentMonth)} vs ${formatMonthLabel(previousMonth)}`
        : `${formatMonthLabel(currentMonth)} snapshot`,
    };
  }, [transactions]);

  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      icon: Wallet,
      iconTone: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/15',
      accentColor: '#22c7f2',
      comparisonValue: comparisonMeta.balanceChange,
      comparisonLabel: comparisonMeta.comparisonLabel,
      delay: 0,
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: TrendingUp,
      iconTone: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/15',
      accentColor: '#34d399',
      comparisonValue: comparisonMeta.incomeChange,
      comparisonLabel: comparisonMeta.comparisonLabel,
      delay: 100,
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: TrendingDown,
      iconTone: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/15',
      accentColor: '#fb7185',
      comparisonValue: comparisonMeta.expenseChange,
      comparisonLabel: comparisonMeta.comparisonLabel,
      delay: 200,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}
