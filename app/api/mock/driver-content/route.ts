import { NextResponse } from 'next/server';
import fr from '@/lib/i18n/fr.json';
import en from '@/lib/i18n/en.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'fr';
  const dict = locale === 'en' ? en : fr;

  const content = {
    hero: { title: dict.drivers.heroTitle, subtitle: dict.drivers.heroSubtitle },
    revenue: {
      title: dict.drivers.revenueTitle,
      subtitle: dict.drivers.revenueSubtitle,
      items: dict.drivers.revenueItems,
    },
    requirements: {
      title: dict.drivers.requirementsTitle,
      subtitle: dict.drivers.requirementsSubtitle,
      items: dict.drivers.requirements,
    },
    steps: {
      title: dict.drivers.stepsTitle,
      subtitle: dict.drivers.stepsSubtitle,
      items: dict.drivers.steps,
    },
    cta: {
      title: dict.drivers.ctaTitle,
      subtitle: dict.drivers.ctaSubtitle,
      button: dict.drivers.ctaButton,
    },
  };

  return NextResponse.json(content);
}
