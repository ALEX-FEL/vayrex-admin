'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations, type Locale } from '@/lib/i18n/use-translations';
import { usePublicContent } from '@/lib/public-site/use-public-content';
import { VayrixLogo } from '@/components/public/design/vayrix-logo';
import { PrimaryButton } from '@/components/public/design/public-buttons';

export function PublicNav() {
  const { locale, changeLocale } = useTranslations();
  const c = usePublicContent();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/#why', label: c.nav.solutions },
    { href: '/#services', label: c.nav.services },
    { href: '/#technology', label: c.nav.technology },
    { href: '/#safety', label: c.nav.safety },
    { href: '/#intelligence', label: c.nav.ai },
    { href: '/#global', label: c.nav.about },
  ];

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur-xl'
          : 'bg-white/70 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <VayrixLogo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-600 transition-colors hover:bg-brand-soft hover:text-brand-ink"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{locale}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                onMouseLeave={() => setLangOpen(false)}
              >
                {(['fr', 'en'] as Locale[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      changeLocale(l);
                      setLangOpen(false);
                    }}
                    className={cn(
                      'flex w-full px-3 py-2 text-sm transition-colors hover:bg-brand-soft',
                      locale === l ? 'font-medium text-brand-blue' : 'text-slate-600',
                    )}
                  >
                    {l === 'fr' ? 'Français' : 'English'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <PrimaryButton href="#download" className="hidden px-4 py-2 text-sm sm:inline-flex">
            {c.nav.downloadApp}
          </PrimaryButton>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-ink hover:bg-brand-soft lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-soft"
              >
                {link.label}
              </Link>
            ))}
            <PrimaryButton href="#download" className="mt-3 w-full py-3" onClick={() => setMobileOpen(false)}>
              {c.nav.downloadApp}
            </PrimaryButton>
          </nav>
        </div>
      )}
    </header>
  );
}
