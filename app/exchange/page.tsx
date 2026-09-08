"use client"

import Link from "next/link"
import { ArrowDownUp, ArrowLeft, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"

const currencies = ["SDG", "USD", "Pi", "BTC", "ETH", "USDT"]

export default function ExchangePage() {
  const supabase = getSupabaseClient()
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("SDG")
  const [amount, setAmount] = useState("")
  const [rate, setRate] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const value = Number(amount || 0)
  const exchangeRate = Number(rate || 0)
  const result = value * exchangeRate

  function swapCurrencies() {
    setFrom(to)
    setTo(from)
    setAmount("")
    setMessage("")
    setError("")
  }

  async function exchange() {
    setMessage("")
    setError("")

    if (!value || value <= 0) {
      setError("أدخل مبلغًا صحيحًا.")
      return
    }

    if (!exchangeRate || exchangeRate <= 0) {
      setError("أدخل سعر الصرف.")
      return
    }

    if (from === to) {
      setError("اختر عملتين مختلفتين.")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.rpc("nolera_exchange", {
      p_from_currency: from,
      p_to_currency: to,
      p_from_amount: value,
      p_rate: exchangeRate,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    if (!data?.success) {
      setError("تعذر تنفيذ عملية الصرف.")
      return
    }

    setMessage(
      `تم الصرف بنجاح: ${data.from_amount} ${data.from_currency} → ${data.to_amount} ${data.to_currency} | المرجع: ${data.reference}`
    )
    setAmount("")
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/account"
          className="mb-6 flex items-center gap-2 text-sm text-slate-300"
        >
          <ArrowLeft size={18} />
          العودة للحساب
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/20 p-3">
                <ArrowDownUp className="text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Exchange</h1>
                <p className="text-sm text-slate-400">
                  تحويل العملات داخل NOLERA X
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="text-sm text-slate-300">
              من
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 p-4 outline-none"
              >
                {currencies.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <button
              onClick={swapCurrencies}
              className="mx-auto rounded-full border border-white/10 bg-white/10 p-3"
            >
              <ArrowDownUp size={20} />
            </button>

            <label className="text-sm text-slate-300">
              إلى
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 p-4 outline-none"
              >
                {currencies.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-300">
              المبلغ
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 p-4 text-lg outline-none"
              />
            </label>

            <label className="text-sm text-slate-300">
              سعر الصرف
              <input
                type="number"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder={`مثال: 600 مقابل 1 ${from}`}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 p-4 outline-none"
              />
            </label>

            <div className="rounded-2xl bg-slate-900 p-4">
              <div className="text-sm text-slate-400">ستحصل تقريبًا على</div>
              <div className="mt-1 text-2xl font-bold">
                {result ? result.toLocaleString() : "0"} {to}
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-300">
                {message}
              </div>
            )}

            <button
              onClick={exchange}
              disabled={loading}
              className="rounded-2xl bg-emerald-500 p-4 font-bold text-slate-950 disabled:opacity-50"
            >
              {loading ? "جاري تنفيذ العملية..." : "تنفيذ Exchange"}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={16} />
              العملية تُنفذ داخل قاعدة بيانات NOLERA X عبر معاملة آمنة.
            </div>

            <p className="text-xs leading-6 text-slate-500">
              ملاحظة: سعر الصرف الحالي يُدخل يدويًا مؤقتًا. لاحقًا نربطه
              بمصدر أسعار حقيقي قبل تشغيل التداول الفعلي.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
