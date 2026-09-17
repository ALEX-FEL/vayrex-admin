'use client';

import { useEffect, useRef, useState } from 'react';
import { usePublicContent } from '@/lib/public-site/use-public-content';
import { SectionHeader } from '@/components/public/design/section-header';
import { ScrollReveal } from '@/components/public/design/scroll-reveal';
import { StoreButton } from '@/components/public/design/public-buttons';
import { PhoneMockup } from '@/components/public/design/visuals';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PrimaryButton } from '@/components/public/design/public-buttons';
import { Mail, Phone, MessageCircle } from 'lucide-react';

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setActive(true), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${active ? 'scale-100 opacity-100' : 'scale-95 opacity-60'}`}
    >
      <p className="text-3xl font-bold vayrix-gradient-text sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
    </div>
  );
}

export function StatsSection() {
  const c = usePublicContent();
  return (
    <section id={c.stats.id} className="border-y border-slate-200/80 bg-white py-16 md:py-20">
      <div className="vayrix-section">
        <ScrollReveal>
          <SectionHeader title={c.stats.title} subtitle={c.stats.note} />
        </ScrollReveal>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {c.stats.items.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function DownloadSection() {
  const c = usePublicContent();
  return (
    <section id={c.download.id} className="relative overflow-hidden bg-gradient-to-br from-brand-soft via-white to-brand-cyan/10 py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <SectionHeader title={c.download.title} />
        </ScrollReveal>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
          <ScrollReveal delay={50} className="text-center">
            <p className="mb-4 text-sm font-semibold text-brand-blue">{c.download.client}</p>
            <PhoneMockup variant="client" />
            <div className="mt-6 flex flex-col items-center gap-2">
              <StoreButton store="google" label="Get it on" />
              <StoreButton store="apple" label="Download on the" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80} className="hidden lg:flex lg:flex-col lg:items-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-dashed border-brand-blue/30 bg-white text-xs text-slate-400">
              QR
            </div>
            <p className="mt-3 text-xs text-slate-500">{c.download.scan}</p>
          </ScrollReveal>
          <ScrollReveal delay={100} className="text-center">
            <p className="mb-4 text-sm font-semibold text-brand-purple">{c.download.driver}</p>
            <PhoneMockup variant="driver" />
            <div className="mt-6 flex flex-col items-center gap-2">
              <StoreButton store="google" label="Get it on" />
              <StoreButton store="apple" label="Download on the" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const c = usePublicContent();
  const colors = ['border-brand-blue/30', 'border-brand-purple/30', 'border-brand-cyan/30'];
  return (
    <section id={c.testimonials.id} className="py-16 md:py-24">
      <div className="vayrix-section">
        <ScrollReveal>
          <SectionHeader title={c.testimonials.title} />
        </ScrollReveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {c.testimonials.items.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 70}>
              <blockquote className={`vayrix-card vayrix-card-hover h-full border-l-4 p-6 ${colors[i]}`}>
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-purple">{t.type}</span>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-ink">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const c = usePublicContent();
  return (
    <section id={c.faq.id} className="bg-brand-soft py-16 md:py-24">
      <div className="vayrix-section max-w-3xl">
        <ScrollReveal>
          <SectionHeader title={c.faq.title} />
        </ScrollReveal>
        <ScrollReveal delay={60}>
          <Accordion type="single" collapsible className="rounded-2xl border border-slate-200/80 bg-white px-4 shadow-sm">
            {c.faq.items.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-brand-ink hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function ContactSection() {
  const c = usePublicContent();
  return (
    <section id={c.contact.id} className="py-16 md:py-24">
      <div className="vayrix-section">
        <div className="grid gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <SectionHeader align="left" title={c.contact.title} subtitle={c.contact.subtitle} className="mb-8" />
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-600">
                <Mail className="h-5 w-5 text-brand-blue" />
                <a href={`mailto:${c.contact.email}`} className="hover:text-brand-blue">
                  {c.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Phone className="h-5 w-5 text-brand-blue" />
                <span>{c.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <MessageCircle className="h-5 w-5 text-brand-blue" />
                <span>{c.contact.partnership}</span>
              </li>
            </ul>
            <div className="mt-8 flex gap-3">
              {['in', 'x', 'fb'].map((s) => (
                <span
                  key={s}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold uppercase text-slate-400"
                >
                  {s}
                </span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <form
              className="vayrix-card space-y-4 p-6 md:p-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-ink">{c.contact.name}</label>
                <Input placeholder="…" className="rounded-xl border-slate-200" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-ink">Email</label>
                <Input type="email" placeholder="…" className="rounded-xl border-slate-200" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-ink">{c.contact.message}</label>
                <Textarea rows={4} placeholder="…" className="rounded-xl border-slate-200" />
              </div>
              <PrimaryButton href="#download" className="mt-8">
                {c.contact.send}
              </PrimaryButton>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
