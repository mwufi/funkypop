'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function signIn() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  const res = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  console.log('Sign in result:', res)
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  const res = await supabase.auth.signOut()
  console.log('Sign out result:', res)
  
}
