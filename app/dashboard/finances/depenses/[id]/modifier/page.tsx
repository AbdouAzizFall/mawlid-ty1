import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DeleteButton from '@/components/dashboard/DeleteButton'

export default async function ModifierDepensePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: expense } = await supabase.from('expenses').select('*').eq('id', id).single()

  if (!expense) redirect('/dashboard/finances/depenses')

  async function updateExpense(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    const { error } = await supabase
      .from('expenses')
      .update({
        description: formData.get('description'),
        montant: Number(formData.get('montant')),
        date: formData.get('date'),
      })
      .eq('id', id)

    if (error) redirect(`/dashboard/finances/depenses/${id}/modifier?error=${encodeURIComponent(error.message)}`)
    redirect('/dashboard/finances/depenses')
  }

  async function deleteExpense(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    await supabase.from('expenses').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    redirect('/dashboard/finances/depenses')
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Modifier la dépense</h1>

      <form action={updateExpense} className="space-y-3 rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <input type="hidden" name="id" value={expense.id} />
        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Libellé</label>
          <input name="description" defaultValue={expense.description} required className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10 text-ink dark:text-white" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Montant (FCFA)</label>
          <input name="montant" type="number" required defaultValue={expense.montant} className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10 text-ink dark:text-white" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Date</label>
          <input name="date" type="date" defaultValue={expense.date} className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10 text-ink dark:text-white" />
        </div>
        <button type="submit" className="w-full rounded-xl bg-ink py-3 text-sm font-medium text-white transition hover:bg-ink/90 dark:bg-gold dark:text-ink dark:hover:bg-gold/90">
          Enregistrer les modifications
        </button>
      </form>

      <DeleteButton action={deleteExpense} id={expense.id} label="Supprimer cette dépense" />
    </div>
  )
}
