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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-[#162035] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-sm">
      <p className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] mb-1">
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
    sorted.forEach((t) => {
      const change = t.type === 'income' ? t.amount : -t.amount;
      runningBalance += change;
      dailyPoints.push({
        date: t.date,
        name: `${new Date(t.date + 'T00:00:00').getDate()} ${getShortMonth(t.date)}`,
        balance: runningBalance,
      });
    });

    return dailyPoints;
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-[#0d1526] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6">
        Balance Trend
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,194,255,0.25)" />
                <stop offset="100%" stopColor="rgba(0,194,255,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.1)"
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
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(148,163,184,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              isAnimationActive={true}
              animationDuration={1000}
              type="monotone"
              dataKey="balance"
              stroke="#00c2ff"
              strokeWidth={3}
              fill="url(#balanceGradient)"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#00c2ff', style: { filter: 'drop-shadow(0 0 8px rgba(0,194,255,0.5))' } }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
