import type { Metadata } from 'next';
import { PublicLayout } from '@/components/public/public-layout';
import { VayrixLanding } from '@/components/public/vayrix-landing';

export const metadata: Metadata = {
  title: 'VAYRIX — Smart mobility platform',
  description:
    'Technology-driven mobility services. Move smarter with real-time tracking, verified drivers, and flexible payments.',
};

export default function HomePage() {
  return (
    <PublicLayout>
      <VayrixLanding />
    </PublicLayout>
  );
}
