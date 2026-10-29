import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const instant = false

export default async function DashboardRedirectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  redirect('/teacher/dashboard')
}
