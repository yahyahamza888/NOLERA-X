"use client"

import { useState } from "react"
import { withdraw as withdrawMoney } from "../../lib/nolera-actions"
import { useNoleraState } from "../../lib/use-nolera-state"

export default function WithdrawPage() {
  const [amount, setAmount] = useState("")
  const [destination, setDestination] = useState("")
  const [message, setMessage] = useState("")
  const { balance } = useNoleraState()

  const handleWithdraw = () => {
    const value = Number(amount)

    if (!value || value <= 0 || !destination.trim()) {
      setMessage("أدخل المبلغ وبيانات جهة السحب.")
      return
    }

    try {
      withdrawMoney(value, `سحب إلى ${destination}`)
      setAmount("")
      setDestination("")
      setMessage(`تم تنفيذ سحب $${value.toLocaleString()} بنجاح.`)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "تعذر تنفيذ عملية السحب."
      )
    }
  }

  return (
    <main className="min-h-screen bg-[#05070b] text-white p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Withdraw</h1>
        <p className="mt-2 text-white/60">سحب الأموال من NOLERA X</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/50">الرصيد المتاح</p>
          <p className="mt-2 text-3xl font-bold">
            ${balance.toLocaleString()}
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <label className="text-sm text-white/60">المبلغ</label>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none"
          />

          <label className="mt-5 block text-sm text-white/60">
            الحساب / المحفظة
          </label>

          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="أدخل الحساب أو المحفظة"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none"
          />

          <button
            onClick={handleWithdraw}
            className="mt-5 w-full rounded-2xl bg-lime-300 px-5 py-4 font-bold text-black"
          >
            سحب الأموال
          </button>

          {message && (
            <div className="mt-4 rounded-2xl bg-lime-300/10 p-4 text-lime-200">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
