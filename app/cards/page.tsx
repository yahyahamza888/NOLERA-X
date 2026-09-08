"use client"

import { useState } from "react"

export default function CardsPage() {
  const [frozen, setFrozen] = useState(false)

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">البطاقات</h1>
        <p className="mt-2 text-slate-500">إدارة بطاقات NOLERA X</p>

        <div className="mt-8 rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
          <p className="text-sm opacity-70">NOLERA X</p>
          <p className="mt-10 text-2xl tracking-[0.3em]">•••• •••• •••• 4821</p>
          <div className="mt-8 flex justify-between">
            <span>YAHYA</span>
            <span>12/30</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <button
            onClick={() => setFrozen(!frozen)}
            className="w-full rounded-xl bg-slate-900 p-4 font-bold text-white"
          >
            {frozen ? "🔓 إلغاء تجميد البطاقة" : "🔒 تجميد البطاقة"}
          </button>
          <p className="mt-4 text-center text-slate-500">
            الحالة: {frozen ? "مجمدة" : "نشطة"}
          </p>
        </div>
      </div>
    </main>
  )
}
