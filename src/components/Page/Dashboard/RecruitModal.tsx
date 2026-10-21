import React, { useEffect } from "react";
import { X } from "lucide-react";

import type { RecruitModalProps } from "../../../interface/dashboard";

export type { RecruitModalProps };

const RecruitModal: React.FC<RecruitModalProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading = false,
  form,
}) => {
  useEffect(() => {
    form._registerValidate(async () => {
      const errs: Record<string, string> = {};
      const vals = form.values;

      if (!vals.full_name || !vals.full_name.trim()) {
        errs.full_name = "Name is required";
      }

      if (!vals.email || !vals.email.trim()) {
        errs.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim())) {
        errs.email = "Enter a valid email";
      }

      if (vals.phone && vals.phone.trim()) {
        if (!/^0\d{9}$/.test(vals.phone.trim())) {
          errs.phone =
            "Enter a valid 10-digit phone number starting with 0 (e.g. 0771234567)";
        }
      }

      if (!vals.password) {
        errs.password = "Set a password for them";
      } else if (vals.password.length < 8) {
        errs.password = "At least 8 characters";
      }

      const keys = Object.keys(errs);
      if (keys.length > 0) {
        keys.forEach((k) => form.setFieldError(k as any, errs[k]));
        throw new Error("Validation failed");
      }

      return vals;
    });
  }, [form]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recruit-modal-title"
    >
      <div className="ant-modal relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2
            id="recruit-modal-title"
            className="text-lg font-bold text-slate-800 m-0"
          >
            Recruit a partner
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4">
          <p className="text-xs leading-relaxed text-slate-500 mb-5">
            They join your team and you earn level-2 commission on their
            customers. Set their password here and share it with them yourself —
            there is no automatic invite email.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onOk();
            }}
            noValidate
            className="flex flex-col gap-4"
          >
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Nadeesha Fernando"
                value={form.values.full_name || ""}
                onChange={(e) =>
                  form.setFieldValue("full_name", e.target.value)
                }
                autoComplete="off"
                className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  form.errors.full_name
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-pink-600 focus:ring-pink-100"
                }`}
              />
              {form.errors.full_name && (
                <span className="block mt-1 text-xs text-rose-500 font-medium">
                  {form.errors.full_name}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="partner@example.com"
                value={form.values.email || ""}
                onChange={(e) => form.setFieldValue("email", e.target.value)}
                autoComplete="off"
                className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  form.errors.email
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-pink-600 focus:ring-pink-100"
                }`}
              />
              {form.errors.email && (
                <span className="block mt-1 text-xs text-rose-500 font-medium">
                  {form.errors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone
              </label>
              <input
                type="text"
                placeholder="07XXXXXXXX"
                maxLength={10}
                inputMode="numeric"
                value={form.values.phone || ""}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                  form.setFieldValue("phone", cleaned);
                }}
                autoComplete="off"
                className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  form.errors.phone
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-pink-600 focus:ring-pink-100"
                }`}
              />
              {form.errors.phone && (
                <span className="block mt-1 text-xs text-rose-500 font-medium">
                  {form.errors.phone}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={form.values.password || ""}
                onChange={(e) =>
                  form.setFieldValue("password", e.target.value)
                }
                autoComplete="new-password"
                className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  form.errors.password
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-pink-600 focus:ring-pink-100"
                }`}
              />
              {form.errors.password && (
                <span className="block mt-1 text-xs text-rose-500 font-medium">
                  {form.errors.password}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onOk}
            disabled={confirmLoading}
            className="h-10 px-5 rounded-xl border-0 bg-pink-600 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 active:scale-95 disabled:opacity-60 disabled:cursor-wait transition-all cursor-pointer flex items-center gap-2"
          >
            {confirmLoading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            <span>Recruit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitModal;
