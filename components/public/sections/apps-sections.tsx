'use client';

import { usePublicContent } from '@/lib/public-site/use-public-content';
import { SectionHeader } from '@/components/public/design/section-header';
import { ScrollReveal } from '@/components/public/design/scroll-reveal';
import { V1Badge } from '@/components/public/design/badges';
import { PhoneMockup } from '@/components/public/design/visuals';
import { PrimaryButton } from '@/components/public/design/public-buttons';
import { Check } from 'lucide-react';

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
            <Check className="h-3 w-3" />
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

export function ClientExperienceSection() {
  const c = usePublicContent();
  return (
    <section id={c.client.id} className="bg-brand-soft py-16 md:py-24">
      <div className="vayrix-section">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <V1Badge>{c.badges.v1}</V1Badge>
            <SectionHeader
              align="left"
              label={c.client.label}
              title={c.client.title}
              subtitle={c.client.subtitle}
              className="mb-0 mt-4"
            />
            <FeatureList items={c.client.features} />
            <PrimaryButton href="#download" className="mt-8">
              {c.nav.downloadApp}
            </PrimaryButton>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <PhoneMockup variant="client" className="lg:ml-auto" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export function DriverExperienceSection() {
  const c = usePublicContent();
  return (
    <section id={c.driver.id} className="py-16 md:py-24">
      <div className="vayrix-section">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal className="order-2 lg:order-1">
            <PhoneMockup variant="driver" />
          </ScrollReveal>
          <ScrollReveal delay={80} className="order-1 lg:order-2">
            <V1Badge>{c.badges.v1}</V1Badge>
            <SectionHeader
              align="left"
              label={c.driver.label}
              title={c.driver.title}
              subtitle={c.driver.subtitle}
              className="mb-0 mt-4"
            />
            <FeatureList items={c.driver.features} />
            <PrimaryButton href="/chauffeurs" className="mt-8">
              {c.hero.ctaExplore}
            </PrimaryButton>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
