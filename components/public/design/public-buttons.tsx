import Link from 'next/link';
import { cn } from '@/lib/utils';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2';

export function PrimaryButton({
  href,
  onClick,
  children,
  className,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const cls = cn(
    base,
    'bg-gradient-to-r from-brand-blue to-brand-purple px-6 py-3 text-white shadow-lg shadow-brand-blue/25 hover:shadow-xl hover:shadow-brand-purple/20 hover:brightness-105 active:scale-[0.98]',
    className,
  );
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        'border border-slate-200 bg-white px-6 py-3 text-brand-ink hover:border-brand-blue/30 hover:bg-brand-soft',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function AccentButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(base, 'bg-brand-orange px-6 py-3 text-white shadow-md shadow-brand-orange/30 hover:brightness-105', className)}
    >
      {children}
    </Link>
  );
}

export function StoreButton({ store, label }: { store: 'google' | 'apple'; label: string }) {
  return (
    <button
      type="button"
      className="flex min-w-[180px] items-center gap-3 rounded-xl border border-slate-200 bg-brand-ink px-4 py-3 text-left transition hover:border-brand-blue/40 hover:shadow-lg"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-lg text-white">
        {store === 'google' ? '▶' : ''}
      </span>
      <span>
        <span className="block text-[10px] uppercase tracking-wide text-white/60">{label}</span>
        <span className="block text-sm font-semibold text-white">{store === 'google' ? 'Google Play' : 'App Store'}</span>
      </span>
    </button>
  );
}
