import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isPendingRoute = request.nextUrl.pathname.startsWith('/en-attente')

  // Pas connecté et essaie d'accéder à une page protégée -> login
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Connecté et essaie d'aller sur /login -> dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Connecté mais compte pas encore approuvé -> page d'attente uniquement
  if (user && !isAuthRoute && !isPendingRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_approved, is_active')
      .eq('id', user.id)
      .single()

    if (!profile?.is_approved || !profile?.is_active) {
      const url = request.nextUrl.clone()
      url.pathname = '/en-attente'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)',
  ],
}
