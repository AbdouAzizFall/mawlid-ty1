import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SECTION_LABELS, type Section } from '@/lib/types'

function fcfa(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export default async function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sexe?: string; section?: string }>
}) {
  const { q, sexe, section } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('participants')
    .select('*, participation_categories(label)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (q) query = query.or(`prenom.ilike.%${q}%,nom.ilike.%${q}%,telephone.ilike.%${q}%`)
  if (sexe) query = query.eq('sexe', sexe)
  if (section) query = query.eq('section', section)

  const { data: participants } = await query.limit(100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Participants</h1>
        <Link href="/dashboard/participants/nouveau" className="text-sm font-medium text-gold">
          + Ajouter
        </Link>
      </div>

      <form className="space-y-2" action="/dashboard/participants">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher (nom, prénom, téléphone)"
          className="w-full rounded-xl border border-paperline bg-white px-3 py-2.5 text-sm outline-none focus:border-gold dark:border-white/10 dark:bg-surfacedark"
        />
        <div className="flex gap-2">
          <select name="sexe" defaultValue={sexe ?? ''} className="flex-1 rounded-xl border border-paperline bg-white px-2 py-2 text-xs dark:border-white/10 dark:bg-surfacedark">
            <option value="">Tous sexes</option>
            <option value="homme">Hommes</option>
            <option value="femme">Femmes</option>
          </select>
          <select name="section" defaultValue={section ?? ''} className="flex-1 rounded-xl border border-paperline bg-white px-2 py-2 text-xs dark:border-white/10 dark:bg-surfacedark">
            <option value="">Toutes sections</option>
            {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
              <option key={s} value={s}>{SECTION_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <button className="w-full rounded-xl bg-paperline/60 py-2 text-xs font-medium text-inkmuted dark:bg-white/5 dark:text-white/60">
          Filtrer
        </button>
      </form>

      <div className="space-y-2">
        {(!participants || participants.length === 0) && (
          <p className="py-8 text-center text-sm text-inkmuted dark:text-white/50">Aucun participant trouvé</p>
        )}
        {participants?.map((p: any) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-soft dark:bg-surfacedark"
          >
            <div>
              <p className="text-sm font-medium text-ink dark:text-white">{p.prenom} {p.nom}</p>
              <p className="text-xs text-inkmuted dark:text-white/50">
                {p.participation_categories?.label}
                {p.section ? ` · ${SECTION_LABELS[p.section as Section]?.split(' — ')[0]}` : ''}
                {' · '}{p.telephone || 'sans téléphone'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-money">{fcfa(Number(p.montant))}</p>
              <Link href={`/dashboard/participants/${p.id}/modifier`} className="text-sm text-inkmuted dark:text-white/50">
                ✏️
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
