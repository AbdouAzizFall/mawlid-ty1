'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function ArchMotif() {
  return (
    <svg viewBox="0 0 200 120" className="mx-auto h-24 w-40" fill="none">
      <path
        d="M20 120 V60 C20 27 56 4 100 4 C144 4 180 27 180 60 V120"
        stroke="#C89B3C"
        strokeWidth="1.5"
      />
      <path
        d="M40 120 V64 C40 40 66 22 100 22 C134 22 160 40 160 64 V120"
        stroke="#C89B3C"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="100" cy="46" r="3" fill="#C89B3C" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupDone, setSignupDone] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleForgotPassword() {
    if (!email) {
      setError('Renseigne ton email ci-dessus, puis clique à nouveau sur "Mot de passe oublié".')
      return
    }
    setError(null)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setResetSent(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) {
        setError(
          error.message.toLowerCase().includes('confirm')
            ? "Ton email n'est pas encore confirmé — vérifie ta boîte mail."
            : 'Email ou mot de passe incorrect.'
        )
        return
      }
      router.push('/dashboard')
      router.refresh()
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
      setSignupDone(true)
    }
  }

  if (signupDone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-inkdark px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-surfacedark p-7 text-center shadow-soft">
          <ArchMotif />
          <h1 className="mt-2 font-display text-xl font-semibold text-ink dark:text-white">Compte créé</h1>
          <p className="mt-2 text-sm leading-relaxed text-inkmuted dark:text-white/50">
            Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.
            Un administrateur devra ensuite valider ton accès.
          </p>
          <button
            onClick={() => { setSignupDone(false); setMode('login') }}
            className="mt-6 w-full rounded-xl bg-ink py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper dark:bg-inkdark px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <ArchMotif />
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink dark:text-white">Mawlid</h1>
          <p className="text-sm text-inkmuted dark:text-white/50">Thiaroye Yeumbeul 1</p>
        </div>

        <div className="mb-5 flex rounded-xl bg-paperline/60 dark:bg-white/5 p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              mode === 'login' ? 'bg-white dark:bg-surfacedark text-ink dark:text-white shadow-soft' : 'text-inkmuted dark:text-white/50'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              mode === 'signup' ? 'bg-white dark:bg-surfacedark text-ink dark:text-white shadow-soft' : 'text-inkmuted dark:text-white/50'
            }`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-white dark:bg-surfacedark p-5 shadow-soft">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/50">Nom complet</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-paperline dark:border-white/10 px-3 py-2.5 text-sm text-ink dark:text-white outline-none transition focus:border-gold"
                placeholder="Ton nom et prénom"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/50">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-paperline dark:border-white/10 px-3 py-2.5 text-sm text-ink dark:text-white outline-none transition focus:border-gold"
              placeholder="toi@exemple.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/50">Mot de passe</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-paperline dark:border-white/10 px-3 py-2.5 text-sm text-ink dark:text-white outline-none transition focus:border-gold"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-spend/10 px-3 py-2 text-xs text-spend">{error}</p>
          )}
          {resetSent && (
            <p className="rounded-lg bg-money/10 px-3 py-2 text-xs text-money">
              Email envoyé, si un compte existe avec cette adresse. Vérifie ta boîte mail.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-ink py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:opacity-50 dark:bg-gold dark:text-ink"
          >
            {loading ? 'Patiente...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>

          {mode === 'login' && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full text-center text-xs text-inkmuted dark:text-white/50"
            >
              Mot de passe oublié ?
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
