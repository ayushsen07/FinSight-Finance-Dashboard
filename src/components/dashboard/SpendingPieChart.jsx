import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../data/transactions';
import EmptyState from '../shared/EmptyState';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const { name, value } = payload[0];

  return (
    <div className="bg-white dark:bg-[#162035] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-sm flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
      <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em] text-[10px]">
        {name}
      </span>
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
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || '#64748b',
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="app-panel rounded-2xl p-6 animate-slide-up flex flex-col h-full" style={{ animationDelay: '400ms' }}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mb-6 flex-shrink-0">
        Spending by Category
      </h3>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center">
          <EmptyState
            title="No spending categories yet"
            description="Expense transactions will automatically build your categorical breakdown."
          />
        </div>
      ) : (
        <>
          <div className="h-48 mb-6 flex-shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  isAnimationActive
                  animationDuration={1000}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={84}
                  paddingAngle={3}
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

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 font-semibold">
                Total
              </span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2.5">
            {data.map((item) => {
              const percentage = ((item.value / totalExpenses) * 100).toFixed(1);

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl bg-slate-900/[0.03] border border-slate-200/70 px-3.5 py-2.5 dark:bg-white/[0.03] dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 dark:text-slate-300 text-xs font-medium">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.value)}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium w-8 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
