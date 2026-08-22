'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-inkdark px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-surfacedark p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-ink dark:text-white">Nouveau mot de passe</h1>

        {done ? (
          <p className="mt-3 text-sm text-money">Mot de passe mis à jour. Redirection...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full rounded-xl border border-paperline dark:border-white/10 px-3 py-2.5 text-sm text-ink dark:text-white outline-none focus:border-gold"
            />
            {error && <p className="rounded-lg bg-spend/10 px-3 py-2 text-xs text-spend">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-ink py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:opacity-50 dark:bg-gold dark:text-ink"
            >
              {loading ? 'Patiente...' : 'Enregistrer'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
