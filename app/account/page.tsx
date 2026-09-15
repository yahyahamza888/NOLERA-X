"use client"

import { useNoleraLanguage } from "@/components/NoleraLanguageProvider"

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
  Package,
  BarChart3,
  LockKeyhole,
  ChevronLeft,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react"
import { getSupabaseClient, logoutUser } from "../../lib/nolera-auth"
import { useNoleraAuth } from "../../lib/use-nolera-auth"
import { getWallets } from "../../lib/nolera-finance"

export default function AccountPage() {
  const { language } = useNoleraLanguage()
  const ar = language === "ar"

  const router = useRouter()
  const { user, loading: authLoading } = useNoleraAuth()

  const [usdBalance, setSdgBalance] = useState(0)
  const [showBalance, setShowBalance] = useState(true)
  const [accountRole, setAccountRole] = useState("user")

  async function refreshBalance() {
    try {
      const wallets = await getWallets()
      const usd = wallets.find((wallet) => wallet.currency === "USD")
      setSdgBalance(Number(usd?.balance || 0))
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

  useEffect(() => {
    if (!user?.id) return

    getSupabaseClient()
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAccountRole(data?.role || "user")
      })
  }, [user?.id])

  async function logout() {
    await logoutUser()
    router.push("/login")
  }

  if (authLoading) {
    return (
      <main
        dir={ar ? "rtl" : "ltr"}
        className="flex min-h-screen items-center justify-center bg-[#fbf8ff] p-6 text-[#24152f]"
      >
        <div className="rounded-3xl border border-purple-100 bg-white px-8 py-6 text-center shadow-lg">
          <div className="mx-auto h-10 w-10 animate-pulse rounded-2xl bg-purple-100" />
          <p className="mt-4 font-bold">جاري تحميل الحساب...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main
        dir={ar ? "rtl" : "ltr"}
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

  const quickActions = [
    [ar ? "تحويل" : "Transfer", "/transfers", ArrowLeftRight],
    [ar ? "استلام" : "Receive", "/transfers", ArrowDownToLine],
    [ar ? "إضافة" : "Add Money", "/add-money", Plus],
    [ar ? "سحب" : "Withdraw", "/withdraw", ArrowUpFromLine],
  ]

  const activity = [
    {
      href: "/transactions",
      title: ar ? "المعاملات" : "Transactions",
      description: ar ? "حركات أموالك" : "Your money activity",
      icon: ReceiptText,
    },
    {
      href: "/orders",
      title: ar ? "طلباتي" : "My Orders",
      description: ar ? "المشتريات والطلبات" : "Purchases and orders",
      icon: ShoppingBag,
    },
    {
      href: "/create-product",
      title: ar ? "منتجاتي" : "My Products",
      description: ar ? "المنتجات التي أنشأتها" : "Products you created",
      icon: Package,
    },
    {
      href: "/seller",
      title: ar ? "مبيعاتي" : "My Sales",
      description: ar ? "المبيعات والأرباح" : "Sales and earnings",
      icon: BarChart3,
    },
  ]

  const accountServices = [
    {
      href: "/cards",
      title: ar ? "البطاقات" : "Cards",
      icon: CreditCard,
    },
    {
      href: "/notifications",
      title: ar ? "الإشعارات" : "Notifications",
      icon: Bell,
    },
    {
      href: "/verification",
      title: ar ? "التحقق والهوية" : "Verification & Identity",
      icon: ShieldCheck,
    },
    {
      href: "/security",
      title: ar ? "أمان الحساب" : "Account Security",
      icon: LockKeyhole,
    },
    {
      href: "/profile",
      title: ar ? "الملف الشخصي" : "Profile",
      icon: UserRound,
    },
    {
      href: "/settings",
      title: ar ? "الإعدادات" : "Settings",
      icon: Settings,
    },
  ]

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="min-h-screen bg-[#fbf8ff] pb-10 text-[#24152f]"
    >
      <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6">

        {/* Account Header */}
        <header className="mb-5 flex items-center justify-between rounded-[26px] border border-purple-100 bg-white px-4 py-3 shadow-sm">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-2xl px-2 py-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <UserRound size={21} />
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#00bcd4]">
                NOLERA X
              </p>
              <h1 className="text-lg font-black">
                {accountRole === "super_admin" ? ar ? "المشرف الأعلى" : "Super Admin" : (user.name || (ar ? "حسابي" : "My Account"))}
              </h1>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-black text-purple-700"
          >
            الرئيسية
          </Link>
        </header>

        {/* Wallet / Balance */}
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#6f36a9] via-[#8240b6] to-[#a85bd0] p-5 text-white shadow-xl shadow-purple-200 sm:p-7">
          <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#00e5ff]/15 blur-3xl" />
          <div className="absolute -bottom-20 right-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-white/75">
                  <Wallet size={17} />
                  المحفظة
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <div className="text-3xl font-black tracking-tight sm:text-5xl">
                    {showBalance
                      ? `${usdBalance.toLocaleString()} USD`
                      : "••••••••"}
                  </div>

                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
                    aria-label={ar ? "إظهار أو إخفاء الرصيد" : "Show or hide balance"}
                  >
                    {showBalance ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-[#b8f8ff]">
                  محفظتك داخل NOLERA X
                </p>
              </div>

              <div className="hidden rounded-2xl border border-white/15 bg-white/10 p-3 sm:block">
                <div className="text-[10px] text-white/60">
                  NOLERA ID
                </div>
                <div className="mt-1 font-bold">
                  {user.name || "User"}
                </div>
              </div>
            </div>

            {/* Wallet Quick Actions */}
            <div className="mt-6 grid grid-cols-4 gap-2 sm:max-w-2xl sm:gap-3">
              {quickActions.map(([label, href, Icon]) => {
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

            {/* Wallet Link */}
            <Link
              href="/wallet"
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-xs font-black transition hover:bg-white/20"
            >
              فتح المحفظة بالتفصيل
              <ChevronLeft size={15} />
            </Link>
          </div>
        </section>

        {/* Account Overview */}
        <section className="mt-7">
          <div className="mb-3">
            <p className="text-xs font-bold text-[#00bcd4]">
              ACCOUNT CENTER
            </p>
            <h2 className="mt-1 text-xl font-black">
              مركز حسابي
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              كل ما تملكه وتبيعه وتشتريه وتنشئه من مكان واحد.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {activity.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-3 text-sm font-black">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    {item.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Account Services */}
        <section className="mt-7">
          <div className="mb-3">
            <p className="text-xs font-bold text-[#00bcd4]">
              ACCOUNT SERVICES
            </p>
            <h2 className="mt-1 text-xl font-black">
              خدمات الحساب
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">

            {(accountRole === "admin" ||
              accountRole === "super_admin") && (
              <div className="col-span-3 rounded-[26px] border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-white p-4 shadow-sm sm:col-span-4 lg:col-span-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 transition hover:bg-purple-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                      <ShieldCheck size={22} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-purple-500">
                        {accountRole === "super_admin" ? "SUPER ADMIN" : "ADMIN"}
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        {accountRole === "super_admin"
                          ? ar ? "لوحة القيادة" : "Dashboard"
                          : ar ? "لوحة تحكم الإدارة" : "Admin Dashboard"}
                      </p>
                    </div>
                  </Link>

                  {accountRole === "super_admin" && (
                    <Link
                      href="/admin/employees"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-purple-700 px-4 py-3 text-xs font-black text-white transition hover:bg-purple-800"
                    >
                      👥 الموظفون والصلاحيات
                    </Link>
                  )}
                </div>
              </div>
            )}

            {accountServices.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-purple-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
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

        {/* AI Shortcut */}
        <section className="mt-7 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6d35a8] to-[#9a4dca] p-5 text-white shadow-lg shadow-purple-200">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles size={24} />
            </div>

            <div>
              <p className="text-[10px] font-bold text-cyan-200">
                NOLERA AI INTELLIGENCE
              </p>
              <h2 className="font-black">
                الذكاء الاصطناعي
              </h2>
              <p className="mt-1 text-xs text-white/70">
                مساعدك الذكي وصناعة المنتجات الرقمية
              </p>
            </div>
          </div>

          <Link
            href="/ai"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-center text-sm font-black transition hover:bg-white/20"
          >
            فتح NOLERA AI
            <ChevronLeft size={17} />
          </Link>
        </section>

        {/* Store shortcut */}
        <section className="mt-7 rounded-[26px] border border-purple-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <Store size={21} />
            </div>

            <div className="flex-1">
              <h2 className="font-black">
                NOLERA Store
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                المنتجات الرقمية والخدمات المتاحة للشراء
              </p>
            </div>

            <Link
              href="/store"
              className="rounded-xl bg-purple-50 px-3 py-2 text-xs font-black text-purple-700"
            >
              فتح
            </Link>
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00c8e8] py-4 font-black text-white shadow-lg shadow-cyan-200 transition hover:bg-[#00aeca]"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>

      </div>
    </main>
  )
}
