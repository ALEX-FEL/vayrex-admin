'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '@/lib/api';
import { useTranslations } from '@/lib/i18n/use-translations';

export default function AdminLoginPage() {
  const { t } = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      /**
       * MOCK AUTH — calls /api/mock/auth/login
       *
       * TODO: Replace with real NestJS auth endpoint.
       * In production:
       *   - The backend should validate credentials and set an httpOnly
       *     cookie (Secure, SameSite=Strict) on the response.
       *   - Do NOT store the JWT in localStorage (XSS risk).
       *   - Call this endpoint with `credentials: 'include'`.
       *   - The `login()` function in lib/api.ts is the single place to update.
       */
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('401') || msg.includes('Invalid')) {
        setError(t('admin.errorInvalid'));
      } else {
        setError(t('admin.errorGeneric'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-bg px-4">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-brand-blue/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-purple/10 blur-[100px]" />

      {/* back link */}
      <Link
        href="/"
        className="absolute left-4 top-4 flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('admin.backToSite')}
      </Link>

      <div className="relative w-full max-w-md">
        {/* logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/30">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 8H5.6L4.5 11.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2" />
              <circle cx="7.5" cy="17.5" r="2.5" />
              <circle cx="16.5" cy="17.5" r="2.5" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{t('admin.title')}</h1>
            <p className="mt-1 text-sm text-white/40">{t('admin.subtitle')}</p>
          </div>
        </div>

        {/* form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/5 bg-brand-surface p-6 shadow-xl sm:p-8"
        >
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* email */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-white/70">
              {t('admin.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.emailPlaceholder')}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-brand-bg py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
            </div>
          </div>

          {/* password */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-white/70">
              {t('admin.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.passwordPlaceholder')}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-brand-bg py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/30 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-blue to-brand-purple py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? t('admin.loading') : t('admin.submit')}
          </button>

          {/* demo hint */}
          <p className="mt-4 text-center text-xs text-white/30">
            {t('admin.demoHint')}
          </p>
        </form>
      </div>
    </div>
  );
}
