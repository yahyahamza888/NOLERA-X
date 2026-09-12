"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeftRight,
  LayoutGrid,
  UserRound,
  Wallet,
  Store,
  Sparkles,
  Truck,
  Megaphone,
} from "lucide-react"

import { getNoleraLanguage, setNoleraLanguage } from "../lib/nolera-language"
import { getCurrentUser, getSupabaseClient } from "../lib/nolera-auth"
import NoleraBrand from "../components/NoleraBrand"
import CurrencySelector from "../components/CurrencySelector"

export default function HomePage() {
  const router = useRouter()

  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLanguage(getNoleraLanguage())

    async function loadUser() {
      try {
        const current = await getCurrentUser()
        setUser(current)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    const supabase = getSupabaseClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      const current = await getCurrentUser()
      setUser(current)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const ar = language === "ar"

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#12091d] text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-yellow-300/30" />
          <p className="mt-4 font-bold">
            {ar ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </main>
    )
  }

  /*
   * AUTHENTICATED HOME
   * المستخدم المسجل لا يعود إلى Welcome Screen
   */
  if (user) {
    const services = [
      {
        title: ar ? "المحفظة" : "Wallet",
        description: ar ? "الرصيد والمعاملات" : "Balance & transactions",
        href: "/wallet",
        icon: Wallet,
      },
      {
        title: ar ? "تحويل" : "Transfer",
        description: ar ? "إرسال الأموال" : "Send money",
        href: "/transfers",
        icon: ArrowLeftRight,
      },
      {
        title: ar ? "الخدمات" : "Services",
        description: ar ? "كل خدمات NOLERA" : "All NOLERA services",
        href: "/services",
        icon: LayoutGrid,
      },
      {
        title: "NOLERA Store",
        description: ar ? "المنتجات والخدمات" : "Products & services",
        href: "/store",
        icon: Store,
      },
      {
        title: "NOLERA AI",
        description: ar ? "الذكاء وصناعة المنتجات" : "AI & digital creation",
        href: "/ai",
        icon: Sparkles,
      },
      {
        title: "NOLERA ADS",
        description: ar ? "الإعلانات والأعمال" : "Advertising & business",
        href: "/ads",
        icon: Megaphone,
      },
      {
        title: "Logistics",
        description: ar ? "الخدمات اللوجستية العالمية" : "Global logistics",
        href: "/logistics",
        icon: Truck,
      },
      {
        title: ar ? "حسابي" : "My Account",
        description: ar ? "الملف والإعدادات" : "Profile & settings",
        href: "/account",
        icon: UserRound,
      },
    ]

    return (
      <main
        dir={ar ? "rtl" : "ltr"}
        className="min-h-screen bg-[#fbf8ff] px-4 pb-24 pt-5 text-[#24152f]"
      >
        <div className="mx-auto w-full max-w-5xl">

          <header className="mb-6 flex items-center justify-between rounded-[26px] border border-purple-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <NoleraBrand compact />

              <div>
                <p className="text-[10px] font-bold text-[#00bcd4]">
                  NOLERA X
                </p>
                <h1 className="text-lg font-black">
                  {ar
                    ? `مرحباً ${user.name || "بك"}`
                    : `Welcome ${user.name || ""}`}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/account")}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700"
              aria-label={ar ? "حسابي" : "My Account"}
            >
              <UserRound size={21} />
            </button>
          </header>

          <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#6f36a9] via-[#8240b6] to-[#a85bd0] p-6 text-white shadow-xl shadow-purple-200">
            <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#00e5ff]/15 blur-3xl" />
            <div className="absolute -bottom-20 right-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold text-white/60">
                {ar ? "الرئيسية" : "NOLERA X HOME"}
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {ar ? "كل شيء في مكان واحد" : "Everything in one place"}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                {ar
                  ? "المحفظة والتحويلات والمتجر والذكاء الاصطناعي والإعلانات والخدمات العالمية."
                  : "Wallet, transfers, store, AI, advertising and global services."}
              </p>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => router.push("/wallet")}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#6f36a9] shadow-lg"
                >
                  {ar ? "فتح المحفظة" : "Open Wallet"}
                </button>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <div className="mb-3">
              <p className="text-xs font-bold text-[#00bcd4]">
                NOLERA SERVICES
              </p>
              <h2 className="mt-1 text-xl font-black">
                {ar ? "الخدمات" : "Services"}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {services.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className="rounded-[22px] border border-purple-100 bg-white p-4 text-start shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-3 text-sm font-black">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      {item.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>

        </div>
      </main>
    )
  }

  /*
   * PUBLIC WELCOME
   * الزائر غير المسجل يرى شاشة الترحيب الأصلية
   */
  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#12091d] px-5 text-white"
    >
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
              ? "منصة مالية رقمية عالمية"
              : "A global digital financial platform"}
          </p>
        </div>

        <div className="mb-5 flex justify-center">
          <CurrencySelector />
        </div>

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
          NOLERA X • USD
        </p>
      </div>
    </main>
  )
}
