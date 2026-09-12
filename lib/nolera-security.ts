export type SecurityMethod = "password" | "verification" | "passkey"

export const SECURITY_METHODS: SecurityMethod[] = [
  "password",
  "verification",
  "passkey",
]

export function isSensitiveRoute(pathname: string) {
  const sensitiveRoutes = [
    "/wallet",
    "/add-money",
    "/withdraw",
    "/transfers",
    "/exchange",
    "/verification",
    "/cards",
    "/account",
    "/security",
  ]

  return sensitiveRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  )
}

export function getSecurityMessage() {
  return "For your protection, sensitive financial actions require an authenticated NOLERA X account."
}
