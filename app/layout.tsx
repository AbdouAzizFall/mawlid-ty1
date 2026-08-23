import type { Metadata, Viewport } from 'next'
import { Domine, Manrope } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import ThemeScript from '@/components/ThemeScript'

const display = Domine({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] })
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Mawlid — Thiaroye Yeumbeul 1',
  description: 'Gestion du Mawlid — section Thiaroye Yeumbeul 1 (DMWM)',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16213A',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Thème lu directement côté serveur (cookie) : reste correct même après
  // une redirection ou un rechargement complet de page.
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value

  return (
    <html
      lang="fr"
      className={`${display.variable} ${sans.variable}${theme === 'dark' ? ' dark' : ''}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased dark:bg-inkdark dark:text-white">
        {children}
      </body>
    </html>
  )
}
