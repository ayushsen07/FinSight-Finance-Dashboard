import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, getShortMonth } from '../../utils/formatters';
import EmptyState from '../shared/EmptyState';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-[#162035] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em] text-[10px] mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function BalanceTrendChart() {
  const { transactions } = useDashboard();

  const chartData = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let runningBalance = 0;
    const dailyPoints = [];

    sorted.forEach((transaction) => {
      const change = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      runningBalance += change;
      dailyPoints.push({
        date: transaction.date,
        name: `${new Date(`${transaction.date}T00:00:00`).getDate()} ${getShortMonth(transaction.date)}`,
        balance: runningBalance,
      });
    });

    return dailyPoints;
  }, [transactions]);

  return (
    <div className="app-panel rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mb-6">
        Balance Trend
      </h3>

      {chartData.length === 0 ? (
        <div className="min-h-72 flex items-center">
          <EmptyState
            title="No balance trend yet"
            description="Add a few transactions to unlock the time-based trend view."
          />
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(34, 199, 242, 0.26)" />
                  <stop offset="100%" stopColor="rgba(34, 199, 242, 0)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.12)"
                vertical={false}
                className="dark:stroke-[rgba(255,255,255,0.04)]"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'rgba(148,163,184,0.22)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                isAnimationActive
                animationDuration={1000}
                type="monotone"
                dataKey="balance"
                stroke="#22c7f2"
                strokeWidth={3}
                fill="url(#balanceGradient)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: '#22c7f2' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
