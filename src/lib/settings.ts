import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings, OrderWindowMode } from '@/lib/types';

export const SITE_SETTINGS_COLLECTION = 'settings';
export const SITE_SETTINGS_DOC_ID = 'site';
export const SITE_SETTINGS_STORAGE_KEY = 'lets_cook_curry_site_settings';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  orderingFeatureEnabled: true,
  orderWindowMode: 'auto',
  adminEmails: ['ankith88@gmail.com', 'tanvihegde19@gmail.com'],
  featuredRecipeId: '',
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

  const rawEmails = Array.isArray(raw.adminEmails)
    ? raw.adminEmails
        .map((email) => String(email).trim().toLowerCase())
        .filter(Boolean)
    : [];

  const adminEmails = Array.from(
    new Set([...DEFAULT_SITE_SETTINGS.adminEmails, ...rawEmails])
  );

  const normalized: SiteSettings = {
    orderingFeatureEnabled:
      typeof raw.orderingFeatureEnabled === 'boolean'
        ? raw.orderingFeatureEnabled
        : DEFAULT_SITE_SETTINGS.orderingFeatureEnabled,
    orderWindowMode,
    adminEmails,
    featuredRecipeId:
      typeof raw.featuredRecipeId === 'string'
        ? raw.featuredRecipeId.trim()
        : DEFAULT_SITE_SETTINGS.featuredRecipeId,
  };

  if (typeof raw.updatedAt === 'string' && raw.updatedAt) {
    normalized.updatedAt = raw.updatedAt;
  }
  if (typeof raw.updatedBy === 'string' && raw.updatedBy) {
    normalized.updatedBy = raw.updatedBy;
  }

  return normalized;
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
  // 1. Try Firestore first
  try {
    const settingsRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return normalizeSiteSettings(snap.data() as Partial<SiteSettings>);
    }
  } catch (error) {
    // Ignore permission error if Firestore rules are not deployed yet and fall back to server/local settings
  }

  // 2. If running on client, try API fallback or localStorage
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          return normalizeSiteSettings(data.settings);
        }
      }
    } catch {
      // Fallback to localStorage
    }
    try {
      const cached = window.localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
      if (cached) {
        return normalizeSiteSettings(JSON.parse(cached));
      }
    } catch {
      // Ignore
    }
  } else {
    // Running on server: check .data/site-settings.json if it exists
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), '.data', 'site-settings.json');
      const raw = await fs.readFile(filePath, 'utf-8');
      return normalizeSiteSettings(JSON.parse(raw));
    } catch {
      // Ignore if file does not exist yet
    }
  }

  return { ...DEFAULT_SITE_SETTINGS };
}

export async function updateSiteSettings(
  partial: Partial<SiteSettings>,
  updatedBy?: string
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const nextSettings: SiteSettings = normalizeSiteSettings({
    ...current,
    ...partial,
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy || current.updatedBy,
  });

  // Save to localStorage on client for instant cross-tab sync
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        SITE_SETTINGS_STORAGE_KEY,
        JSON.stringify(nextSettings)
      );
    } catch {
      // Ignore storage error
    }
  }

  // Save to server API fallback (.data/site-settings.json + revalidatePath)
  let savedViaApi = false;
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextSettings),
      });
      if (res.ok) {
        savedViaApi = true;
      }
    } catch {
      // Ignore network error
    }
  }

  // Also save to Firestore `settings/site`
  try {
    const settingsRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    await setDoc(settingsRef, nextSettings, { merge: true });
  } catch (firestoreError: any) {
    if (!savedViaApi) {
      throw firestoreError;
    }
    console.warn(
      'Saved site settings via server store; Firestore settings/site write skipped until rules are deployed:',
      firestoreError?.message
    );
  }

  return nextSettings;
}
