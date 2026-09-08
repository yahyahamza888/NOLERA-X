"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { logoutUser } from "../../lib/nolera-auth"
import { useNoleraAuth } from "../../lib/use-nolera-auth"
import { useNoleraState } from "../../lib/use-nolera-state"

export default function AccountPage() {
  const router = useRouter()
  const { user } = useNoleraAuth()
  const { balance, transactions } = useNoleraState()

  if (!user) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-100 p-6 text-center">
        <div className="mx-auto mt-20 max-w-md rounded-[28px] bg-white p-8 shadow">
          <h1 className="text-2xl font-black">يجب تسجيل الدخول</h1>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-2xl bg-slate-950 px-6 py-4 font-black text-white"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    )
  }

  const purchases = transactions.filter((t) => t.type === "purchase")

  function logout() {
    logoutUser()
    router.push("/login")
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] p-5">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[28px] bg-slate-950 p-7 text-white shadow-xl">
          <p className="text-sm text-white/50">NOLERA X ACCOUNT</p>
          <h1 className="mt-2 text-3xl font-black">
            مرحبًا، {user.name} 👋
          </h1>
          <p className="mt-2 text-sm text-white/60">{user.email}</p>

          <div className="mt-6 rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/50">رصيدك</p>
            <p className="text-3xl font-black">
              {balance.toLocaleString()} SDG
            </p>
          </div>
        </header>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/wallet" className="rounded-3xl bg-white p-6 shadow-sm">
            💰<h2 className="mt-3 font-black">المحفظة</h2>
          </Link>

          <Link href="/transactions" className="rounded-3xl bg-white p-6 shadow-sm">
            🧾<h2 className="mt-3 font-black">المعاملات</h2>
          </Link>

          <Link href="/store" className="rounded-3xl bg-white p-6 shadow-sm">
            🛍️<h2 className="mt-3 font-black">مشترياتي</h2>
            <p className="mt-1 text-sm text-slate-500">{purchases.length} عملية</p>
          </Link>

          <Link href="/create-product" className="rounded-3xl bg-white p-6 shadow-sm">
            📦<h2 className="mt-3 font-black">منتجاتي</h2>
          </Link>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <Link href="/profile" className="rounded-3xl bg-white p-5 font-black shadow-sm">
            👤 الملف الشخصي
          </Link>

          <Link href="/settings" className="rounded-3xl bg-white p-5 font-black shadow-sm">
            ⚙️ الإعدادات
          </Link>

          <Link href="/security" className="rounded-3xl bg-white p-5 font-black shadow-sm">
            🛡️ أمان الحساب
          </Link>
        </section>

        <button
          onClick={logout}
          className="mt-6 w-full rounded-2xl bg-red-600 py-4 font-black text-white"
        >
          تسجيل الخروج
        </button>
      </div>
    </main>
  )
}
