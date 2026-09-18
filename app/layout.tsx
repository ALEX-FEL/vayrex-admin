import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vayrix — Ta course, ton prix, ton trajet',
  description: 'Vayrix connecte les Camerounais à des chauffeurs vérifiés. Négocie ton prix, suis ton trajet, paie en Mobile Money.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
