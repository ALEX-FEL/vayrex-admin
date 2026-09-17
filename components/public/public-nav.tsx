'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations, type Locale } from '@/lib/i18n/use-translations';

export function PublicNav() {
  const { t, locale, changeLocale } = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const links = [
    { href: '/#features', label: t('nav.features') },
    { href: '/#cities', label: t('nav.cities') },
    { href: '/chauffeurs', label: t('nav.drivers') },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-brand-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-brand-blue to-brand-purple">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 8H5.6L4.5 11.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="16.5" cy="17.5" r="2.5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Vayrix</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white/70 transition-colors hover:text-white"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{locale}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-lg border border-white/10 bg-brand-surface py-1"
                onMouseLeave={() => setLangOpen(false)}
              >
                {(['fr', 'en'] as Locale[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { changeLocale(l); setLangOpen(false); }}
                    className={cn(
                      'flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-white/5',
                      locale === l ? 'text-white' : 'text-white/50',
                    )}
                  >
                    {l === 'fr' ? 'Français' : 'English'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin237"
            className="hidden rounded-lg border border-white/15 px-4 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white sm:block"
          >
            {t('nav.login')}
          </Link>

          <Link
            href="/chauffeurs"
            className="hidden bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90 sm:block"
          >
            {t('nav.drivers')}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-brand-bg px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin237"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/chauffeurs"
              onClick={() => setMobileOpen(false)}
              className="mt-2 bg-gradient-to-r from-brand-blue to-brand-purple px-4 py-2 text-center text-sm font-medium text-white rounded-lg"
            >
              {t('nav.drivers')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
