'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextValue {
  toast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const icons = {
  success: <Check size={14} />,
  error: <X size={14} />,
  info: <Info size={14} />,
  warning: <AlertTriangle size={14} />,
};

const colors = {
  success: 'border-green-500/30 bg-green-500/10 text-green-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-400',
  info: 'border-accent/30 bg-accent/10 text-accent',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-auto">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-md shadow-elevated animate-slide-up ${colors[t.type]}`}
          >
            <div className="shrink-0">{icons[t.type]}</div>
            <span className="text-[12px] font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
