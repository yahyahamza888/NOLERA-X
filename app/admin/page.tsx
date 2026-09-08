"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"

const supabase = getSupabaseClient()

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState("user")
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("SDG")
  const [rate, setRate] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUser(user)

        if (!user) return

        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()

        if (error) throw error

        setRole(data?.role || "user")
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "تعذر تحميل لوحة الإدارة."
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function saveRate() {
    const value = Number(rate)

    if (!value || value <= 0) {
      setMessage("أدخل سعرًا صحيحًا.")
      return
    }

    try {
      const { error } = await supabase.rpc(
        "nolera_set_exchange_rate",
        {
          p_from_currency: from,
          p_to_currency: to,
          p_rate: value,
        }
      )

      if (error) throw error

      setMessage(
        `تم حفظ سعر ${from} → ${to} بنجاح.`
      )

      setRate("")
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر حفظ السعر."
      )
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        جاري التحميل...
      </main>
    )
  }

  if (!user) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-slate-950 p-8 text-white"
      >
        <div className="mx-auto max-w-lg rounded-3xl bg-white/10 p-8 text-center">
          <h1 className="text-2xl font-black">
            يجب تسجيل الدخول
          </h1>

          <Link
            href="/login"
            className="mt-5 inline-block rounded-2xl bg-white px-6 py-3 font-black text-slate-950"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    )
  }

  if (role !== "admin") {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-slate-950 p-8 text-white"
      >
        <div className="mx-auto max-w-lg rounded-3xl bg-white/10 p-8 text-center">
          <div className="text-5xl">🛡️</div>

          <h1 className="mt-4 text-2xl font-black">
            لا توجد صلاحية
          </h1>

          <p className="mt-3 text-white/60">
            هذه الصفحة مخصصة لإدارة NOLERA X.
          </p>

          <Link
            href="/account"
            className="mt-5 inline-block rounded-2xl bg-white px-6 py-3 font-black text-slate-950"
          >
            العودة للحساب
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5f7fb] p-6"
    >
      <div className="mx-auto max-w-5xl">

        <header className="rounded-[28px] bg-slate-950 p-7 text-white">
          <p className="text-sm text-white/50">
            NOLERA X ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-black">
            لوحة الإدارة 🛡️
          </h1>

          <p className="mt-2 text-white/60">
            التحكم في إعدادات النظام الحساسة.
          </p>
        </header>

        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            أسعار Exchange
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            السعر يحفظ في قاعدة البيانات ويستخدمه
            نظام Exchange بدل أن يرسله المستخدم.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-2xl bg-slate-100 p-4"
            >
              {["SDG", "USD", "Pi", "BTC", "ETH", "USDT"].map(
                (item) => (
                  <option key={item}>{item}</option>
                )
              )}
            </select>

            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-2xl bg-slate-100 p-4"
            >
              {["SDG", "USD", "Pi", "BTC", "ETH", "USDT"].map(
                (item) => (
                  <option key={item}>{item}</option>
                )
              )}
            </select>

            <input
              type="number"
              min="0"
              step="any"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="السعر"
              className="rounded-2xl bg-slate-100 p-4"
            />
          </div>

          <button
            onClick={saveRate}
            className="mt-4 w-full rounded-2xl bg-slate-950 py-4 font-black text-white"
          >
            حفظ سعر الصرف
          </button>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/store"
            className="rounded-3xl bg-white p-6 font-black shadow-sm"
          >
            🛍️ المتجر
          </Link>

          <Link
            href="/orders"
            className="rounded-3xl bg-white p-6 font-black shadow-sm"
          >
            📦 الطلبات
          </Link>

          <Link
            href="/notifications"
            className="rounded-3xl bg-white p-6 font-black shadow-sm"
          >
            🔔 الإشعارات
          </Link>

          <Link
            href="/verification"
            className="rounded-3xl bg-white p-6 font-black shadow-sm"
          >
            🪪 التحقق
          </Link>
        </section>

        {message && (
          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-center font-bold text-white">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}
