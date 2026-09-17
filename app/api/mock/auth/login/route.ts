import { NextResponse } from 'next/server';

/**
 * Mock auth endpoint.
 *
 * TODO: Replace with real NestJS auth endpoint.
 * In production:
 *   1. Validate credentials server-side (bcrypt + JWT).
 *   2. Set an httpOnly, Secure, SameSite=Strict cookie on the response.
 *   3. Do NOT return the token in the JSON body for client storage.
 *   4. The frontend should call this endpoint with `credentials: 'include'`.
 *
 * For now, this mock accepts:
 *   email: admin@vayrix.cm
 *   password: vayrix2025
 */

const VALID_EMAIL = 'admin@vayrix.cm';
const VALID_PASSWORD = 'vayrix2025';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    return NextResponse.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: { id: 'u-1', email, name: 'Admin', role: 'ADMIN' },
    });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
