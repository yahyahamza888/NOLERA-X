"use client"

import { useEffect, useState } from "react"
import {
  getCurrentUser,
  getSupabaseClient,
  type NoleraUser,
} from "./nolera-auth"

export function useNoleraAuth() {
  const [user, setUser] = useState<NoleraUser | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    try {
      const current = await getCurrentUser()
      setUser(current)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()

    const supabase = getSupabaseClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refresh()
      window.dispatchEvent(new Event("nolera-auth-updated"))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    isLoggedIn: Boolean(user),
    loading,
    refresh,
  }
}
