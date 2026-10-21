import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info";
  content: React.ReactNode;
}

interface ToastContextValue {
  message: {
    success: (content: React.ReactNode, duration?: number) => void;
    error: (content: React.ReactNode, duration?: number) => void;
    info: (content: React.ReactNode, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

let globalToastHandler: ToastContextValue["message"] | null = null;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastItem["type"], content: React.ReactNode, duration = 3000) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, content }]);
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const message = React.useMemo(
    () => ({
      success: (content: React.ReactNode, duration?: number) =>
        addToast("success", content, duration),
      error: (content: React.ReactNode, duration?: number) =>
        addToast("error", content, duration),
      info: (content: React.ReactNode, duration?: number) =>
        addToast("info", content, duration),
    }),
    [addToast]
  );

  React.useEffect(() => {
    globalToastHandler = message;
    return () => {
      globalToastHandler = null;
    };
  }, [message]);

  return (
    <ToastContext.Provider value={{ message }}>
      {children}
      {/* Toast container floating at top center */}
      <div
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none max-w-[90vw] w-max"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-2.5 shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
              toast.type === "success"
                ? "bg-white text-slate-800 border-emerald-200 shadow-emerald-950/10"
                : toast.type === "error"
                ? "bg-white text-slate-800 border-rose-200 shadow-rose-950/10"
                : "bg-white text-slate-800 border-slate-200 shadow-slate-950/10"
            }`}
            role="status"
          >
            {toast.type === "success" && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            {toast.type === "info" && (
              <Info className="h-4 w-4 text-blue-600 shrink-0" />
            )}
            <span className="text-slate-700">{toast.content}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-2 -mr-1 p-0.5 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (ctx) {
    return ctx;
  }
  return {
    message: globalToastHandler || {
      success: () => {},
      error: () => {},
      info: () => {},
    },
  };
};

/**
 * Compatibility wrapper for Ant Design's `App.useApp()`
 */
export const App = {
  useApp: useToast,
};
