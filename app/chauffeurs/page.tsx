'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/public/public-layout';
import { SteeringWheelIllustration, PhoneIllustration } from '@/components/public/illustrations';
import {
  CheckCircle2, ClipboardList, Car, Smartphone, TrendingUp, Clock, Wallet, Percent, Calendar,
} from 'lucide-react';
import { getDriverContent, type DriverContent } from '@/lib/api';
import { useTranslations } from '@/lib/i18n/use-translations';

const revenueIcons = [TrendingUp, Star, Percent, Clock];
const stepIcons = [Smartphone, ClipboardList, Car];

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function ChauffeursPage() {
  const { locale } = useTranslations();
  const [content, setContent] = useState<DriverContent | null>(null);

  useEffect(() => {
    getDriverContent(locale).then(setContent).catch(() => {});
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
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-purple/20 blur-[120px]" />
        <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-brand-blue/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6 animate-fade-up">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>
              <p className="max-w-md text-lg text-white/60">{content.hero.subtitle}</p>
              <Link
                href="#inscription"
                className="inline-block bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90"
              >
                {content.cta.button}
              </Link>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 blur-2xl" />
              <div className="relative flex justify-center animate-float">
                <SteeringWheelIllustration className="w-72" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">{content.revenue.title}</h2>
            <p className="mt-2 text-white/50">{content.revenue.subtitle}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {content.revenue.items.map((item, i) => {
              const Icon = revenueIcons[i] ?? Wallet;
              return (
                <div key={i} className="rounded-2xl border border-white/5 bg-brand-surface p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/15 to-brand-purple/15 ring-1 ring-white/10">
                    <Icon className="h-5 w-5 text-brand-blue" />
                  </div>
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-sm text-white/40">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-white">{content.requirements.title}</h2>
              <p className="mt-2 text-white/50">{content.requirements.subtitle}</p>
              <ul className="mt-8 space-y-4">
                {content.requirements.items.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                    <span className="text-sm text-white/70">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse-glow rounded-3xl bg-gradient-to-br from-brand-blue/15 to-brand-purple/10 blur-2xl" />
                <PhoneIllustration className="relative w-56 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">{content.steps.title}</h2>
            <p className="mt-2 text-white/50">{content.steps.subtitle}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {content.steps.items.map((step, i) => {
              const Icon = stepIcons[i] ?? Smartphone;
              return (
                <div key={i} className="rounded-2xl border border-white/5 bg-brand-surface p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 text-lg font-bold text-white ring-1 ring-white/10">
                    {i + 1}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="inscription" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-brand-surface to-brand-bg px-6 py-12 text-center sm:px-12 lg:py-16">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-[500px] -translate-x-1/2 rounded-full bg-brand-purple/15 blur-[100px]" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white">{content.cta.title}</h2>
              <p className="mx-auto mt-3 max-w-md text-white/50">{content.cta.subtitle}</p>
              <Link
                href="#"
                className="mt-8 inline-block bg-gradient-to-r from-brand-blue to-brand-purple px-8 py-3 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90"
              >
                {content.cta.button}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
