import { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { ToastProvider } from './components/shared/Toast';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import DashboardOverview from './components/dashboard/DashboardOverview';
import TransactionsTable from './components/transactions/TransactionsTable';
import InsightsPanel from './components/insights/InsightsPanel';

function MainContent() {
  const { activeSection } = useDashboard();

  switch (activeSection) {
    case 'dashboard':
      return <DashboardOverview />;
    case 'transactions':
      return <TransactionsTable />;
    case 'insights':
      return <InsightsPanel />;
    default:
      return <DashboardOverview />;
  }
}

function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#080e1a] overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <MainContent />
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <DashboardProvider>
      <ToastProvider>
        <AppLayout />
      </ToastProvider>
    </DashboardProvider>
  );
}

export default App;
