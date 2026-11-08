import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings, OrderWindowMode } from '@/lib/types';

export const SITE_SETTINGS_COLLECTION = 'settings';
export const SITE_SETTINGS_DOC_ID = 'site';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  orderingFeatureEnabled: true,
  orderWindowMode: 'auto',
  adminEmails: [],
};

export function normalizeSiteSettings(raw?: Partial<SiteSettings> | null): SiteSettings {
  if (!raw) {
    return { ...DEFAULT_SITE_SETTINGS };
  }

  const validModes: OrderWindowMode[] = ['auto', 'open', 'closed'];
  const orderWindowMode: OrderWindowMode =
    raw.orderWindowMode && validModes.includes(raw.orderWindowMode)
      ? raw.orderWindowMode
      : DEFAULT_SITE_SETTINGS.orderWindowMode;

  const adminEmails = Array.isArray(raw.adminEmails)
    ? raw.adminEmails
        .map((email) => String(email).trim().toLowerCase())
        .filter(Boolean)
    : [];

  return {
    orderingFeatureEnabled:
      typeof raw.orderingFeatureEnabled === 'boolean'
        ? raw.orderingFeatureEnabled
        : DEFAULT_SITE_SETTINGS.orderingFeatureEnabled,
    orderWindowMode,
    adminEmails,
    updatedAt: raw.updatedAt,
    updatedBy: raw.updatedBy,
  };
}

export function isWithinAutoOrderSchedule(date: Date = new Date()): boolean {
  const day = date.getDay();
  // Monday (1) to Thursday (4)
  return day >= 1 && day <= 4;
}

export function computeIsOrdersOpen(
  settings: SiteSettings,
  date: Date = new Date()
): boolean {
  if (!settings.orderingFeatureEnabled) {
    return false;
  }

  switch (settings.orderWindowMode) {
    case 'open':
      return true;
    case 'closed':
      return false;
    case 'auto':
    default:
      return isWithinAutoOrderSchedule(date);
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settingsRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return normalizeSiteSettings(snap.data() as Partial<SiteSettings>);
    }
  } catch (error) {
    console.error('Error loading site settings, falling back to defaults:', error);
  }
  return { ...DEFAULT_SITE_SETTINGS };
}

export async function updateSiteSettings(
  partial: Partial<SiteSettings>,
  updatedBy?: string
): Promise<SiteSettings> {
  const settingsRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
  const current = await getSiteSettings();
  const nextSettings: SiteSettings = normalizeSiteSettings({
    ...current,
    ...partial,
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy || current.updatedBy,
  });

  await setDoc(settingsRef, nextSettings, { merge: true });
  return nextSettings;
}

