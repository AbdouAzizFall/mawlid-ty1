'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    // Cookie lu côté serveur : le thème reste correct même après un rechargement
    // complet de page (ex : après une redirection suite à un enregistrement).
    document.cookie = `theme=${next ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`
  }

  return (
    <button
      onClick={toggle}
      aria-label="Changer de thème"
      className="rounded-lg px-2 py-1 text-sm text-inkmuted transition hover:text-ink dark:text-white/60 dark:hover:text-white"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
