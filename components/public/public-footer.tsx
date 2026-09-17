'use client';

import Link from 'next/link';
import { usePublicContent } from '@/lib/public-site/use-public-content';
import { VayrixLogo } from '@/components/public/design/vayrix-logo';

export function PublicFooter() {
  const c = usePublicContent();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#services', label: c.nav.services },
    { href: '/#client', label: c.client.label },
    { href: '/#driver', label: c.driver.label },
    { href: '/#safety', label: c.nav.safety },
    { href: '/#technology', label: c.nav.technology },
    { href: '/#intelligence', label: 'VAYRIX Intelligence' },
    { href: '/#coming-soon', label: c.comingSoon.badge },
    { href: '/#contact', label: c.contact.title.split(' ')[0] },
  ];

  return (
    <footer className="border-t border-slate-200 bg-brand-soft">
      <div className="vayrix-section py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <VayrixLogo />
            <p className="max-w-xs text-sm leading-relaxed text-slate-600">{c.footer.tagline}</p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{c.footer.nav}</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-sm text-slate-600 transition-colors hover:text-brand-blue">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{c.footer.legal}</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-slate-600">{c.footer.privacy}</span></li>
              <li><span className="text-sm text-slate-600">{c.footer.terms}</span></li>
              <li><span className="text-sm text-slate-600">{c.footer.cookies}</span></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{c.footer.apps}</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#download" className="text-sm text-slate-600 hover:text-brand-blue">
                  {c.download.client}
                </Link>
              </li>
              <li>
                <Link href="/#download" className="text-sm text-slate-600 hover:text-brand-blue">
                  {c.download.driver}
                </Link>
              </li>
              <li>
                <Link href="/chauffeurs" className="text-sm text-slate-600 hover:text-brand-blue">
                  {c.driver.label}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-200/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} VAYRIX. {c.footer.rights}.</p>
          <p className="text-xs text-slate-400">Cameroon · Global mobility</p>
        </div>
      </div>
    </footer>
  );
}
