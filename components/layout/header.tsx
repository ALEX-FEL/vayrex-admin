'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Moon, Sun, ChevronRight, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  courses: 'Courses',
  drivers: 'Chauffeurs',
  clients: 'Clients',
  payments: 'Paiements',
  'vehicle-types': 'Types de véhicules',
  pricing: 'Tarification',
  settings: 'Paramètres',
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: breadcrumbMap[seg] ?? seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="fixed left-60 right-0 top-0 z-40 flex h-[60px] items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-sm">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
          Accueil
        </Link>
        {crumbs.map((crumb) => (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            {crumb.isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="ml-2 flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
            A
          </div>
          <span className="text-xs font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
