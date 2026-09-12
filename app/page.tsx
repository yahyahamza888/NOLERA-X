"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { getNoleraLanguage, setNoleraLanguage } from "../lib/nolera-language"
import NoleraBrand from "../components/NoleraBrand"
import CurrencySelector from "../components/CurrencySelector"

export default function HomePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "ar">("en")

  useEffect(() => {
    setLanguage(getNoleraLanguage())
  }, [])

  const ar = language === "ar"

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#12091d] px-5 text-white"
    >
      {/* Large background X */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[70vw] font-black leading-none text-yellow-400/[0.10]"
      >
        X
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-md text-center">

        {/* Language */}
        <div className="absolute -top-24 left-0 flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-black backdrop-blur-xl">
          <button
            onClick={() => {
              setLanguage("en")
              setNoleraLanguage("en")
            }}
            className={`rounded-full px-4 py-2 transition ${
              !ar ? "bg-white text-slate-900" : "text-white/60"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => {
              setLanguage("ar")
              setNoleraLanguage("ar")
            }}
            className={`rounded-full px-4 py-2 transition ${
              ar ? "bg-white text-slate-900" : "text-white/60"
            }`}
          >
            العربية
          </button>
        </div>

        {/* Brand */}
        <div className="mb-8">
          <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
            <div className="absolute text-[10rem] font-black leading-none text-yellow-300/20">
              X
            </div>

            <div className="relative text-6xl font-black tracking-[-0.12em]">
              NR
            </div>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            NOLERA X
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/60">
            {ar
              ? "منصة تجارة إلكترونية عالمية رقمية عالمية"
              : "A global digital financial platform"}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-2xl bg-white py-4 font-black text-[#24122f] shadow-xl transition hover:scale-[1.01]"
          >
            {ar ? "تسجيل الدخول" : "Sign In"}
          </button>

          <button
            onClick={() => router.push("/register")}
            className="w-full rounded-2xl border border-white/20 bg-white/10 py-4 font-black backdrop-blur-xl transition hover:bg-white/15"
          >
            {ar ? "إنشاء حساب" : "Create Account"}
          </button>

          <button
            onClick={() => router.push("/guest")}
            className="w-full rounded-2xl border border-yellow-300/30 bg-yellow-300/10 py-4 font-black text-yellow-200 transition hover:bg-yellow-300/15"
          >
            {ar ? "الدخول كزائر" : "Continue as Guest"}
          </button>
        </div>

        <p className="mt-8 text-xs text-white/35">
          {ar
            ? "NOLERA X • USD"
            : "NOLERA X • USD"}
        </p>
      </div>
    </main>
  )
}
