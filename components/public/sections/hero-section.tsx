'use client';

import { usePublicContent } from '@/lib/public-site/use-public-content';
import { PillBadge } from '@/components/public/design/badges';
import { PrimaryButton, SecondaryButton, AccentButton } from '@/components/public/design/public-buttons';
import { HeroMapVisual } from '@/components/public/design/visuals';
import { ScrollReveal } from '@/components/public/design/scroll-reveal';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  const c = usePublicContent();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 lg:pb-28">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-cyan/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-brand-purple/15 blur-3xl" />

      <div className="vayrix-section relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <PillBadge>{c.hero.badge}</PillBadge>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              {c.hero.titleLine1}
              <br />
              <span className="vayrix-gradient-text">{c.hero.titleLine2}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">{c.hero.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AccentButton href="#download">{c.hero.ctaBook}</AccentButton>
              <PrimaryButton href="#download">{c.hero.ctaDownload}</PrimaryButton>
              <SecondaryButton href="#why">{c.hero.ctaExplore}</SecondaryButton>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-slate-200/80 pt-8">
              {c.stats.items.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-brand-ink">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120} className="lg:pl-4">
            <HeroMapVisual />
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-brand-purple" />
              {c.hero.tripEstimate} · {c.hero.priceExample}
              <ArrowRight className="h-3 w-3" />
              {c.hero.eta}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
