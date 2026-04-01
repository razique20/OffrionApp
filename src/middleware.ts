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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle Public Routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Handle Partner API Routes (API Key Authentication)
  if (pathname.startsWith('/api/deals') && request.headers.has('x-api-key')) {
    // In a real middleware, we might want to verify the API key here
    // But since middleware doesn't have easy access to DB in some environments (Edge),
    // we might do it in the API route or use a high-performance cache (Redis).
    // For simplicity in this demo, we'll let the API route handle API key validation
    // or assume it's valid if it passes basic checks if we were using Edge.
    // However, Next.js Node.js middleware CAN access DB if configured correctly.
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
  if (pathname.startsWith('/api/admin') && decoded.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  if (pathname.startsWith('/api/merchant') && decoded.role !== UserRole.MERCHANT) {
    return NextResponse.json({ error: 'Forbidden: Merchant access required' }, { status: 403 });
  }

  if (pathname.startsWith('/api/partner') && decoded.role !== UserRole.PARTNER) {
    return NextResponse.json({ error: 'Forbidden: Partner access required' }, { status: 403 });
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
    '/admin/:path*',
    '/merchant/:path*',
    '/partner/:path*',
  ],
};
