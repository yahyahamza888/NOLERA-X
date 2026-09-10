"use client"

import Link from "next/link"
import { ArrowLeft, PlusCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { changeWallet } from "../../lib/nolera-finance"
import { requireNoleraAuth } from "../../lib/nolera-auth-guard"

export default function AddMoneyPage() {
  const router = useRouter()
  const [currency, setCurrency] = useState("USD")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError("")
    setMessage("")
    const authenticated = await requireNoleraAuth(router)
    if (!authenticated) return

    setLoading(true)

    try {
      await changeWallet(currency, Number(amount), "deposit")
      setMessage(`تمت إضافة ${amount} ${currency} إلى المحفظة.`)
      setAmount("")
    } catch (e: any) {
      setError(e.message)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-xl">
        <Link href="/account" className="flex items-center gap-2 text-slate-300">
          <ArrowLeft size={18} /> الحساب
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex items-center gap-3">
            <PlusCircle className="text-emerald-400" />
            <h1 className="text-2xl font-bold">Add Money</h1>
          </div>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mb-4 w-full rounded-2xl bg-slate-900 p-4"
          >
            {["SDG","USD","Pi","BTC","ETH","USDT"].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="المبلغ"
            className="mb-4 w-full rounded-2xl bg-slate-900 p-4"
          />

          {error && <div className="mb-4 rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}
          {message && <div className="mb-4 rounded-2xl bg-emerald-500/10 p-4 text-emerald-300">{message}</div>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 p-4 font-bold text-slate-950 disabled:opacity-50"
          >
            {loading ? "جاري التنفيذ..." : "إضافة المبلغ"}
          </button>

          <p className="mt-4 text-xs text-slate-500">
            هذه العملية تسجل رصيدًا داخل NOLERA X. الربط البنكي أو مزود الدفع الخارجي يأتي لاحقًا.
          </p>
        </div>
      </div>
    </main>
  )
}
