'use client';

import { usePublicContent } from '@/lib/public-site/use-public-content';
import { SectionHeader } from '@/components/public/design/section-header';
import { ScrollReveal } from '@/components/public/design/scroll-reveal';
import { ComingSoonBadge, V1Badge } from '@/components/public/design/badges';
import { WorldMapVisual } from '@/components/public/design/visuals';
import {
  Shield, Car, Radio, Fingerprint, Headphones, Activity, Sparkles, Brain,
  Cloud, Lock, BarChart3, Wallet, Smartphone, Satellite, GitBranch,
} from 'lucide-react';

export function SafetySection() {
  const c = usePublicContent();
  const icons = [Shield, Car, Radio, Fingerprint, Activity, Headphones];
  return (
    <section id={c.safety.id} className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-brand-soft/50 to-white" />
      <div className="vayrix-section relative">
        <ScrollReveal>
          <SectionHeader label={c.safety.label} title={c.safety.title} />
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.safety.points.map((p, i) => {
            const Icon = icons[i] ?? Shield;
            return (
              <ScrollReveal key={p.title} delay={i * 50}>
                <div className="vayrix-card vayrix-card-hover flex gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-ink">{p.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PaymentSection() {
  const c = usePublicContent();
  return (
    <section id={c.payment.id} className="bg-brand-soft py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3">
            <V1Badge>{c.badges.v1}</V1Badge>
            <SectionHeader label={c.payment.label} title={c.payment.title} subtitle={c.payment.desc} />
          </div>
        </ScrollReveal>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {c.payment.methods.map((m, i) => (
            <ScrollReveal key={m.name} delay={i * 80}>
              <div className="vayrix-card vayrix-card-hover p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple text-white">
                  {i === 0 ? <Wallet className="h-7 w-7" /> : <Smartphone className="h-7 w-7" />}
                </div>
                <h3 className="text-xl font-bold text-brand-ink">{m.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{m.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RealtimeSection() {
  const c = usePublicContent();
  const icons = [Satellite, Radio, GitBranch, Activity, Sparkles];
  return (
    <section id={c.realtime.id} className="py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <SectionHeader label={c.realtime.label} title={c.realtime.title} />
        </ScrollReveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.realtime.items.map((item, i) => {
            const Icon = icons[i] ?? Satellite;
            return (
              <ScrollReveal key={item} delay={i * 40}>
                <div className="flex items-center gap-3 rounded-2xl border border-brand-cyan/20 bg-gradient-to-r from-white to-brand-cyan/5 p-4">
                  <Icon className="h-5 w-5 shrink-0 text-brand-cyan" />
                  <span className="text-sm font-medium text-brand-ink">{item}</span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function IntelligenceSection() {
  const c = usePublicContent();
  return (
    <section id={c.intelligence.id} className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-purple to-brand-blue py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,255,0.25),transparent_50%)]" />
      <div className="vayrix-section relative">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-4 text-center">
            <ComingSoonBadge>{c.intelligence.badge}</ComingSoonBadge>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{c.intelligence.subtitle}</p>
            <h2 className="max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl">{c.intelligence.title}</h2>
          </div>
        </ScrollReveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.intelligence.features.map((f, i) => (
            <ScrollReveal key={f} delay={i * 40}>
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15">
                <Brain className="mb-2 h-5 w-5 text-brand-cyan" />
                <p className="text-sm font-medium">{f}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ComingSoonSection() {
  const c = usePublicContent();
  return (
    <section id={c.comingSoon.id} className="bg-white py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3">
            <ComingSoonBadge>{c.comingSoon.badge}</ComingSoonBadge>
            <SectionHeader title={c.comingSoon.title} subtitle={c.comingSoon.subtitle} />
          </div>
        </ScrollReveal>
        <div className="flex flex-wrap justify-center gap-2">
          {c.comingSoon.items.map((item, i) => (
            <ScrollReveal key={item} delay={(i % 6) * 30}>
              <span className="inline-flex rounded-full border border-slate-200 bg-brand-soft px-4 py-2 text-sm font-medium text-slate-700">
                {item}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GlobalVisionSection() {
  const c = usePublicContent();
  return (
    <section id={c.global.id} className="bg-brand-soft py-16 md:py-24">
      <div className="vayrix-section">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <SectionHeader align="left" label={c.global.label} title={c.global.title} subtitle={c.global.desc} className="mb-8" />
            <div className="space-y-4">
              {c.global.phases.map((phase, i) => (
                <div key={phase.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-brand-ink">{phase.title}</h3>
                    <p className="text-sm text-slate-600">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <WorldMapVisual />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export function TechnologySection() {
  const c = usePublicContent();
  const icons = [Smartphone, Radio, Satellite, Cloud, GitBranch, Lock, BarChart3, Brain];
  return (
    <section id={c.technology.id} className="py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <SectionHeader label={c.technology.label} title={c.technology.title} />
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.technology.items.map((item, i) => {
            const Icon = icons[i] ?? Cloud;
            return (
              <ScrollReveal key={item.title} delay={i * 40}>
                <div className="vayrix-card vayrix-card-hover h-full p-5">
                  <Icon className="mb-3 h-6 w-6 text-brand-blue" />
                  <h3 className="font-semibold text-brand-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
