'use client';

import { ThemeProvider } from 'next-themes';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="ml-60 mt-[60px] min-h-[calc(100vh-60px)]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
