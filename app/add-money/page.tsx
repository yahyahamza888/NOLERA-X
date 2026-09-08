 "use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Wallet } from "lucide-react"
import { deposit } from "../../lib/nolera-actions"
import { useNoleraState } from "../../lib/use-nolera-state"

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const { balance } = useNoleraState()

  function handleDeposit(e: React.FormEvent) {
    e.preventDefault()

    const value = Number(amount)

    if (!value || value <= 0) {
      setMessage("أدخل مبلغًا صحيحًا")
      return
    }

    try {
      deposit(value, "إيداع في الحساب")
      setAmount("")
      setMessage(`تم إيداع $${value.toLocaleString()} بنجاح`)
    } catch {
      setMessage("تعذر تنفيذ عملية الإيداع")
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft size={18} />
          العودة إلى NOLERA X
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Plus size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Add Money</h1>
              <p className="text-sm text-white/40">
                إضافة أموال إلى حساب NOLERA X
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-black/20 p-5">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Wallet size={16} />
              الرصيد الحالي
            </div>

            <p className="mt-2 text-3xl font-bold">
              ${balance.toLocaleString()}
            </p>
          </div>

          <form onSubmit={handleDeposit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/60">
                المبلغ بالدولار
              </label>

              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-lg outline-none focus:border-cyan-400/40"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 py-4 font-bold text-slate-950 hover:bg-cyan-300"
            >
              إضافة الأموال
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-center text-sm text-emerald-300">
              {message}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-white/30">
            نظام NOLERA X — سيتم ربطه بقاعدة البيانات ومزود الدفع لاحقًا.
          </p>
        </div>
      </div>
    </main>
  )
}
