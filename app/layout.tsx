import type { Metadata, Viewport } from 'next'
import { Domine, Manrope } from 'next/font/google'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased dark:bg-inkdark dark:text-white">
        {children}
      </body>
    </html>
  )
}
