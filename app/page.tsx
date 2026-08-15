import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/supabase/server'

export default async function RootPage() {
  const { user } = await getCurrentProfile()
  redirect(user ? '/dashboard' : '/login')
}
