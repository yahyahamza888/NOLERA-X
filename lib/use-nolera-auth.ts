"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, type NoleraUser } from "./nolera-auth"

export function useNoleraAuth() {
  const [user, setUser] = useState<NoleraUser | null>(null)

  function refresh() {
    setUser(getCurrentUser())
  }

  useEffect(() => {
    refresh()

    const handler = () => refresh()

    window.addEventListener("nolera-auth-updated", handler)

    return () => {
      window.removeEventListener("nolera-auth-updated", handler)
    }
  }, [])

  return {
    user,
    isLoggedIn: Boolean(user),
    refresh,
  }
}
