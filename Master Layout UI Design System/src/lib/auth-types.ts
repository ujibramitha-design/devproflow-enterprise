
export type UserRole = 'SUPER_ADMIN' | 'BOD' | 'FINANCE' | 'LEGAL_KPR' | 'MARKETING' | 'ENGINEERING';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
}

export const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string }> = {
  SUPER_ADMIN: { label: 'System Admin', color: 'text-rose-600', bg: 'bg-rose-500/10' },
  BOD: { label: 'Board of Directors', color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
  FINANCE: { label: 'Finance & Accounting', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  LEGAL_KPR: { label: 'Legal & KPR', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  MARKETING: { label: 'Marketing & Sales', color: 'text-sky-600', bg: 'bg-sky-500/10' },
  ENGINEERING: { label: 'Engineering & Project', color: 'text-purple-600', bg: 'bg-purple-500/10' },
};
