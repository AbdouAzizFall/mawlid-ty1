import { createClient, getCurrentProfile } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function NouvelleDepensePage() {
  async function createExpense(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { user } = await getCurrentProfile()

    const { error } = await supabase.from('expenses').insert({
      description: formData.get('description') as string,
      montant: Number(formData.get('montant')),
      date: (formData.get('date') as string) || new Date().toISOString().slice(0, 10),
      responsable_id: user?.id,
      created_by: user?.id,
    })

    if (error) redirect(`/dashboard/finances/depenses/nouveau?error=${encodeURIComponent(error.message)}`)
    redirect('/dashboard/finances/depenses')
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Nouvelle dépense</h1>
      <form action={createExpense} className="space-y-3 rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Libellé</label>
          <input name="description" required className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Montant (FCFA)</label>
          <input name="montant" type="number" required className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Date</label>
          <input name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)} className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10" />
        </div>
        <button type="submit" className="w-full rounded-xl bg-ink py-3 text-sm font-medium text-white transition hover:bg-ink/90 dark:bg-gold dark:text-ink dark:hover:bg-gold/90">
          Enregistrer
        </button>
      </form>
    </div>
  )
}
