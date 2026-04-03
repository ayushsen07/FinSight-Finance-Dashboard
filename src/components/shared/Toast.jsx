import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-cyan-500',
};

function Toast({ id, message, type = 'info', onDismiss }) {
  const Icon = ICONS[type] || ICONS.info;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border border-white/10 backdrop-blur-xl animate-slide-in-right min-w-[280px] max-w-[380px]"
      style={{
        background:
          type === 'success'
            ? 'linear-gradient(135deg, #065f46, #064e3b)'
            : type === 'error'
            ? 'linear-gradient(135deg, #9f1239, #881337)'
            : 'linear-gradient(135deg, #0f3f56, #0f172a)',
      }}
    >
      <div className={`w-8 h-8 rounded-lg ${COLORS[type]} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-sm font-medium text-white flex-1">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
      >
        <X className="w-3.5 h-3.5 text-white/60" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container – Top Right */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
