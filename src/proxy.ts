import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { UserRole } from '@/lib/constants';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize the ratelimiter only if we have proper tokens
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;

let ratelimit: Ratelimit | null = null;
if (redisToken && redisUrl && redisToken !== 'your-upstash-token-here') {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(50, '10 s'),
    analytics: true,
  });
}

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/api/auth/login',
  '/api/auth/register',
  '/api/deals/public',
  '/api/webhooks',
  '/docs',
];

// Role-based route prefixes
const roleRoutes = {
  [UserRole.ADMIN]: '/api/admin',
  [UserRole.MERCHANT]: '/api/merchant',
  [UserRole.PARTNER]: '/api/partner',
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate Limiting Logic (skip for webhooks)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/webhooks')) {
    if (ratelimit) {
      const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1';
      try {
        const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);
        if (!success) {
          return NextResponse.json(
            { error: 'Too Many Requests' },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
              },
            }
          );
        }
      } catch (error) {
        console.error('Rate Limiter Error:', error);
      }
    }
  }

  // 1. Handle Public Routes
  const isPublicRoute = publicRoutes.some(route => 
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );

  if (isPublicRoute) {
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
  const userRoles = decoded.roles || (decoded.role ? [decoded.role] : []);
  const isSuperAdmin = userRoles.includes(UserRole.SUPER_ADMIN);

  // Super Admin has bypass access to all dashboards
  if (isSuperAdmin) {
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
    if (!userRoles.includes(UserRole.ADMIN)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/auth/login?error=admin_required', request.url));
    }
  }

  if (pathname.startsWith('/api/merchant') || pathname.startsWith('/merchant')) {
    if (!userRoles.includes(UserRole.MERCHANT)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden: Merchant access required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/auth/login?error=merchant_required', request.url));
    }
  }

  if (pathname.startsWith('/api/partner') || pathname.startsWith('/partner')) {
    if (!userRoles.includes(UserRole.PARTNER)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden: Partner access required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/auth/login?error=partner_required', request.url));
    }
  }

  // Inject user info into headers for downstream routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', decoded.userId);
  requestHeaders.set('x-user-role', decoded.role);
  requestHeaders.set('x-user-roles', JSON.stringify(userRoles));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/merchant/:path*',
    '/partner/:path*',
  ],
};
