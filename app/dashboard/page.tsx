import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import BarSplit from '@/components/dashboard/charts/BarSplit'

function fcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ count: totalParticipants }, { count: hommes }, { count: femmes }] = await Promise.all([
    supabase.from('participants').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('participants').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('sexe', 'homme'),
    supabase.from('participants').select('*', { count: 'exact', head: true }).is('deleted_at', null).eq('sexe', 'femme'),
  ])

  const { data: revenues } = await supabase.from('revenues').select('montant').is('deleted_at', null)
  const { data: expenses } = await supabase.from('expenses').select('montant').is('deleted_at', null)

  const totalRecettes = (revenues ?? []).reduce((s, r) => s + Number(r.montant), 0)
  const totalDepenses = (expenses ?? []).reduce((s, e) => s + Number(e.montant), 0)
  const solde = totalRecettes - totalDepenses

  const { data: derniersParticipants } = await supabase
    .from('participants')
    .select('id, prenom, nom, montant, registered_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink dark:text-white">Tableau de bord</h1>
        <p className="text-sm text-inkmuted dark:text-white/50">Vue d'ensemble en temps réel</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
          <p className="text-xs text-inkmuted dark:text-white/50">Participants</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink dark:text-white">{totalParticipants ?? 0}</p>
          <p className="mt-1 text-xs text-inkmuted dark:text-white/50">{hommes ?? 0} H · {femmes ?? 0} F</p>
        </div>
        <div className="rounded-2xl bg-ink p-4 shadow-soft dark:bg-white/5">
          <p className="text-xs text-white/60">Solde disponible</p>
          <p className={`mt-1 font-display text-2xl font-semibold ${solde < 0 ? 'text-spend' : 'text-gold'}`}>
            {fcfa(solde)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <p className="mb-1 text-sm font-medium text-ink dark:text-white">Recettes vs dépenses</p>
        <BarSplit
          data={[
            { label: 'Recettes', value: totalRecettes },
            { label: 'Dépenses', value: totalDepenses },
          ]}
          colors={['#1F7A5C', '#B3463D']}
        />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink dark:text-white">Dernières inscriptions</p>
          <Link href="/dashboard/participants" className="text-xs text-inkmuted dark:text-white/50">Voir tout</Link>
        </div>
        {(!derniersParticipants || derniersParticipants.length === 0) ? (
          <p className="py-6 text-center text-xs text-inkmuted dark:text-white/50">Aucune inscription pour l'instant</p>
        ) : (
          <ul className="divide-y divide-paperline dark:divide-white/10">
            {derniersParticipants.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm text-ink dark:text-white">
                <span>{p.prenom} {p.nom}</span>
                <span className="text-inkmuted dark:text-white/50">{fcfa(Number(p.montant))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
