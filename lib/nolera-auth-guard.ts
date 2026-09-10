"use client"

import { getCurrentUser } from "./nolera-auth"

export async function isNoleraAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

export function getLoginUrl(next?: string) {
  const target =
    next ||
    (typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/")

  return `/login?next=${encodeURIComponent(target)}`
}

export async function requireNoleraAuth(
  router: { push: (url: string) => void },
  next?: string
) {
  const authenticated = await isNoleraAuthenticated()

  if (authenticated) return true

  router.push(getLoginUrl(next))
  return false
}
