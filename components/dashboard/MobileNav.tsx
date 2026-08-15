'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/dashboard', label: 'Accueil', icon: '🏠' },
  { href: '/dashboard/participants', label: 'Participants', icon: '👥' },
  { href: '/dashboard/finances', label: 'Finances', icon: '💰' },
  { href: '/dashboard/statistiques', label: 'Stats', icon: '📊' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-paperline dark:border-white/10 bg-white/95 dark:bg-surfacedark/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-lg items-stretch">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs"
            >
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold" />}
              <span className={`text-lg transition ${active ? '' : 'opacity-50 grayscale'}`}>{item.icon}</span>
              <span className={active ? 'font-medium text-ink dark:text-white' : 'text-inkmuted dark:text-white/50'}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
