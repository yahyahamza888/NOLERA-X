"use client"

import { useState } from "react"

const markets = [
  ["Pi Network", "PI", "0.25"],
  ["Bitcoin", "BTC", "111500"],
  ["Ethereum", "ETH", "4300"],
  ["USD", "USD", "3500"],
]

export default function MarketsPage() {
  const [search, setSearch] = useState("")

  const filtered = markets.filter((m) =>
    `${m[0]} ${m[1]}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">الأسواق</h1>
        <p className="mt-2 text-slate-500">متابعة الأصول والأسعار</p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن أصل..."
          className="mt-6 w-full rounded-xl border bg-white p-4"
        />

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          {filtered.map((m) => (
            <div
              key={m[1]}
              className="flex items-center justify-between border-b p-5 last:border-0"
            >
              <div>
                <div className="font-bold">{m[0]}</div>
                <div className="text-sm text-slate-500">{m[1]}</div>
              </div>
              <div className="font-bold">{Number(m[2]).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-400">
          الأسعار الحالية هنا تجريبية، وسيتم ربط البيانات الحقيقية لاحقًا.
        </p>
      </div>
    </main>
  )
}
