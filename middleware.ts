import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  console.log('🔍 Middleware executing for:', req.nextUrl.pathname);
  
  // Skip middleware for static files and API routes
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.includes('.')
  ) {
    console.log('⏭️ Skipping middleware for static/API route');
    return res;
  }

  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  console.log('🔄 Getting session...');
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  console.log('📋 Session status:', !!session);
  if (session) {
    console.log('👤 User email:', session.user.email);
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    console.log('🔐 Processing admin route protection');
    
    // Allow access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      console.log('🚪 Login page access');
      // Always allow access to login page without automatic redirection
      console.log('📝 Allowing access to login page');
      return res;
    }

    // For all other admin routes, require authentication and admin validation
    if (!session) {
      console.log('❌ No session, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    console.log('🔍 Validating admin user for protected route...');
    // Check if user has admin role by validating against admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .eq('is_active', true)
      .single();

    console.log('🔍 Admin validation result:', {
      hasAdminUser: !!adminUser,
      error: adminError?.message || 'No error',
      userEmail: session.user.email,
      pathname: req.nextUrl.pathname
    });

    if (adminError || !adminUser) {
      console.log('❌ Admin validation failed, redirecting to login');
      // Sign out the user if they're not a valid admin
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    console.log('✅ Admin validation successful, allowing access to:', req.nextUrl.pathname);
  }

  console.log('✅ Middleware completed successfully');
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};