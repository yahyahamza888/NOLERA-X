"use client"

import { ReactNode, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { getCurrentUser } from "../lib/nolera-auth"

type Props = {
  children: ReactNode
}

export default function NoleraAuthGuard({ children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    async function checkAuth() {
      const user = await getCurrentUser()

      if (!active) return

      if (user) {
        setAllowed(true)
        setChecking(false)
        return
      }

      const search =
        typeof window !== "undefined"
          ? window.location.search
          : ""

      const next = pathname + search

      router.replace(
        `/login?next=${encodeURIComponent(next)}`
      )
    }

    checkAuth()

    return () => {
      active = false
    }
  }, [pathname, router])

  if (checking) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fffaff] flex items-center justify-center p-6"
      >
        <div className="rounded-3xl bg-white px-8 py-7 shadow-xl text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-[#8240b6]" />
          <p className="font-black text-slate-700">
            جاري التحقق من الحساب...
          </p>
        </div>
      </main>
    )
  }

  return allowed ? <>{children}</> : null
}
