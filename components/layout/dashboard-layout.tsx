'use client';

import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Sidebar } from './sidebar';
import { Header } from './header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="mt-[60px] min-h-[calc(100vh-60px)] lg:ml-60">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
