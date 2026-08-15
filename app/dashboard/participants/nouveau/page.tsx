import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NouveauParticipantForm from './Form'

export default async function NouveauParticipantPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('participation_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  async function createParticipant(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { user } = await getCurrentProfile()

    const prenom = formData.get('prenom') as string
    const nom = formData.get('nom') as string
    const sexe = formData.get('sexe') as string
    const section = formData.get('section') as string
    const telephone = formData.get('telephone') as string
    const montant = Number(formData.get('montant'))
    const category_id = formData.get('category_id') as string
    const observation = formData.get('observation') as string

    const { error } = await supabase.from('participants').insert({
      prenom,
      nom,
      sexe: sexe || 'non_renseigne',
      section: section || null,
      telephone: telephone || null,
      montant,
      category_id,
      observation: observation || null,
      created_by: user?.id,
    })

    if (error) {
      redirect(`/dashboard/participants/nouveau?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/dashboard/participants')
  }

  return (
    <NouveauParticipantForm categories={categories ?? []} createParticipant={createParticipant} />
  )
}
