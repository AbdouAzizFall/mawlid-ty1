import Link from 'next/link'

export default function FinancesPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Finances</h1>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/finances/recettes" className="rounded-2xl bg-white dark:bg-surfacedark p-4 shadow-soft">
          <p className="text-2xl">💰</p>
          <p className="mt-2 text-sm font-medium">Recettes</p>
        </Link>
        <Link href="/dashboard/finances/depenses" className="rounded-2xl bg-white dark:bg-surfacedark p-4 shadow-soft">
          <p className="text-2xl">🧾</p>
          <p className="mt-2 text-sm font-medium">Dépenses</p>
        </Link>
      </div>
    </div>
  )
}
