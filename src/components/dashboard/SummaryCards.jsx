import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { formatCurrency } from '../../utils/formatters';

function SummaryCard({ title, amount, icon: Icon, iconBg, glowColor, changePercent, changeDirection, delay }) {
  const animatedValue = useAnimatedCounter(amount, 1400);

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-[#0d1526] dark:to-[#0a1020] border border-slate-200 dark:border-white/5 shadow-md shadow-slate-200/50 dark:shadow-none p-6 hover:shadow-lg dark:hover:border-white/10 transition-all duration-500 group animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Radial glow — top-right corner */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 dark:opacity-20 blur-2xl animate-glow-pulse transition-opacity"
        style={{ backgroundColor: glowColor }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {title}
          </p>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${iconBg}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-4xl font-bold text-slate-900 dark:text-white mt-4 mb-1 tracking-tight">
          {formatCurrency(animatedValue)}
        </p>
        {/* Month-over-month change indicator */}
        <div className="flex items-center gap-1 mt-1">
          {changeDirection === 'up' ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          )}
          <span className={`text-xs font-medium ${changeDirection === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {changePercent}%
          </span>
          <span className="text-xs text-slate-500 font-medium ml-1">vs last month</span>
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { balance, totalIncome, totalExpenses } = useDashboard();

  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      icon: Wallet,
      iconBg: 'bg-white border border-slate-200 shadow-sm text-slate-700 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-transparent dark:shadow-none',
      glowColor: '#00c2ff',
      changePercent: '12.5',
      changeDirection: 'up',
      delay: 0,
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: TrendingUp,
      iconBg: 'bg-white border border-slate-200 shadow-sm text-slate-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-transparent dark:shadow-none',
      glowColor: '#10b981',
      changePercent: '8.2',
      changeDirection: 'up',
      delay: 100,
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: TrendingDown,
      iconBg: 'bg-white border border-slate-200 shadow-sm text-slate-700 dark:bg-rose-500/10 dark:text-rose-400 dark:border-transparent dark:shadow-none',
      glowColor: '#f43f5e',
      changePercent: '3.1',
      changeDirection: 'down',
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
