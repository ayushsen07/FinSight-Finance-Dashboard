import SummaryCards from './SummaryCards';
import BalanceTrendChart from './BalanceTrendChart';
import SpendingPieChart from './SpendingPieChart';

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
          Dashboard Overview
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your financial summary for Jan – Mar 2026
        </p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <SpendingPieChart />
        </div>
      </div>
    </div>
  );
}
