'use client';

import { usePublicContent } from '@/lib/public-site/use-public-content';
import { SectionHeader } from '@/components/public/design/section-header';
import { ScrollReveal } from '@/components/public/design/scroll-reveal';
import { V1Badge } from '@/components/public/design/badges';
import {
  Zap, ShieldCheck, Eye, Lock, Users, Cpu,
  MapPin, Car, UserCheck, Flag,
  Bike, CarFront, Gem, Truck, Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const whyIcons = [Zap, ShieldCheck, Eye, Lock, Users, Cpu];
const serviceIcons = [Bike, CarFront, Gem, Truck, Package];
const serviceStyles = [
  'from-brand-blue/10 to-brand-cyan/5 border-brand-blue/20',
  'from-brand-soft to-white border-slate-200',
  'from-brand-purple/10 to-brand-blue/5 border-brand-purple/20',
  'from-brand-green/10 to-brand-soft border-brand-green/20',
  'from-brand-orange/10 to-white border-brand-orange/25',
];

export function WhySection() {
  const c = usePublicContent();
  return (
    <section id={c.why.id} className="bg-brand-soft py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <SectionHeader label={c.why.label} title={c.why.title} subtitle={c.why.subtitle} />
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.why.items.map((item, i) => {
            const Icon = whyIcons[i] ?? Cpu;
            return (
              <ScrollReveal key={item.title} delay={i * 60}>
                <div className="vayrix-card vayrix-card-hover h-full p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple text-white shadow-md shadow-brand-blue/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowSection() {
  const c = usePublicContent();
  const stepIcons = [MapPin, Car, UserCheck, Flag];
  return (
    <section id={c.how.id} className="py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <SectionHeader label={c.how.label} title={c.how.title} />
        </ScrollReveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {c.how.steps.map((step, i) => {
            const Icon = stepIcons[i] ?? MapPin;
            return (
              <ScrollReveal key={step.title} delay={i * 80}>
                <div className="relative h-full rounded-2xl border border-dashed border-brand-blue/25 bg-white p-6 transition hover:border-brand-blue/40 hover:shadow-lg">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <Icon className="h-5 w-5 text-brand-purple" />
                  </div>
                  <h3 className="font-semibold text-brand-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const c = usePublicContent();
  return (
    <section id={c.services.id} className="bg-white py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <V1Badge>{c.badges.v1}</V1Badge>
            <SectionHeader label={c.services.label} title={c.services.title} subtitle={c.services.subtitle} />
          </div>
        </ScrollReveal>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {c.services.items.map((svc, i) => {
            const Icon = serviceIcons[i] ?? Car;
            return (
              <ScrollReveal key={svc.name} delay={i * 50}>
                <article
                  className={cn(
                    'vayrix-card vayrix-card-hover flex h-full flex-col overflow-hidden border bg-gradient-to-br p-0',
                    serviceStyles[i % serviceStyles.length],
                  )}
                >
                  <div className="flex h-32 items-center justify-center bg-white/50">
                    <Icon className="h-14 w-14 text-brand-blue opacity-90" strokeWidth={1.25} />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-bold text-brand-ink">{svc.name}</h3>
                      <span className="shrink-0 rounded-lg bg-brand-ink px-2 py-1 text-xs font-semibold text-white">
                        {svc.price}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-purple">{svc.use}</p>
                    <p className="mt-3 flex-1 text-sm text-slate-600">{svc.desc}</p>
                    <a href="#download" className="mt-4 text-sm font-semibold text-brand-blue hover:text-brand-purple">
                      →
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
