import { createClient, getCurrentProfile } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ParametresPage() {
  const { profile } = await getCurrentProfile()
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  async function updateProfile(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const id = formData.get('id') as string
    const role = formData.get('role') as string
    const is_approved = formData.get('is_approved') === 'on'
    const is_active = formData.get('is_active') === 'on'

    await supabase.from('profiles').update({ role, is_approved, is_active }).eq('id', id)
    redirect('/dashboard/parametres')
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="rounded-2xl bg-white dark:bg-surfacedark p-4 text-sm text-inkmuted dark:text-white/50 shadow-soft">
        Seul un administrateur peut accéder aux paramètres.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Paramètres — Membres</h1>
      <p className="text-xs text-inkmuted dark:text-white/50">
        Valide les nouveaux comptes et attribue leur rôle. Un compte non approuvé ne peut rien faire dans l'application.
      </p>

      <div className="space-y-3">
        {profiles?.map((p) => (
          <form key={p.id} action={updateProfile} className="space-y-2 rounded-2xl bg-white dark:bg-surfacedark p-4 shadow-soft">
            <input type="hidden" name="id" value={p.id} />
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{p.full_name}</p>
              {!p.is_approved && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">En attente</span>}
            </div>
            <select name="role" defaultValue={p.role} className="w-full rounded-xl border border-paperline dark:border-white/10 px-3 py-2 text-sm">
              <option value="admin">Administrateur</option>
              <option value="gestionnaire_inscriptions">Gestionnaire inscriptions</option>
              <option value="gestionnaire_finances">Gestionnaire finances</option>
            </select>
            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-1.5">
                <input type="checkbox" name="is_approved" defaultChecked={p.is_approved} /> Approuvé
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" name="is_active" defaultChecked={p.is_active} /> Actif
              </label>
            </div>
            <button type="submit" className="w-full rounded-xl bg-ink py-2 text-xs font-medium text-white">
              Enregistrer
            </button>
          </form>
        ))}
      </div>
    </div>
  )
}
