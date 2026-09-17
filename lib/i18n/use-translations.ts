'use client';

import { useState, useEffect, useCallback } from 'react';
import fr from '@/lib/i18n/fr.json';
import en from '@/lib/i18n/en.json';

export type Locale = 'fr' | 'en';

const dictionaries = { fr, en };

const STORAGE_KEY = 'vayrix-locale';

export function useTranslations() {
  const [locale, setLocale] = useState<Locale>('fr');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'fr' || stored === 'en') {
      setLocale(stored);
    }
  }, []);

  const changeLocale = useCallback((l: Locale) => {
    setLocale(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, l);
    }
  }, []);

  const t = useCallback(
    (key: string): any => {
      const dict = dictionaries[locale] as Record<string, any>;
      const parts = key.split('.');
      let result: any = dict;
      for (const part of parts) {
        result = result?.[part];
      }
      return result ?? key;
    },
    [locale],
  );

  return { t, locale, changeLocale };
}

export type TranslationFn = ReturnType<typeof useTranslations>['t'];
