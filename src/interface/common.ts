/**
 * Common shared component interfaces and types.
 */
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export interface HeaderProps {
  onSignOut: () => void;
  title?: string;
  className?: string;
}

export interface SideBarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  onSelectTab: (key: string) => void;
  hasUpline?: boolean;
  onOpenRecruit?: () => void;
  onSignOut: () => void;
}

export interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  precision?: number;
  tagText: string;
  icon: ReactNode;
  gradientClass: string;
  className?: string;
}

export interface SectionCardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  extraHeader?: ReactNode;
}

export interface ReferralBannerCardProps {
  referralCode?: string;
  commissionText?: string;
  commissionPercent?: number;
  loading?: boolean;
  onCopy: () => void;
}

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  trailing?: ReactNode;
  error?: string;
}

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  content: ReactNode;
}

export interface ToastContextValue {
  message: {
    success: (content: ReactNode, duration?: number) => void;
    error: (content: ReactNode, duration?: number) => void;
    info: (content: ReactNode, duration?: number) => void;
  };
}
