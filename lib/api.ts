/**
 * Centralized API access layer.
 *
 * Today: fetches from mock routes under /api/mock/*.
 * Tomorrow: swap BASE_URL to your NestJS backend and remove the mock routes.
 * Components don't change — they already call these functions.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type Locale = 'fr' | 'en';

export interface SiteContent {
  hero: { badge: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string; stats: { value: string; label: string }[] };
  howItWorks: { title: string; subtitle: string; steps: { title: string; description: string }[] };
  features: { title: string; subtitle: string; items: { title: string; description: string }[] };
  cities: { title: string; subtitle: string; items: { name: string; status: string; description: string }[] };
  testimonials: { title: string; subtitle: string; items: { name: string; role: string; content: string; rating: number }[] };
  download: { title: string; subtitle: string; android: string; ios: string; qrText: string };
}

export interface DriverContent {
  hero: { title: string; subtitle: string };
  revenue: { title: string; subtitle: string; items: { label: string; value: string }[] };
  requirements: { title: string; subtitle: string; items: string[] };
  steps: { title: string; subtitle: string; items: { title: string; description: string }[] };
  cta: { title: string; subtitle: string; button: string };
}

export interface LoginResponse {
  token: string;
  user: { id: string; email: string; name: string; role: string };
}

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function getSiteContent(locale: Locale = 'fr'): Promise<SiteContent> {
  return fetchJSON<SiteContent>(`/api/mock/content?locale=${locale}`);
}

export function getDriverContent(locale: Locale = 'fr'): Promise<DriverContent> {
  return fetchJSON<DriverContent>(`/api/mock/driver-content?locale=${locale}`);
}

/**
 * Mock auth login.
 * TODO: Replace with real NestJS endpoint.
 * In production, the backend should set an httpOnly cookie (server-side)
 * rather than returning a token for client storage.
 */
export function login(email: string, password: string): Promise<LoginResponse> {
  return fetchJSON<LoginResponse>('/api/mock/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
