import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ✅ MIDDLEWARE RESTAURADO CON LÓGICA MEJORADA
  console.log('🔍 Middleware ejecutándose para:', request.nextUrl.pathname);
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/api/auth', '/', '/menu', '/cart', '/checkout']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/')
  )

  if (isPublicRoute) {
    console.log('✅ Ruta pública permitida:', request.nextUrl.pathname);
    return supabaseResponse
  }

  // Verificar sesión para rutas protegidas
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('🔐 Verificando sesión para ruta protegida:', request.nextUrl.pathname);
  console.log('👤 Sesión encontrada:', session ? `${session.user?.email}` : 'No hay sesión');

  // Si no hay sesión y está intentando acceder a rutas admin
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    console.log('❌ Sin sesión - Redirigiendo a /login');
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay sesión, permitir acceso
  if (session) {
    console.log('✅ Sesión válida - Permitiendo acceso');
  }

  return supabaseResponse
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