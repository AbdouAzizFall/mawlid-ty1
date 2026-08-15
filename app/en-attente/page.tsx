import { getCurrentProfile } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function EnAttentePage() {
  const { profile } = await getCurrentProfile()

  // Si entre-temps le compte a été approuvé, on laisse passer
  if (profile?.is_approved && profile?.is_active) {
    redirect('/dashboard')
  }

  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-surfacedark p-6 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          ⏳
        </div>
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">En attente de validation</h1>
        <p className="mt-2 text-sm text-inkmuted dark:text-white/50">
          Ton compte a bien été créé. Un administrateur doit encore t'attribuer
          un accès avant que tu puisses utiliser l'application.
        </p>
        <form action={handleLogout}>
          <button className="mt-5 w-full rounded-xl border border-paperline dark:border-white/10 py-2.5 text-sm font-medium text-slate-700">
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  )
}
