import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({ label, title, subtitle, align = 'center', className }: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', 'mb-10 md:mb-14', className)}>
      {label && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">{label}</p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 max-w-2xl text-base text-slate-600 sm:text-lg', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
