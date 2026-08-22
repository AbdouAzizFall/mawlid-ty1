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
    .select('id, prenom, nom, sexe, montant, section, participation_categories(label, is_special)')
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

  // Séparation nette : Participation (montant standard) vs Autre participation
  const simple = list.filter((p: any) => p.participation_categories?.is_special === false)
  const autres = list.filter((p: any) => p.participation_categories?.is_special === true)

  const simpleTotal = simple.reduce((s, p: any) => s + Number(p.montant), 0)
  const autresTotal = autres.reduce((s, p: any) => s + Number(p.montant), 0)

  const simpleByMontant: Record<number, number> = {}
  for (const p of simple as any[]) {
    const m = Number(p.montant)
    simpleByMontant[m] = (simpleByMontant[m] ?? 0) + 1
  }
  const simpleMontantRows = Object.entries(simpleByMontant)
    .map(([montant, count]) => ({ montant: Number(montant), count }))
    .sort((a, b) => b.montant - a.montant)

  const autresList = [...(autres as any[])].sort((a, b) => Number(b.montant) - Number(a.montant))

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

      {/* Participation (montants standards) */}
      <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink dark:text-white">Participation</p>
          <p className="font-display text-sm font-semibold text-money">{fcfa(simpleTotal)}</p>
        </div>
        <p className="mb-3 text-xs text-inkmuted dark:text-white/50">
          {simple.length} personne{simple.length > 1 ? 's' : ''} ({pct(simple.length, total)})
        </p>

        {simpleMontantRows.length === 0 ? (
          <p className="py-2 text-center text-xs text-inkmuted dark:text-white/50">Aucune donnée</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {simpleMontantRows.map((r) => (
              <div
                key={r.montant}
                className="flex items-center gap-1.5 rounded-full border border-paperline bg-paper px-2.5 py-1 text-xs dark:border-white/10 dark:bg-white/5"
              >
                <span className="font-medium text-ink dark:text-white">{fcfa(r.montant)}</span>
                <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold text-gold">
                  ×{r.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Autres participations (montants libres, nominatif) */}
      <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink dark:text-white">Autres participations</p>
          <p className="font-display text-sm font-semibold text-money">{fcfa(autresTotal)}</p>
        </div>
        <p className="mb-3 text-xs text-inkmuted dark:text-white/50">
          {autres.length} personne{autres.length > 1 ? 's' : ''} ({pct(autres.length, total)})
        </p>

        {autresList.length === 0 ? (
          <p className="py-4 text-center text-xs text-inkmuted dark:text-white/50">Aucune autre participation</p>
        ) : (
          <ul className="divide-y divide-paperline dark:divide-white/10">
            {autresList.map((p: any) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-ink dark:text-white">{p.prenom} {p.nom}</span>
                <span className="font-medium text-money">{fcfa(Number(p.montant))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl bg-ink p-4 shadow-soft dark:bg-white/5">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold text-white">Total général</span>
          <div className="text-right">
            <p className="font-display text-sm font-semibold text-gold">{fcfa(totalMontant)}</p>
            <p className="text-xs text-white/60">{total} participant{total > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
