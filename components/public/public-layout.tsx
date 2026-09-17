import { PublicNav } from './public-nav';
import { PublicFooter } from './public-footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-brand-ink antialiased">
      <PublicNav />
      <main className="pt-[4.25rem]">{children}</main>
      <PublicFooter />
    </div>
  );
}
