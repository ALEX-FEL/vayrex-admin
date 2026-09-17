import { cn } from '@/lib/utils';

export function V1Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-green/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-green ring-1 ring-brand-green/20">
      {children}
    </span>
  );
}

export function ComingSoonBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-brand-purple/10 to-brand-cyan/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-purple ring-1 ring-brand-purple/20">
      {children}
    </span>
  );
}

export function PillBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
      {children}
    </span>
  );
}
