'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/use-translations';

export function PublicFooter() {
  const { t } = useTranslations();

  return (
    <footer className="border-t border-white/5 bg-brand-bg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-brand-blue to-brand-purple">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 8H5.6L4.5 11.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="16.5" cy="17.5" r="2.5" />
                </svg>
              </div>
              <span className="text-base font-bold text-white">Vayrix</span>
            </div>
            <p className="text-sm text-white/40">{t('footer.tagline')}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">{t('footer.product')}</h4>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-white/60 transition-colors hover:text-white">{t('nav.features')}</t></Link></li>
              <li><Link href="/#cities" className="text-sm text-white/60 transition-colors hover:text-white">{t('nav.cities')}</t></Link></li>
              <li><Link href="/chauffeurs" className="text-sm text-white/60 transition-colors hover:text-white">{t('nav.drivers')}</t></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">{t('footer.company')}</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-white/60">{t('footer.about')}</span></li>
              <li><span className="text-sm text-white/60">{t('footer.careers')}</span></li>
              <li><span className="text-sm text-white/60">{t('footer.blog')}</span></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-white/60">{t('footer.help')}</span></li>
              <li><span className="text-sm text-white/60">{t('footer.contact')}</span></li>
              <li><span className="text-sm text-white/60">{t('footer.terms')}</span></li>
              <li><span className="text-sm text-white/60">{t('footer.privacy')}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6">
          <p className="text-xs text-white/30">© 2025 Vayrix. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
}
