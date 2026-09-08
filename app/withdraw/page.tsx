"use client"

import Link from "next/link"
import { ArrowLeft, MinusCircle } from "lucide-react"
import { useState } from "react"
import { changeWallet } from "../../lib/nolera-finance"

export default function WithdrawPage() {
  const [currency, setCurrency] = useState("USD")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await changeWallet(currency, Number(amount), "withdraw")
      setMessage(`تم تسجيل سحب ${amount} ${currency}.`)
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
            <MinusCircle className="text-red-400" />
            <h1 className="text-2xl font-bold">Withdraw</h1>
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
            className="w-full rounded-2xl bg-red-500 p-4 font-bold disabled:opacity-50"
          >
            {loading ? "جاري التنفيذ..." : "تنفيذ السحب"}
          </button>

          <p className="mt-4 text-xs text-slate-500">
            السحب الحالي تحديث داخلي لرصيد NOLERA X، وليس تحويلًا مصرفيًا أو Blockchain.
          </p>
        </div>
      </div>
    </main>
  )
}
