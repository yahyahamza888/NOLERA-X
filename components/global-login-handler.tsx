"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/nolera-auth"

export default function GlobalLoginHandler() {
  const router = useRouter()

  useEffect(() => {
    let active = true

    async function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null
      if (!target) return

      const clickable = target.closest(
        "a,button,[role='button'],[data-login]"
      ) as HTMLElement | null

      if (!clickable) return

      // زر تسجيل الدخول الحقيقي يذهب إلى صفحة الدخول.
      // لا نعترض على بقية الأزرار لمجرد احتوائها على نص مشابه.
      const isLogin =
        clickable.hasAttribute("data-login") ||
        clickable.getAttribute("href") === "/login"

      if (!isLogin) return

      // إذا كان المستخدم مسجلاً بالفعل، لا نعيده إلى صفحة الدخول.
      const user = await getCurrentUser()

      if (!active) return

      if (user) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      event.preventDefault()
      event.stopPropagation()

      router.push("/login")
    }

    document.addEventListener("click", handleClick, true)

    return () => {
      active = false
      document.removeEventListener("click", handleClick, true)
    }
  }, [router])

  return null
}
