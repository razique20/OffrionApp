import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { UserRole } from '@/lib/constants';

// Routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/deals/public', // Example public deal listing
];

// Role-based route prefixes
const roleRoutes = {
  [UserRole.ADMIN]: '/api/admin',
  [UserRole.MERCHANT]: '/api/merchant',
  [UserRole.PARTNER]: '/api/partner',
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle Public Routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Handle Public API Routes (API Key Authentication — validated in each route handler)
  const isApiKeyRoute =
    (pathname.startsWith('/api/deals') ||
      pathname.startsWith('/api/categories') ||
      pathname.startsWith('/api/partners/track-')) &&
    request.headers.has('x-api-key');
  if (isApiKeyRoute) {
    return NextResponse.next();
  }

  // 3. Handle Dashboard/Internal API (JWT Authentication)
  const authHeader = request.headers.get('authorization');
  let token = authHeader?.split(' ')[1];

  // If no auth header, check for token cookie
  if (!token) {
    token = request.cookies.get('token')?.value;
  }

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 4. Role-based Access Control
  // Super Admin has bypass access to all dashboards
  if (decoded.role === UserRole.SUPER_ADMIN) {
    return NextResponse.next({
      request: {
        headers: new Headers({
          ...Object.fromEntries(request.headers),
          'x-user-id': decoded.userId,
          'x-user-role': decoded.role,
        }),
      },
    });
  }

  if (pathname.startsWith('/api/admin') || pathname.startsWith('/admin')) {
    if (decoded.role !== UserRole.ADMIN) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/auth/login?error=admin_required', request.url));
    }
  }

  if (pathname.startsWith('/api/merchant') || pathname.startsWith('/merchant')) {
    if (decoded.role !== UserRole.MERCHANT) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden: Merchant access required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/auth/login?error=merchant_required', request.url));
    }
  }

  if (pathname.startsWith('/api/partner') || pathname.startsWith('/partner')) {
    if (decoded.role !== UserRole.PARTNER) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden: Partner access required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/auth/login?error=partner_required', request.url));
    }
  }

  // Inject user info into headers for downstream routes (optional but helpful)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', decoded.userId);
  requestHeaders.set('x-user-role', decoded.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/merchant/:path*',
    '/api/partner/:path*',
    '/api/auth/me',
    '/api/auth/profile/:path*',
    '/api/billing/:path*',
    '/admin/:path*',
    '/merchant/:path*',
    '/partner/:path*',
  ],
};
