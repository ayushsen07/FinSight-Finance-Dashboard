import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Lightbulb,
  Award,
  ArrowRight,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../data/transactions';
import EmptyState from '../shared/EmptyState';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-[#162035] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-sm z-50 relative">
      <p className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em] text-[10px] mb-2">
        {label}
      </p>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-sm mt-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-slate-600 dark:text-slate-300 font-medium text-xs">{item.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs">
            {formatCurrency(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, subtitle, iconTone, delay, percentFill, percentColor }) {
  return (
    <div
      className="app-panel rounded-2xl p-6 transition-all duration-500 animate-slide-up hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`app-icon-chip w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iconTone}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-semibold text-slate-950 dark:text-white tracking-tight mb-2">
        {value}
      </p>

      {percentFill !== undefined && (
        <div className="mt-4 mb-2 h-1 rounded-full bg-slate-200 dark:bg-white/5 overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${percentFill}%`, backgroundColor: percentColor }}
          />
        </div>
      )}

      {subtitle && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
      )}
    </div>
  );
}

export default function InsightsPanel() {
  const { transactions } = useDashboard();

  const insights = useMemo(() => {
    const expenses = transactions.filter((transaction) => transaction.type === 'expense');
    const categoryTotals = {};

    expenses.forEach((transaction) => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0] || ['N/A', 0];
    const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);
    const topCategoryPercent = totalExpenses
      ? ((topCategory[1] / totalExpenses) * 100).toFixed(1)
      : 0;
    const topCategoryColor = CATEGORY_COLORS[topCategory[0]] || '#22c7f2';

    const monthlyData = {};
    transactions.forEach((transaction) => {
      const month = transaction.date.slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      monthlyData[month][transaction.type] += transaction.amount;
    });

    const months = Object.keys(monthlyData).sort();
    const monthNames = {
      '01': 'Jan',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Apr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Aug',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec',
    };

    const monthlyChartData = months.map((month) => ({
      month: `${monthNames[month.slice(5)]} ${month.slice(0, 4)}`,
      Income: monthlyData[month].income,
      Expenses: monthlyData[month].expense,
    }));

    let expenseChange = null;
    if (months.length >= 2) {
      const previousMonthExpense = monthlyData[months[months.length - 2]].expense;
      const currentMonthExpense = monthlyData[months[months.length - 1]].expense;
      if (previousMonthExpense > 0) {
        expenseChange = (((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100).toFixed(1);
      }
    }

    const uniqueDays = new Set(expenses.map((transaction) => transaction.date)).size;
    const avgDailyExpense = uniqueDays > 0 ? Math.round(totalExpenses / uniqueDays) : 0;

    const merchantCount = {};
    expenses.forEach((transaction) => {
      merchantCount[transaction.merchant] = (merchantCount[transaction.merchant] || 0) + 1;
    });
    const topMerchant = Object.entries(merchantCount).sort((a, b) => b[1] - a[1])[0];

    const didYouKnow = [];
    if (topMerchant) {
      didYouKnow.push(`Your most visited merchant is ${topMerchant[0]} with ${topMerchant[1]} transactions.`);
    }
    if (avgDailyExpense > 0) {
      didYouKnow.push(`You spend about ${formatCurrency(avgDailyExpense)} on average per transaction day.`);
    }
    if (sortedCategories.length >= 2) {
      didYouKnow.push(
        `${sortedCategories[sortedCategories.length - 1][0]} is your lightest spending category at ${formatCurrency(sortedCategories[sortedCategories.length - 1][1])}.`
      );
    }
    const foodTotal = categoryTotals['Food & Dining'] || 0;
    if (foodTotal > 0) {
      didYouKnow.push(`You've spent ${formatCurrency(foodTotal)} on Food & Dining, roughly ${Math.round(foodTotal / 400)} meals ordered.`);
    }

    return {
      topCategory,
      topCategoryPercent,
      topCategoryColor,
      expenseChange,
      monthlyChartData,
      didYouKnow,
      topMerchant,
    };
  }, [transactions]);

  const hasInsights = transactions.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
          Insights
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Smart observations from your spending data
        </p>
      </div>

      {!hasInsights ? (
        <div className="app-panel rounded-2xl min-h-[26rem] flex items-center justify-center">
          <EmptyState
            title="No insights available yet"
            description="Once transactions are added, this section will highlight patterns and key takeaways."
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InsightCard
              icon={Award}
              title="Top Spending Category"
              value={insights.topCategory[0]}
              subtitle={`${formatCurrency(insights.topCategory[1])} â€” ${insights.topCategoryPercent}% of expenses`}
              iconTone="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/15"
              delay={0}
              percentFill={parseFloat(insights.topCategoryPercent)}
              percentColor={insights.topCategoryColor}
            />
            <InsightCard
              icon={
                insights.expenseChange !== null && Number(insights.expenseChange) < 0
                  ? TrendingDown
                  : TrendingUp
              }
              title="Month-over-Month Change"
              value={
                insights.expenseChange !== null
                  ? `${Number(insights.expenseChange) > 0 ? '+' : ''}${insights.expenseChange}%`
                  : 'N/A'
              }
              subtitle={
                insights.expenseChange !== null
                  ? Number(insights.expenseChange) < 0
                    ? 'Your spending is trending lower month over month.'
                    : 'Your spending is trending higher this month.'
                  : 'Need more monthly history'
              }
              iconTone={
                insights.expenseChange !== null && Number(insights.expenseChange) < 0
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/15'
                  : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/15'
              }
              delay={100}
              percentFill={insights.expenseChange !== null ? Math.min(Math.abs(Number(insights.expenseChange)), 100) : 0}
              percentColor={insights.expenseChange !== null && Number(insights.expenseChange) < 0 ? '#34d399' : '#fb7185'}
            />
            <InsightCard
              icon={Zap}
              title="Most Visited Merchant"
              value={insights.topMerchant ? insights.topMerchant[0] : 'N/A'}
              subtitle={insights.topMerchant ? `${insights.topMerchant[1]} transactions` : 'No merchant data yet'}
              iconTone="text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/15"
              delay={200}
            />
          </div>

          <div className="app-panel rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 mb-6">
              Monthly Income vs Expenses
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insights.monthlyChartData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  barGap={8}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.12)"
                    vertical={false}
                    className="dark:stroke-[rgba(255,255,255,0.04)]"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(value) => `â‚¹${(value / 1000).toFixed(0)}k`}
                    width={50}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, paddingTop: '20px', color: '#64748b' }}
                    iconType="circle"
                    iconSize={6}
                  />
                  <Bar dataKey="Income" fill="#34d399" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} maxBarSize={40} />
                  <Bar dataKey="Expenses" fill="#fb7185" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="app-panel rounded-2xl p-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/6 to-transparent pointer-events-none" />

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Lightbulb className="w-5 h-5 text-cyan-700 dark:text-cyan-300" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-800 dark:text-slate-200">
                Did You Know?
              </h3>
            </div>
            <div className="space-y-4 relative z-10">
              {insights.didYouKnow.map((fact, index) => (
                <div key={index} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-cyan-600 dark:text-cyan-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
