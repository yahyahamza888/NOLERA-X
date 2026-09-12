"use client"

import { useState } from "react"

const bills = [
  { id: "electricity", title: "الكهرباء", icon: "⚡" },
  { id: "water", title: "المياه", icon: "💧" },
  { id: "internet", title: "الإنترنت", icon: "🌐" },
  { id: "phone", title: "الهاتف", icon: "📱" },
]

export default function BillsPage() {const [selected, setSelected] = useState("")
  const [amount, setAmount] = useState("")
  const [account, setAccount] = useState("")
  const [message, setMessage] = useState("")

  function payBill() {
    try {
      const value = Number(amount)

      if (!selected || !account.trim() || !Number.isFinite(value) || value <= 0) {
        throw new Error("أكمل بيانات الفاتورة.")
      }

      (() => { throw new Error("دفع الفواتير يحتاج إلى Billing/Payment API آمن. لم يتم خصم أي رصيد."); })()
      setMessage("✅ تمت عملية السداد بنجاح.")
      setAmount("")
      setAccount("")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ.")
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">دفع الفواتير</h1>
        <p className="mt-2 text-slate-500">الرصيد الحالي: {0 .toLocaleString()} SDG</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {bills.map((bill) => (
            <button
              key={bill.id}
              onClick={() => setSelected(bill.id)}
              className={`rounded-2xl border bg-white p-5 text-right shadow-sm ${
                selected === bill.id ? "border-slate-900" : "border-slate-200"
              }`}
            >
              <div className="text-3xl">{bill.icon}</div>
              <div className="mt-3 font-bold">{bill.title}</div>
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="رقم الحساب / الهاتف"
            className="mb-4 w-full rounded-xl border p-4"
          />

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="المبلغ"
            className="mb-4 w-full rounded-xl border p-4"
          />

          <button
            onClick={payBill}
            className="w-full rounded-xl bg-slate-900 p-4 font-bold text-white"
          >
            دفع الفاتورة
          </button>

          {message && <p className="mt-4 text-center font-semibold">{message}</p>}
        </div>
      </div>
    </main>
  )
}
