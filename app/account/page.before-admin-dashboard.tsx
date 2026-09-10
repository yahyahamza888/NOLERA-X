"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Wallet,
  ArrowLeftRight,
  ReceiptText,
  ShoppingBag,
  Bell,
  CreditCard,
  UserRound,
  Settings,
  ShieldCheck,
  Store,
  Sparkles,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react"
import { logoutUser } from "../../lib/nolera-auth"
import { useNoleraAuth } from "../../lib/use-nolera-auth"
import { getWallets } from "../../lib/nolera-finance"

export default function AccountPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useNoleraAuth()
  const [sdgBalance, setSdgBalance] = useState(0)
  const [showBalance, setShowBalance] = useState(true)

  async function refreshBalance() {
    try {
      const wallets = await getWallets()
      const sdg = wallets.find((wallet) => wallet.currency === "SDG")
      setSdgBalance(Number(sdg?.balance || 0))
    } catch {
      setSdgBalance(0)
    }
  }

  useEffect(() => {
    refreshBalance()

    const handler = () => refreshBalance()
    window.addEventListener("nolera-data-updated", handler)

    return () => window.removeEventListener("nolera-data-updated", handler)
  }, [])

  async function logout() {
    await logoutUser()
    router.push("/login")
  }

  if (authLoading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fbf8ff] p-6 text-center text-[#24152f]"
      >
        جاري تحميل الحساب...
      </main>
    )
  }

  if (!user) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fbf8ff] p-5 text-[#24152f]"
      >
        <div className="mx-auto mt-20 max-w-md rounded-[28px] border border-purple-100 bg-white p-8 text-center shadow-xl shadow-purple-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
            <UserRound size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-black">
            يجب تسجيل الدخول
          </h1>

          <Link
            href="/login"
            className="mt-5 inline-block rounded-2xl bg-gradient-to-r from-[#6f36a9] to-[#a85bd0] px-6 py-4 font-black text-white shadow-lg shadow-purple-200"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    )
  }

  const cards = [
    {
      href: "/wallet",
      title: "المحفظة",
      icon: Wallet,
      tone: "purple",
    },
    {
      href: "/transactions",
      title: "المعاملات",
      icon: ReceiptText,
      tone: "neon",
    },
    {
      href: "/orders",
      title: "طلباتي",
      icon: ShoppingBag,
      tone: "purple",
    },
    {
      href: "/create-product",
      title: "منتجاتي",
      icon: Store,
      tone: "neon",
    },
    {
      href: "/store",
      title: "المتجر",
      icon: ShoppingBag,
      tone: "purple",
    },
    {
      href: "/swap",
      title: "Swap",
      icon: ArrowLeftRight,
      tone: "neon",
    },
    {
      href: "/notifications",
      title: "الإشعارات",
      icon: Bell,
      tone: "purple",
    },
    {
      href: "/cards",
      title: "البطاقات",
      icon: CreditCard,
      tone: "neon",
    },
    {
      href: "/profile",
      title: "الملف الشخصي",
      icon: UserRound,
      tone: "purple",
    },
    {
      href: "/settings",
      title: "الإعدادات",
      icon: Settings,
      tone: "neon",
    },
    {
      href: "/security",
      title: "أمان الحساب",
      icon: ShieldCheck,
      tone: "purple",
    },
    {
      href: "/verification",
      title: "التحقق",
      icon: ShieldCheck,
      tone: "neon",
    },
  ]

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#fbf8ff] pb-10 text-[#24152f]"
    >
      <div className="mx-auto min-h-screen w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6">

        {/* Header */}
        <header className="mb-5 flex items-center justify-between rounded-[24px] border border-purple-100 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-xs font-bold text-[#00d9ff]">
              NOLERA X
            </p>
            <h1 className="text-xl font-black">
              حسابي
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-black text-purple-700"
          >
            الرئيسية
          </Link>
        </header>

        {/* Balance Card */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6f36a9] via-[#8240b6] to-[#a85bd0] p-5 text-white shadow-xl shadow-purple-200 sm:p-7">
          <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#00e5ff]/15 blur-3xl" />
          <div className="absolute -bottom-20 right-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-white/75">
                  <Wallet size={17} />
                  رصيدك في NOLERA X
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <div className="text-3xl font-black tracking-tight sm:text-5xl">
                    {showBalance
                      ? `${sdgBalance.toLocaleString()} SDG`
                      : "••••••••"}
                  </div>

                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
                  >
                    {showBalance ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <div className="mt-2 text-xs text-[#b8f8ff]">
                  حساب NOLERA X
                </div>
              </div>

              <div className="hidden rounded-2xl border border-white/15 bg-white/10 p-3 text-left sm:block">
                <div className="text-[10px] text-white/60">
                  NOLERA ID
                </div>
                <div className="mt-1 font-bold">
                  {user.name}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-4 gap-2 sm:max-w-2xl sm:gap-3">
              {[
                ["تحويل", "/transfers", ArrowLeftRight],
                ["استلام", "/transfers", Wallet],
                ["إضافة", "/add-money", Wallet],
                ["سحب", "/withdraw", ArrowLeftRight],
              ].map(([label, href, Icon]) => {
                const ActionIcon = Icon as typeof Wallet

                return (
                  <Link
                    key={label as string}
                    href={href as string}
                    className="flex flex-col items-center justify-center rounded-2xl bg-white/10 px-2 py-3 text-center transition hover:bg-white/20"
                  >
                    <ActionIcon size={19} />
                    <span className="mt-1.5 text-[11px] font-bold">
                      {label as string}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mt-7">
          <div className="mb-3">
            <p className="text-xs font-bold text-[#00d9ff]">
              NOLERA X
            </p>
            <h2 className="mt-1 text-xl font-black">
              خدمات الحساب
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
            {cards.map((item) => {
              const Icon = item.icon
              const neon = item.tone === "neon"

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-purple-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                >
                  <div
                    className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${
                      neon
                        ? "bg-[#eaffff] text-[#00d9ff] shadow-[0_0_18px_rgba(0,217,255,0.18)]"
                        : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="mt-2 text-center text-[11px] font-bold leading-4 text-slate-700 sm:text-xs">
                    {item.title}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* AI Banner */}
        <section className="mt-7 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6d35a8] to-[#9a4dca] p-5 text-white shadow-lg shadow-purple-200">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles size={24} />
            </div>

            <div>
              <h2 className="font-black">
                أبو حنين AI
              </h2>
              <p className="mt-1 text-xs text-white/70">
                مساعدك الذكي داخل منظومة NOLERA X
              </p>
            </div>
          </div>

          <Link
            href="/ai"
            className="mt-4 block rounded-xl bg-white/15 px-4 py-3 text-center text-sm font-black transition hover:bg-white/20"
          >
            فتح المساعد
          </Link>
        </section>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00d9ff] py-4 font-black text-white shadow-lg shadow-cyan-200 transition hover:bg-[#00b8d9]"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </main>
  )
}
