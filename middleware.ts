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

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/login')
  const isPendingRoute = pathname.startsWith('/en-attente')
  // Routes toujours accessibles, sans redirection ni vérification d'approbation :
  // /auth/callback échange le code AVANT qu'une session existe,
  // /reset-password doit rester atteignable même juste après connexion via le lien de récupération.
  const isPublicRoute = pathname.startsWith('/auth/callback') || pathname.startsWith('/reset-password')

  if (isPublicRoute) {
    return response
  }

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
