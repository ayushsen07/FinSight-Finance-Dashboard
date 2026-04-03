import { useDashboard } from '../../context/DashboardContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { activeSection, setActiveSection } = useDashboard();

  const handleNav = (id) => {
    setActiveSection(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          flex flex-col transition-all duration-500 ease-in-out
          md:translate-x-0 md:static md:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-slate-50 dark:bg-[#060c18] border-r border-slate-200 dark:border-white/5
          hidden md:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-white/5">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-gradient-to-br dark:from-[#00c2ff] dark:to-[#0ea5e9] flex items-center justify-center shadow-sm dark:shadow-lg dark:shadow-cyan-500/30">
            <TrendingUp className="w-5 h-5 text-slate-700 dark:text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">FinSight</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-500">
              FinTech Dashboard
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`
                  w-full flex items-center gap-3 mx-0 px-4 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  cursor-pointer
                  ${
                    isActive
                      ? 'bg-white shadow-sm border border-slate-200 text-slate-900 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900 dark:text-cyan-400' : ''}`} />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-cyan-400 dark:shadow-[0_0_6px_#00c2ff]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer — user card */}
        <div className="mx-3 mb-4 p-3 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-white/[0.03] dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-cyan-500/10 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-cyan-400">
              AS
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Ayush Sen</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">Premium Member</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile slide-out sidebar (drawer) ─────────────────── */}
      {mobileOpen && (
        <aside className="fixed top-0 left-0 z-50 h-screen w-64 flex flex-col bg-slate-50 dark:bg-[#060c18] border-r border-slate-200 dark:border-white/5 md:hidden animate-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-white/5">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-gradient-to-br dark:from-[#00c2ff] dark:to-[#0ea5e9] flex items-center justify-center shadow-sm dark:shadow-lg dark:shadow-cyan-500/30">
              <TrendingUp className="w-5 h-5 text-slate-700 dark:text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">FinSight</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-500">
                FinTech Dashboard
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                    text-sm font-medium transition-all duration-200
                    cursor-pointer
                    ${
                      isActive
                        ? 'bg-white shadow-sm border border-slate-200 text-slate-900 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900 dark:text-cyan-400' : ''}`} />
                  {label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-cyan-400 dark:shadow-[0_0_6px_#00c2ff]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mx-3 mb-4 p-3 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-white/[0.03] dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-cyan-500/10 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-cyan-400">
                AS
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Ayush Sen</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-500">Premium Member</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ── Mobile bottom tab bar ─────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-50 dark:bg-[#060c18] border-t border-slate-200 dark:border-white/5 flex justify-around py-3 z-50 h-16 md:hidden mobile-bottom-nav">
        {navItems.map(({ id, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`
                flex flex-col items-center justify-center gap-0.5 px-3
                transition-colors duration-200 cursor-pointer
                ${isActive ? 'text-slate-900 dark:text-cyan-400' : 'text-slate-500'}
              `}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-slate-900 dark:bg-cyan-400 dark:shadow-[0_0_4px_#00c2ff] mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
