'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/public/public-layout';
import {
  RouteIllustration,
  PhoneIllustration,
  CityIllustration,
  ShieldIllustration,
} from '@/components/public/illustrations';
import {
  Handshake, ShieldCheck, Signal, Wallet, MapPin, Headphones, Star, Download,
} from 'lucide-react';
import { getSiteContent, type SiteContent } from '@/lib/api';
import { useTranslations } from '@/lib/i18n/use-translations';

const featureIcons = [Handshake, ShieldCheck, Signal, Wallet, MapPin, Headphones];

export default function HomePage() {
  const { t, locale } = useTranslations();
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    getSiteContent(locale).then(setContent).catch(() => {});
  }, [locale]);

  if (!content) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-brand-blue" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-brand-blue/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-brand-purple/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {content.hero.badge}
              </span>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="max-w-md text-lg text-white/60">
                {content.hero.subtitle}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#download"
                  className="bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 text-center text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90"
                >
                  {content.hero.ctaPrimary}
                </Link>
                <Link
                  href="/chauffeurs"
                  className="border border-white/15 px-6 py-3 text-center text-sm font-medium text-white rounded-xl transition-colors hover:border-white/30"
                >
                  {content.hero.ctaSecondary}
                </Link>
              </div>
              {/* stats */}
              <div className="flex gap-8 pt-4">
                {content.hero.stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* illustration */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 animate-pulse-glow rounded-3xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/10 blur-2xl" />
              <div className="relative animate-float">
                <RouteIllustration className="w-full rounded-3xl" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-40 animate-float" style={{ animationDelay: '1s' }}>
                <PhoneIllustration className="w-full drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">{content.howItWorks.title}</h2>
            <p className="mt-2 text-white/50">{content.howItWorks.subtitle}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.howItWorks.steps.map((step, i) => (
              <div key={i} className="group relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 text-lg font-bold text-white ring-1 ring-white/10">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{step.description}</p>
                {i < 3 && (
                  <div className="absolute right-0 top-6 hidden h-px w-8 bg-gradient-to-r from-white/20 to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">{content.features.title}</h2>
            <p className="mt-2 text-white/50">{content.features.subtitle}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.features.items.map((feature, i) => {
              const Icon = featureIcons[i] ?? MapPin;
              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/5 bg-brand-surface p-6 transition-colors hover:border-white/10"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/15 to-brand-purple/15 ring-1 ring-white/10">
                    <Icon className="h-5 w-5 text-brand-blue" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">{content.cities.title}</h2>
            <p className="mt-2 text-white/50">{content.cities.subtitle}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.cities.items.map((city, i) => {
              const isAvailable = city.status === 'Disponible' || city.status === 'Available';
              return (
                <div key={i} className="relative overflow-hidden rounded-2xl border border-white/5 bg-brand-surface p-6">
                  <CityIllustration className="absolute inset-x-0 bottom-0 h-24 opacity-40" />
                  <div className="relative">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">{city.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isAvailable
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-amber-500/15 text-amber-400'
                        }`}
                      >
                        {city.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/40">{city.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">{content.testimonials.title}</h2>
            <p className="mt-2 text-white/50">{content.testimonials.subtitle}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {content.testimonials.items.map((testimonial, i) => (
              <div key={i} className="rounded-2xl border border-white/5 bg-brand-surface p-6">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-white/70">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-sm font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{testimonial.name}</p>
                    <p className="text-xs text-white/40">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section id="download" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-brand-surface px-6 py-12 text-center sm:px-12 lg:py-16">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-[500px] -translate-x-1/2 rounded-full bg-brand-blue/15 blur-[100px]" />
            <div className="relative">
              <div className="mx-auto mb-6 w-fit">
                <ShieldIllustration className="h-20" />
              </div>
              <h2 className="text-3xl font-bold text-white">{content.download.title}</h2>
              <p className="mx-auto mt-3 max-w-md text-white/50">{content.download.subtitle}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-left transition-opacity hover:opacity-90">
                  <Download className="h-6 w-6 text-brand-bg" />
                  <div>
                    <p className="text-[10px] text-gray-500">{content.download.android}</p>
                    <p className="text-sm font-semibold text-brand-bg">Google Play</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-left transition-opacity hover:opacity-90">
                  <Download className="h-6 w-6 text-brand-bg" />
                  <div>
                    <p className="text-[10px] text-gray-500">{content.download.ios}</p>
                    <p className="text-sm font-semibold text-brand-bg">App Store</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
