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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-[#162035] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-sm z-50 relative">
      <p className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px] mb-2">
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm mt-1">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}80` }}
          />
          <span className="text-slate-600 dark:text-slate-300 font-medium text-xs">{p.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs">
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, subtitle, iconBg, delay, percentFill, percentColor }) {
  return (
    <div
      className={`bg-white shadow-sm dark:shadow-none dark:bg-gradient-to-br dark:from-[#0d1526] dark:to-[#0a1020] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:shadow-md dark:hover:border-white/10 transition-all duration-500 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${iconBg}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
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
    const expenses = transactions.filter((t) => t.type === 'expense');

    // Top spending category
    const categoryTotals = {};
    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const sortedCategories = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    );
    const topCategory = sortedCategories[0] || ['N/A', 0];
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const topCategoryPercent = totalExpenses
      ? ((topCategory[1] / totalExpenses) * 100).toFixed(1)
      : 0;
    const topCategoryColor = CATEGORY_COLORS[topCategory[0]] || '#00c2ff';

    // Month-over-month comparison
    const monthlyData = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      monthlyData[month][t.type] += t.amount;
    });

    const months = Object.keys(monthlyData).sort();
    const monthNames = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };

    const monthlyChartData = months.map((m) => ({
      month: monthNames[m.slice(5)] + ' ' + m.slice(0, 4),
      Income: monthlyData[m].income,
      Expenses: monthlyData[m].expense,
    }));

    // Expense change %
    let expenseChange = null;
    if (months.length >= 2) {
      const prev = monthlyData[months[months.length - 2]].expense;
      const curr = monthlyData[months[months.length - 1]].expense;
      if (prev > 0) {
        expenseChange = (((curr - prev) / prev) * 100).toFixed(1);
      }
    }

    // Average daily expense
    const uniqueDays = new Set(expenses.map((t) => t.date)).size;
    const avgDailyExpense = uniqueDays > 0 ? Math.round(totalExpenses / uniqueDays) : 0;

    // Most frequent merchant
    const merchantCount = {};
    expenses.forEach((t) => {
      merchantCount[t.merchant] = (merchantCount[t.merchant] || 0) + 1;
    });
    const topMerchant = Object.entries(merchantCount).sort(
      (a, b) => b[1] - a[1]
    )[0];

    // "Did you know" observations
    const didYouKnow = [];
    if (topMerchant) {
      didYouKnow.push(
        `Your most visited merchant is ${topMerchant[0]} with ${topMerchant[1]} transactions.`
      );
    }
    if (avgDailyExpense > 0) {
      didYouKnow.push(
        `You spend about ${formatCurrency(avgDailyExpense)} on average per transaction day.`
      );
    }
    if (sortedCategories.length >= 2) {
      didYouKnow.push(
        `${sortedCategories[sortedCategories.length - 1][0]} is your least spending category at ${formatCurrency(sortedCategories[sortedCategories.length - 1][1])}.`
      );
    }
    const foodTotal = categoryTotals['Food & Dining'] || 0;
    if (foodTotal > 0) {
      const mealsEstimate = Math.round(foodTotal / 400);
      didYouKnow.push(
        `You've spent ${formatCurrency(foodTotal)} on Food & Dining — that's roughly ${mealsEstimate} meals ordered!`
      );
    }

    return {
      topCategory,
      topCategoryPercent,
      topCategoryColor,
      expenseChange,
      monthlyChartData,
      didYouKnow,
      avgDailyExpense,
      topMerchant,
      totalExpenses,
    };
  }, [transactions]);

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

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <InsightCard
          icon={Award}
          title="Top Spending Category"
          value={insights.topCategory[0]}
          subtitle={`${formatCurrency(insights.topCategory[1])} — ${insights.topCategoryPercent}% of expenses`}
          iconBg="bg-white border border-slate-200 shadow-sm text-slate-700 dark:bg-amber-500/10 dark:text-amber-500 dark:border-transparent dark:shadow-none"
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
                ? 'Your spending decreased — great job!'
                : 'Your spending increased this month'
              : 'Need more months of data'
          }
           iconBg={
            insights.expenseChange !== null && Number(insights.expenseChange) < 0
              ? 'bg-white border border-slate-200 shadow-sm text-slate-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-transparent dark:shadow-none'
              : 'bg-white border border-slate-200 shadow-sm text-slate-700 dark:bg-rose-500/10 dark:text-rose-400 dark:border-transparent dark:shadow-none'
          }
          delay={100}
          percentFill={insights.expenseChange !== null ? Math.min(Math.abs(Number(insights.expenseChange)), 100) : 0}
          percentColor={insights.expenseChange !== null && Number(insights.expenseChange) < 0 ? '#10b981' : '#f43f5e'}
        />
        <InsightCard
          icon={Zap}
          title="Most Visited Merchant"
          value={insights.topMerchant ? insights.topMerchant[0] : 'N/A'}
          subtitle={
            insights.topMerchant
              ? `${insights.topMerchant[1]} transactions`
              : 'No data yet'
          }
          iconBg="bg-white border border-slate-200 shadow-sm text-slate-700 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-transparent dark:shadow-none"
          delay={200}
        />
      </div>

      {/* Month-over-Month Bar Chart */}
      <div className="bg-white shadow-sm dark:shadow-none dark:bg-[#0d1526] rounded-2xl border border-slate-200 dark:border-white/5 p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6">
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
                stroke="rgba(148,163,184,0.1)"
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
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                width={50}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)' }} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: '20px', color: '#64748b' }}
                iconType="circle"
                iconSize={6}
              />
              <Bar 
                dataKey="Income" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                isAnimationActive={true}
                animationDuration={1000}
                maxBarSize={40}
              />
              <Bar 
                dataKey="Expenses" 
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]} 
                isAnimationActive={true}
                animationDuration={1000}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Did You Know */}
      <div className="bg-white shadow-sm dark:shadow-none dark:bg-[#0d1526] dark:bg-gradient-to-br dark:from-[#0d1526] dark:to-[#0a1020] border border-slate-200 dark:border-cyan-500/20 rounded-2xl p-6 animate-slide-up relative overflow-hidden" style={{ animationDelay: '400ms' }}>
        {/* Subtle glow overlay for dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 dark:opacity-100 pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <Lightbulb className="w-5 h-5 text-slate-800 dark:text-cyan-400 dark:drop-shadow-[0_0_8px_rgba(0,194,255,0.5)]" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-800 dark:text-cyan-300">
            Did You Know?
          </h3>
        </div>
        <div className="space-y-4 relative z-10">
          {insights.didYouKnow.map((fact, i) => (
            <div key={i} className="flex items-start gap-3">
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-cyan-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{fact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
