'use client';

import { useMemo } from 'react';
import { useTranslations } from '@/lib/i18n/use-translations';
import { getPublicSiteContent } from './content';

export function usePublicContent() {
  const { locale } = useTranslations();
  return useMemo(() => getPublicSiteContent(locale), [locale]);
}
