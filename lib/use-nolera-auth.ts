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
    let active = true
    let refreshTimer: ReturnType<typeof setTimeout> | null = null

    async function initialLoad() {
      try {
        const current = await getCurrentUser()
        if (active) {
          setUser(current)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    initialLoad()

    const supabase = getSupabaseClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (refreshTimer) {
        clearTimeout(refreshTimer)
      }

      refreshTimer = setTimeout(async () => {
        if (!active) return

        try {
          const current = await getCurrentUser()
          if (active) {
            setUser(current)
            setLoading(false)
          }
        } catch {
          if (active) {
            setUser(null)
            setLoading(false)
          }
        }

        if (active) {
          window.dispatchEvent(new Event("nolera-auth-updated"))
        }
      }, 0)
    })

    return () => {
      active = false

      if (refreshTimer) {
        clearTimeout(refreshTimer)
      }

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
