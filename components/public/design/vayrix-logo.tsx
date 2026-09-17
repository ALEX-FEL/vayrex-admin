import { cn } from '@/lib/utils';

export function VayrixLogo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple shadow-md shadow-brand-blue/25">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 8H5.6L4.5 11.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2" />
          <circle cx="7.5" cy="17.5" r="2.5" />
          <circle cx="16.5" cy="17.5" r="2.5" />
        </svg>
      </div>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-brand-ink">
          VAY<span className="text-brand-blue">RIX</span>
        </span>
      )}
    </div>
  );
}
