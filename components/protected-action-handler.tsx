"use client"

import { useEffect } from "react"
import { getCurrentUser } from "../lib/nolera-auth"

export default function ProtectedActionHandler() {
  useEffect(() => {
    let active = true

    async function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null
      if (!target) return

      const clickable = target.closest(
        "button,a,[role='button'],[data-auth-required]"
      ) as HTMLElement | null

      if (!clickable) return

      // الحماية تكون صريحة فقط عبر data-auth-required.
      // لا نعتمد على نص الزر حتى لا نعطل أزرار الإدارة أو الأزرار العادية.
      if (!clickable.hasAttribute("data-auth-required")) {
        return
      }

      // أزرار تسجيل الدخول/إنشاء الحساب لها سلوكها الطبيعي.
      if (
        clickable.closest("[data-login]") ||
        clickable.textContent?.includes("تسجيل الدخول") ||
        clickable.textContent?.includes("إنشاء حساب")
      ) {
        return
      }

      const user = await getCurrentUser()

      if (!active) return
      if (user) return

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()

      const current =
        window.location.pathname +
        window.location.search +
        window.location.hash

      window.location.href =
        `/login?next=${encodeURIComponent(current)}`
    }

    document.addEventListener("click", handleClick, true)

    return () => {
      active = false
      document.removeEventListener("click", handleClick, true)
    }
  }, [])

  return null
}
