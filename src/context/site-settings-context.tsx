"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { app, db } from '@/lib/firebase';
import type { SiteSettings, OrderWindowMode } from '@/lib/types';
import {
  DEFAULT_SITE_SETTINGS,
  SITE_SETTINGS_COLLECTION,
  SITE_SETTINGS_DOC_ID,
  SITE_SETTINGS_STORAGE_KEY,
  computeIsOrdersOpen,
  getSiteSettings,
  normalizeSiteSettings,
  updateSiteSettings,
} from '@/lib/settings';
import { hasAnyAdminConfigured, isAdminUser } from '@/lib/admin';

interface SiteSettingsContextValue {
  settings: SiteSettings;
  orderingFeatureEnabled: boolean;
  orderWindowMode: OrderWindowMode;
  isOrdersOpen: boolean;
  loading: boolean;
  authLoading: boolean;
  currentUser: FirebaseUser | null;
  isAdmin: boolean;
  canBootstrapAdmin: boolean;
  saveSettings: (partial: Partial<SiteSettings>) => Promise<SiteSettings>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SITE_SETTINGS,
  orderingFeatureEnabled: DEFAULT_SITE_SETTINGS.orderingFeatureEnabled,
  orderWindowMode: DEFAULT_SITE_SETTINGS.orderWindowMode,
  isOrdersOpen: false,
  loading: true,
  authLoading: true,
  currentUser: null,
  isAdmin: false,
  canBootstrapAdmin: false,
  saveSettings: async () => DEFAULT_SITE_SETTINGS,
});

const auth = getAuth(app);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);

    // Load initial settings (from Firestore or server/local fallback)
    getSiteSettings().then((initial) => {
      setSettings(initial);
      setLoading(false);
    });

    const settingsRef = doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    const unsubscribeSettings = onSnapshot(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(normalizeSiteSettings(snapshot.data() as Partial<SiteSettings>));
          setLoading(false);
        }
      },
      () => {
        // If Firestore snapshot fails due to rules not yet deployed, getSiteSettings() already loaded fallback
        setLoading(false);
      }
    );

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SITE_SETTINGS_STORAGE_KEY && e.newValue) {
        try {
          setSettings(normalizeSiteSettings(JSON.parse(e.newValue)));
        } catch {
          // Ignore parse error
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => {
      unsubscribeSettings();
      unsubscribeAuth();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isOrdersOpen = useMemo(() => {
    if (!isClientMounted) return false;
    return computeIsOrdersOpen(settings, new Date());
  }, [settings, isClientMounted]);

  const isAdmin = useMemo(() => {
    return isAdminUser(currentUser?.email, settings);
  }, [currentUser, settings]);

  const canBootstrapAdmin = useMemo(() => {
    return Boolean(currentUser?.email) && !hasAnyAdminConfigured(settings);
  }, [currentUser, settings]);

  const saveSettings = async (partial: Partial<SiteSettings>) => {
    const updated = await updateSiteSettings(partial, currentUser?.email || undefined);
    setSettings(updated);
    return updated;
  };

  const value: SiteSettingsContextValue = {
    settings,
    orderingFeatureEnabled: settings.orderingFeatureEnabled,
    orderWindowMode: settings.orderWindowMode,
    isOrdersOpen,
    loading,
    authLoading,
    currentUser,
    isAdmin,
    canBootstrapAdmin,
    saveSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
