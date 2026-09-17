import { cn } from '@/lib/utils';

export function HeroMapVisual({ className }: { className?: string }) {
  return (
    <div className={cn('relative aspect-[4/3] w-full max-w-xl lg:max-w-none', className)}>
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-blue/20 via-brand-purple/10 to-brand-cyan/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-brand-soft to-white p-4 shadow-xl shadow-brand-blue/10">
        <div className="animate-map-drift relative h-full min-h-[280px] overflow-hidden rounded-2xl bg-[#E8EEFF]">
          <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="hero-route" x1="0" y1="0" x2="400" y2="320">
                <stop stopColor="#3B6BFF" />
                <stop offset="1" stopColor="#7B5CFF" />
              </linearGradient>
            </defs>
            {[40, 80, 120, 160, 200, 240, 280].map((y) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#CBD5F5" strokeWidth="1" />
            ))}
            {[50, 100, 150, 200, 250, 300, 350].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="#CBD5F5" strokeWidth="1" />
            ))}
            <path
              d="M60 240 C 120 240, 140 140, 200 130 S 310 70, 330 90"
              fill="none"
              stroke="url(#hero-route)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="60" cy="240" r="8" fill="#3B6BFF" className="animate-marker-pulse" />
            <circle cx="330" cy="90" r="8" fill="#7B5CFF" />
          </svg>
          {/* floating cards */}
          <div className="absolute left-3 top-3 w-[42%] rounded-xl border border-white/80 bg-white/90 p-3 shadow-lg backdrop-blur sm:left-4 sm:top-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Driver</p>
            <p className="text-sm font-semibold text-brand-ink">Marc · 4.9</p>
            <p className="text-xs text-brand-green">En route</p>
          </div>
          <div className="absolute bottom-3 right-3 w-[48%] rounded-xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur sm:bottom-4 sm:right-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Trip</p>
            <p className="text-sm font-bold text-brand-ink">Akwa → Bonanjo</p>
            <p className="mt-1 text-xs text-brand-blue">~12 min · 2 500 FCFA</p>
          </div>
          <div className="absolute left-1/2 top-1/2 hidden w-24 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-purple p-2 shadow-lg sm:block animate-float">
            <div className="h-2 w-full rounded bg-white/30" />
            <div className="mt-2 flex justify-between">
              <span className="h-2 w-2 rounded-full bg-white/80" />
              <span className="h-2 w-2 rounded-full bg-white/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneMockup({
  variant,
  className,
}: {
  variant: 'client' | 'driver';
  className?: string;
}) {
  const isClient = variant === 'client';
  return (
    <div className={cn('relative mx-auto w-[220px] sm:w-[240px]', className)}>
      <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-brand-blue/30 to-brand-purple/20 blur-xl" />
      <div className="relative rounded-[2rem] border-[3px] border-slate-800 bg-slate-900 p-2 shadow-2xl">
        <div className="overflow-hidden rounded-[1.5rem] bg-white">
          <div className="flex items-center justify-center bg-brand-soft py-2">
            <div className="h-1 w-16 rounded-full bg-slate-300" />
          </div>
          <div className="space-y-2 p-3">
            <div className={cn('h-28 rounded-xl bg-gradient-to-br', isClient ? 'from-brand-blue/20 to-brand-cyan/20' : 'from-brand-purple/20 to-brand-blue/20')} />
            {isClient ? (
              <>
                <div className="rounded-xl border border-slate-100 p-2">
                  <div className="h-2 w-3/4 rounded bg-slate-200" />
                  <div className="mt-2 h-2 w-1/2 rounded bg-slate-100" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded-lg bg-brand-blue/90" />
                  <div className="h-8 w-16 rounded-lg bg-brand-green/80" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-xl bg-brand-green/10 p-2">
                  <span className="h-2 w-2 rounded-full bg-brand-green" />
                  <span className="text-[10px] font-semibold text-brand-green">En ligne</span>
                </div>
                <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-2">
                  <p className="text-[10px] font-bold text-brand-orange">Nouvelle course</p>
                  <div className="mt-1 h-2 w-full rounded bg-slate-200" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorldMapVisual({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-brand-soft to-white p-6', className)}>
      <svg viewBox="0 0 800 400" className="w-full opacity-90" aria-hidden>
        <defs>
          <linearGradient id="map-grad" x1="0" y1="0" x2="800" y2="400">
            <stop stopColor="#3B6BFF" stopOpacity="0.15" />
            <stop offset="1" stopColor="#7B5CFF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#map-grad)" rx="16" />
        <ellipse cx="380" cy="220" rx="120" ry="100" fill="#3B6BFF" fillOpacity="0.25" />
        <ellipse cx="420" cy="200" rx="40" ry="35" fill="#7B5CFF" fillOpacity="0.35" />
        <path d="M420 200 Q520 180 620 160" stroke="#00D4FF" strokeWidth="2" strokeDasharray="6 6" fill="none" />
        <path d="M620 160 Q680 140 720 120" stroke="#3B6BFF" strokeWidth="2" fill="none" />
        <circle cx="420" cy="200" r="6" fill="#3B6BFF" />
        <circle cx="620" cy="160" r="5" fill="#7B5CFF" />
        <circle cx="720" cy="120" r="5" fill="#00D4FF" />
      </svg>
    </div>
  );
}
