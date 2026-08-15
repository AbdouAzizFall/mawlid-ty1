import { createClient } from '@/lib/supabase/server'
import { SECTION_LABELS, type Section } from '@/lib/types'
import BarSplit from '@/components/dashboard/charts/BarSplit'
import DonutSplit from '@/components/dashboard/charts/DonutSplit'

function fcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}
function pct(n: number, total: number) {
  return total > 0 ? `${Math.round((n / total) * 100)}%` : '0%'
}

const GOLD_SHADES = ['#C89B3C', '#16213A', '#1F7A5C', '#B3463D']

export default async function StatistiquesPage() {
  const supabase = await createClient()

  const { data: participants } = await supabase
    .from('participants')
    .select('sexe, montant, section, category_id, participation_categories(label)')
    .is('deleted_at', null)

  const list = participants ?? []
  const total = list.length
  const totalMontant = list.reduce((s, p: any) => s + Number(p.montant), 0)
  const moyenne = total > 0 ? totalMontant / total : 0

  const hommes = list.filter((p: any) => p.sexe === 'homme')
  const femmes = list.filter((p: any) => p.sexe === 'femme')
  const nonRenseigne = list.filter((p: any) => p.sexe === 'non_renseigne')

  const sexeData = [
    { label: 'Hommes', value: hommes.length },
    { label: 'Femmes', value: femmes.length },
    ...(nonRenseigne.length > 0 ? [{ label: 'N/A', value: nonRenseigne.length }] : []),
  ]

  const sectionData = (Object.keys(SECTION_LABELS) as Section[]).map((s) => ({
    label: SECTION_LABELS[s].split(' — ')[0],
    value: list.filter((p: any) => p.section === s).length,
  }))

  const byCategory: Record<string, { label: string; count: number; montant: number }> = {}
  for (const p of list as any[]) {
    const label = p.participation_categories?.label ?? 'Sans catégorie'
    if (!byCategory[label]) byCategory[label] = { label, count: 0, montant: 0 }
    byCategory[label].count += 1
    byCategory[label].montant += Number(p.montant)
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Statistiques</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
          <p className="text-xs text-inkmuted dark:text-white/50">Total participants</p>
          <p className="font-display text-xl font-semibold text-ink dark:text-white">{total}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
          <p className="text-xs text-inkmuted dark:text-white/50">Montant moyen</p>
          <p className="font-display text-xl font-semibold text-ink dark:text-white">{fcfa(Math.round(moyenne))}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <p className="mb-1 text-sm font-medium text-ink dark:text-white">Répartition par section</p>
        <BarSplit data={sectionData} colors={GOLD_SHADES} />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <p className="mb-1 text-sm font-medium text-ink dark:text-white">Répartition par sexe</p>
        <DonutSplit data={sexeData} colors={GOLD_SHADES} />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <p className="mb-2 text-sm font-medium text-ink dark:text-white">Par catégorie</p>
        <div className="space-y-3 text-sm">
          {Object.values(byCategory).map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between">
                <span className="text-ink dark:text-white">{c.label}</span>
                <span className="font-medium text-ink dark:text-white">{fcfa(c.montant)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-inkmuted dark:text-white/50">
                <span>{c.count} pers. ({pct(c.count, total)})</span>
                <span>{pct(c.montant, totalMontant)} du total</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
