/**
 * Dashboard interfaces and types.
 */
import type {
  PartnerProfile,
  PartnerCustomer,
  PartnerRecruit,
  PartnerCommission,
  PartnerTopProduct,
  RecruitPartnerPayload,
} from "./partner";

export interface FormInstance<T extends Record<string, any> = Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  getFieldValue: <K extends keyof T>(name: K) => T[K];
  getFieldsValue: () => T;
  setFieldValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setFieldsValue: (newValues: Partial<T>) => void;
  resetFields: () => void;
  setFieldError: (name: keyof T, error: string | undefined) => void;
  validateFields: () => Promise<T>;
  _registerValidate: (validator: () => Promise<T>) => void;
}

export interface ReferralSectionProps {
  profile?: PartnerProfile;
  loading?: boolean;
  onCopy: () => void;
}

export interface EarningsOverviewProps {
  totals?: PartnerProfile["totals"];
}

export interface CommissionBreakdownProps {
  byLevel?: PartnerProfile["byLevel"];
}

export type DashboardTabKey =
  | "overview"
  | "commission"
  | "team"
  | "products"
  | "customers"
  | string;

export interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  customers: PartnerCustomer[];
  recruits: PartnerRecruit[];
  commissions: PartnerCommission[];
  topProducts: PartnerTopProduct[];
  hasUpline?: boolean;
}

export interface RecruitModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
  form: FormInstance<RecruitPartnerPayload>;
}
