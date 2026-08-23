import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function fcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export default async function DepensesPage() {
  const supabase = await createClient()
  const { data: expenses } = await supabase
    .from('expenses')
    .select('id, description, montant, date')
    .is('deleted_at', null)
    .order('date', { ascending: false })

  const total = (expenses ?? []).reduce((s, e) => s + Number(e.montant), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Dépenses</h1>
          <p className="text-sm text-spend">Total : {fcfa(total)}</p>
        </div>
        <Link href="/dashboard/finances/depenses/nouveau" className="text-sm font-medium text-gold">
          + Ajouter
        </Link>
      </div>

      <div className="space-y-2">
        {(!expenses || expenses.length === 0) && (
          <p className="py-8 text-center text-sm text-inkmuted dark:text-white/50">Aucune dépense pour l'instant</p>
        )}
        {expenses?.map((e: any) => (
          <div key={e.id} className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-soft dark:bg-surfacedark">
            <div>
              <p className="text-sm font-medium text-ink dark:text-white">{e.description}</p>
              <p className="text-xs text-inkmuted dark:text-white/50">{new Date(e.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-spend">{fcfa(Number(e.montant))}</p>
              <Link href={`/dashboard/finances/depenses/${e.id}/modifier`} className="text-sm text-inkmuted dark:text-white/50">
                ✏️
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
