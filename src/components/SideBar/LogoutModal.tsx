import React, { useEffect } from "react";
import { LogOut, X } from "lucide-react";

export interface LogoutModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-description"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:flex-row sm:gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 shrink-0 mb-3 sm:mb-0">
            <LogOut className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3
              id="logout-modal-title"
              className="text-lg font-bold text-slate-900 m-0"
            >
              Confirm Log Out
            </h3>
            <p
              id="logout-modal-description"
              className="mt-1.5 text-sm text-slate-500 leading-relaxed m-0"
            >
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto h-10 px-5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto h-10 px-5 rounded-xl border-0 bg-rose-600 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
