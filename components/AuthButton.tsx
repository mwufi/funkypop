'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from './Button'
import { signIn, signOut } from '@/app/auth/actions'
import { useEffect, useState } from 'react'

export function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return null
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <Button type="submit">Logout</Button>
      </form>
    </div>
  ) : (
    <form action={signIn}>
      <Button type="submit">Login with GitHub</Button>
    </form>
  )
}
