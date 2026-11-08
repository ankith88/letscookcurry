import type { SiteSettings } from '@/lib/types';

export const DEFAULT_ADMIN_EMAILS = [
  'ankith88@gmail.com',
  'tanvihegde19@gmail.com',
];

export function getEnvAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  const parsed = raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...parsed]));
}

export function getConfiguredAdminEmails(settings?: SiteSettings | null): string[] {
  const envEmails = getEnvAdminEmails();
  const firestoreEmails = (settings?.adminEmails || [])
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set([...envEmails, ...firestoreEmails]));
}

export function hasAnyAdminConfigured(settings?: SiteSettings | null): boolean {
  return getConfiguredAdminEmails(settings).length > 0;
}

export function isAdminUser(
  email?: string | null,
  settings?: SiteSettings | null
): boolean {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  const allowlist = getConfiguredAdminEmails(settings);
  return allowlist.includes(normalizedEmail);
}
