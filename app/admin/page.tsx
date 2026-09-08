"use client"

import { useNoleraState } from "@/lib/use-nolera-state"
import { getDigitalProducts } from "@/lib/nolera-products"
import { useEffect, useState } from "react"

export default function AdminPage() {
  const { balance, transactions } = useNoleraState()
  const [products, setProducts] = useState(0)

  useEffect(() => {
    setProducts(getDigitalProducts().length)
  }, [])

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">🛠️ لوحة إدارة NOLERA X</h1>
        <p className="mt-2 text-slate-500">لوحة تحكم تجريبية للنظام.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-500">الرصيد المحلي</p>
            <p className="mt-2 text-2xl font-bold">
              {balance.toLocaleString()} SDG
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-500">المعاملات</p>
            <p className="mt-2 text-2xl font-bold">{transactions.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-500">المنتجات المنشورة</p>
            <p className="mt-2 text-2xl font-bold">{products}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">آخر العمليات</h2>

          <div className="mt-4 space-y-3">
            {transactions.slice(0, 10).map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between rounded-xl bg-slate-50 p-4"
              >
                <span>{tx.title}</span>
                <span>{tx.amount.toLocaleString()} {tx.currency}</span>
              </div>
            ))}

            {!transactions.length && (
              <p className="text-slate-500">لا توجد معاملات حتى الآن.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
