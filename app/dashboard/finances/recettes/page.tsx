import { createClient } from '@/lib/supabase/server'

function fcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export default async function RecettesPage() {
  const supabase = await createClient()
  const { data: revenues } = await supabase
    .from('revenues')
    .select('*, revenue_categories(label)')
    .is('deleted_at', null)
    .order('date', { ascending: false })

  const total = (revenues ?? []).reduce((s, r) => s + Number(r.montant), 0)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Recettes</h1>
        <p className="text-sm text-money">Total : {fcfa(total)}</p>
        <p className="mt-1 text-xs text-inkmuted dark:text-white/50">
          Les participations sont ajoutées automatiquement ici dès qu'un participant est inscrit.
        </p>
      </div>

      <div className="space-y-2">
        {(!revenues || revenues.length === 0) && (
          <p className="py-8 text-center text-sm text-inkmuted dark:text-white/50">Aucune recette pour l'instant</p>
        )}
        {revenues?.map((r: any) => (
          <div key={r.id} className="flex items-center justify-between rounded-2xl bg-white dark:bg-surfacedark p-3 shadow-soft">
            <div>
              <p className="text-sm font-medium">{r.source}</p>
              <p className="text-xs text-inkmuted dark:text-white/50">
                {r.revenue_categories?.label} · {new Date(r.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <p className="text-sm font-semibold text-money">{fcfa(Number(r.montant))}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
