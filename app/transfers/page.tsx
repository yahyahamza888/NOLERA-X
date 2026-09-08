"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Wallet } from "lucide-react"
import { transfer } from "../../lib/nolera-actions"
import { useNoleraState } from "../../lib/use-nolera-state"

export default function TransfersPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const { balance } = useNoleraState()

  function handleTransfer(e: React.FormEvent) {
    e.preventDefault()

    const value = Number(amount)

    if (!recipient.trim()) {
      setMessage("أدخل اسم المستلم أو حسابه")
      return
    }

    if (!value || value <= 0) {
      setMessage("أدخل مبلغًا صحيحًا")
      return
    }

    try {
      transfer(value, recipient.trim(), "تحويل مالي")
      setRecipient("")
      setAmount("")
      setMessage(`تم تحويل $${value.toLocaleString()} بنجاح`)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "تعذر تنفيذ التحويل"
      )
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-300">
              <Send size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Transfers</h1>
              <p className="text-sm text-white/40">
                تحويل الأموال من حساب NOLERA X
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-black/20 p-5">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Wallet size={16} />
              الرصيد المتاح
            </div>

            <p className="mt-2 text-3xl font-bold">
              ${balance.toLocaleString()}
            </p>
          </div>

          <form onSubmit={handleTransfer} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/60">
                المستلم
              </label>

              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="اسم المستلم أو رقم الحساب"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 outline-none focus:border-lime-400/40"
              />
            </div>

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
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-lg outline-none focus:border-lime-400/40"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-lime-300 py-4 font-bold text-slate-950 hover:bg-lime-200"
            >
              إرسال التحويل
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/70">
              {message}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-white/30">
            نظام NOLERA X — سيتم ربطه بقاعدة البيانات وخدمة التحويل لاحقًا.
          </p>
        </div>
      </div>
    </main>
  )
}
