"use client"

import { useEffect } from "react"
import { getCurrentUser } from "../lib/nolera-auth"

const protectedPhrases = [
  "إعجاب",
  "أعجبني",
  "تعليق",
  "اكتب تعليق",
  "متابعة",
  "تابع",
  "مشاركة",
  "شارك",
  "إنشاء منشور",
  "منشور جديد",
  "إنشاء قصة",
  "إنشاء ستوري",
  "إضافة قصة",
  "إنشاء إعلان",
  "إنشاء إعلان جديد",
  "إضافة إعلان",
  "تعديل الإعلان",
  "حذف الإعلان",
  "إدارة الإعلان",
  "إنشاء منتج",
  "إنشاء منتج رقمي",
  "منتج رقمي جديد",
  "إضافة منتج",
  "تعديل المنتج",
  "حذف المنتج",
  "نشر المنتج",
  "بيع المنتج",
]

function isProtectedText(text: string) {
  const value = text.trim()

  return (
    protectedPhrases.some((phrase) => value.includes(phrase)) ||
    value.includes("data-auth-required")
  )
}

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

      if (
        clickable.closest("[data-login]") ||
        clickable.textContent?.includes("تسجيل الدخول") ||
        clickable.textContent?.includes("إنشاء حساب")
      ) {
        return
      }

      const text = clickable.textContent || ""

      if (!isProtectedText(text) && !clickable.hasAttribute("data-auth-required")) {
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

      return false
    }

    document.addEventListener("click", handleClick, true)

    return () => {
      active = false
      document.removeEventListener("click", handleClick, true)
    }
  }, [])

  return null
}
