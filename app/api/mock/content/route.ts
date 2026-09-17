import { NextResponse } from 'next/server';
import fr from '@/lib/i18n/fr.json';
import en from '@/lib/i18n/en.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') === 'en' ? 'en' : 'fr';
  const dict = locale === 'en' ? en : fr;

  const content = {
    hero: {
      badge: dict.hero.badge,
      title: dict.hero.title,
      subtitle: dict.hero.subtitle,
      ctaPrimary: dict.hero.ctaPrimary,
      ctaSecondary: dict.hero.ctaSecondary,
      stats: [
        { value: '12K+', label: dict.hero.stat1 },
        { value: '450+', label: dict.hero.stat2 },
        { value: '2', label: dict.hero.stat3 },
      ],
    },
    howItWorks: dict.howItWorks,
    features: dict.features,
    cities: dict.cities,
    testimonials: dict.testimonials,
    download: dict.download,
  };

  return NextResponse.json(content);
}
