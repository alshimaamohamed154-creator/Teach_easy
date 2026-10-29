'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// بترجم رسائل Supabase الإنجليزية لرسايل عربي بسيطة يفهمها المستخدم
function toFriendlyAuthMessage(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'الإيميل أو كلمة السر مش صحيحة، جرّب تاني.'
  if (m.includes('email not confirmed')) return 'لازم تأكد إيميلك الأول من الرسالة اللي وصلتك.'
  if (m.includes('user already registered') || m.includes('already registered')) return 'الإيميل ده عنده حساب فعلاً، جرّب تسجّل دخول.'
  if (m.includes('password') && m.includes('6')) return 'كلمة السر لازم تكون ٦ حروف أو أرقام على الأقل.'
  if (m.includes('rate limit')) return 'حاولت كتير، استنى شوية وجرّب تاني.'
  return 'حصل خطأ، جرّب تاني كمان شوية.'
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: toFriendlyAuthMessage(error.message) }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: toFriendlyAuthMessage(error.message) }
  }

  return { success: 'بعتنا لك رابط تأكيد على إيميلك. دوس عليه وبعدين سجّل دخولك.' }
}
