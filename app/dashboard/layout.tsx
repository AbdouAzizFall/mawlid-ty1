import { getCurrentProfile } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MobileNav from '@/components/dashboard/MobileNav'
import ThemeToggle from '@/components/dashboard/ThemeToggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getCurrentProfile()
  if (!user) redirect('/login')

  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-30 border-b border-paperline dark:border-white/10 bg-paper/90 dark:bg-inkdark/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="font-display text-base font-semibold text-ink dark:text-white">Mawlid — Thiaroye Yeumbeul 1</p>
            <p className="text-xs text-inkmuted dark:text-white/50">{profile?.full_name}</p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/dashboard/parametres"
              className="rounded-lg px-2 py-1 text-sm text-inkmuted dark:text-white/50 transition hover:text-ink dark:text-white"
            >
              ⚙️
            </Link>
            <form action={handleLogout}>
              <button className="rounded-lg px-2 py-1 text-sm text-inkmuted dark:text-white/50 transition hover:text-ink dark:text-white">↩︎</button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4">{children}</main>

      <Link
        href="/dashboard/participants/nouveau"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-white shadow-soft transition hover:bg-gold/90"
      >
        +
      </Link>

      <MobileNav />
    </div>
  )
}
