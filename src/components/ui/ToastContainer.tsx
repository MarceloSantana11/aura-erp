import React from 'react';
import { useOperational } from '../../context/OperationalContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useOperational();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : toast.type === 'error'
              ? 'bg-red-900 text-white border-red-800'
              : toast.type === 'warning'
              ? 'bg-amber-900 text-amber-50 border-amber-800'
              : 'bg-slate-800 text-white border-slate-700'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}

            <div className="text-xs">
              <p className="font-extrabold">{toast.title}</p>
              {toast.message && <p className="opacity-90 mt-0.5 text-[11px]">{toast.message}</p>}
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 opacity-70 hover:opacity-100 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
