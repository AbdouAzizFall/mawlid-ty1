import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SECTION_LABELS, type Section } from '@/lib/types'
import DeleteButton from '@/components/dashboard/DeleteButton'

export default async function ModifierParticipantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: participant } = await supabase.from('participants').select('*').eq('id', id).single()
  const { data: categories } = await supabase
    .from('participation_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (!participant) redirect('/dashboard/participants')

  async function updateParticipant(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    const { error } = await supabase
      .from('participants')
      .update({
        prenom: formData.get('prenom'),
        nom: formData.get('nom'),
        sexe: (formData.get('sexe') as string) || 'non_renseigne',
        section: (formData.get('section') as string) || null,
        telephone: (formData.get('telephone') as string) || null,
        montant: Number(formData.get('montant')),
        category_id: formData.get('category_id'),
        observation: (formData.get('observation') as string) || null,
      })
      .eq('id', id)

    if (error) redirect(`/dashboard/participants/${id}/modifier?error=${encodeURIComponent(error.message)}`)
    redirect('/dashboard/participants')
  }

  async function deleteParticipant(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    await supabase.from('participants').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    redirect('/dashboard/participants')
  }

  const defaultCategory = categories?.find((c) => !c.is_special)
  const autreCategory = categories?.find((c) => c.is_special)

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Modifier le participant</h1>

      <form action={updateParticipant} className="space-y-4 rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <input type="hidden" name="id" value={participant.id} />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Prénom</label>
            <input name="prenom" defaultValue={participant.prenom} required className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10 text-ink dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Nom</label>
            <input name="nom" defaultValue={participant.nom} required className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10 text-ink dark:text-white" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Sexe</label>
          <div className="flex gap-2">
            {[['homme', 'Homme'], ['femme', 'Femme']].map(([v, l]) => (
              <label key={v} className="flex flex-1 items-center justify-center rounded-xl border border-paperline py-2 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white dark:border-white/10 dark:has-[:checked]:border-gold dark:has-[:checked]:bg-gold dark:has-[:checked]:text-ink">
                <input type="radio" name="sexe" value={v} className="sr-only" defaultChecked={participant.sexe === v} />
                {l}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Section</label>
          <div className="space-y-2">
            {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
              <label key={s} className="flex items-center gap-2 rounded-xl border border-paperline px-3 py-2.5 text-sm has-[:checked]:border-gold has-[:checked]:bg-gold/10 dark:border-white/10">
                <input type="radio" name="section" value={s} defaultChecked={participant.section === s} className="accent-gold" />
                {SECTION_LABELS[s]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Téléphone</label>
          <input name="telephone" type="tel" defaultValue={participant.telephone ?? ''} className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10 text-ink dark:text-white" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Montant (FCFA)</label>
          <input name="montant" type="number" required defaultValue={participant.montant} className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10 text-ink dark:text-white" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Catégorie</label>
          <div className="flex gap-2">
            {defaultCategory && (
              <label className="flex flex-1 items-center justify-center rounded-xl border border-paperline py-2.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white dark:border-white/10 dark:has-[:checked]:border-gold dark:has-[:checked]:bg-gold dark:has-[:checked]:text-ink">
                <input type="radio" name="category_id" value={defaultCategory.id} defaultChecked={participant.category_id === defaultCategory.id} className="sr-only" />
                Participation
              </label>
            )}
            {autreCategory && (
              <label className="flex flex-1 items-center justify-center rounded-xl border border-paperline py-2.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white dark:border-white/10 dark:has-[:checked]:border-gold dark:has-[:checked]:bg-gold dark:has-[:checked]:text-ink">
                <input type="radio" name="category_id" value={autreCategory.id} defaultChecked={participant.category_id === autreCategory.id} className="sr-only" />
                Autre
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Observation</label>
          <textarea name="observation" rows={2} defaultValue={participant.observation ?? ''} className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10 text-ink dark:text-white" />
        </div>

        <button type="submit" className="w-full rounded-xl bg-ink py-3 text-sm font-medium text-white transition hover:bg-ink/90 dark:bg-gold dark:text-ink dark:hover:bg-gold/90">
          Enregistrer les modifications
        </button>
      </form>

      <DeleteButton action={deleteParticipant} id={participant.id} label="Supprimer ce participant" />
    </div>
  )
}
