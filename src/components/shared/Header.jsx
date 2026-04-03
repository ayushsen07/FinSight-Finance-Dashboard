import { useDashboard } from '../../context/DashboardContext';
import { useToast } from './Toast';
import { Sun, Moon, Menu, Shield, Eye } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const { selectedRole, toggleRole, darkMode, toggleDarkMode } = useDashboard();
  const { addToast } = useToast();

  const handleRoleToggle = () => {
    const newRole = selectedRole === 'admin' ? 'viewer' : 'admin';
    toggleRole();

    if (newRole === 'admin') {
      addToast('Switched to Admin - transaction management is enabled', 'success');
    } else {
      addToast('Switched to Viewer - read-only mode active', 'info');
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/55 dark:bg-[#09111f]/82 border-b border-slate-200/70 dark:border-white/6 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-900/[0.04] dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/8 rounded-xl p-0.5 transition-colors">
            <button
              onClick={selectedRole !== 'admin' ? handleRoleToggle : undefined}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold
                transition-all duration-300 cursor-pointer
                ${
                  selectedRole === 'admin'
                    ? 'bg-white shadow-sm border border-slate-100 dark:border-transparent dark:bg-cyan-500/85 text-slate-800 dark:text-white dark:shadow-lg dark:shadow-cyan-500/15'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }
              `}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button
              onClick={selectedRole !== 'viewer' ? handleRoleToggle : undefined}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold
                transition-all duration-300 cursor-pointer
                ${
                  selectedRole === 'viewer'
                    ? 'bg-white shadow-sm border border-slate-100 dark:border-transparent dark:bg-slate-700 text-slate-800 dark:text-white dark:shadow-lg'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }
              `}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Viewer</span>
            </button>
          </div>

          <button
            onClick={toggleDarkMode}
            className="app-ghost-button p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
