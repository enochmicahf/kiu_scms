import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((toast: Toast) => toast.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev: Toast[]) => prev.filter((toast: Toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-4 p-4 md:w-[380px] rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] 
              border bg-white animate-in slide-in-from-right-8 fade-in duration-300
              ${toast.type === 'success' ? 'border-emerald-100' : 'border-red-100'}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' ? (
                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                   <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                   <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                 {toast.type === 'success' ? 'System Success' : 'System Error'}
               </p>
               <p className="text-sm font-bold text-slate-800 leading-tight">
                 {toast.message}
               </p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
