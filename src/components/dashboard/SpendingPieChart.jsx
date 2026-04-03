import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../data/transactions';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0];

  return (
    <div className="bg-white dark:bg-[#162035] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-sm flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
      <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">{name}</span>
      <span className="text-sm font-bold text-slate-900 dark:text-white ml-2">
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export default function SpendingPieChart() {
  const { transactions } = useDashboard();

  const data = useMemo(() => {
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || '#64748b',
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpenses = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white dark:bg-[#0d1526] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none p-6 animate-slide-up flex flex-col h-full" style={{ animationDelay: '400ms' }}>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6 flex-shrink-0">
        Spending by Category
      </h3>
      <div className="h-48 mb-6 flex-shrink-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              isAnimationActive={true}
              animationDuration={1000}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
              strokeWidth={0}
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Total</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{formatCurrency(totalExpenses / 1000)}k</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {data.map((item) => {
          const percentage = ((item.value / totalExpenses) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between mx-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}
                />
                <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium w-8 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
