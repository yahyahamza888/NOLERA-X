"use client"

import Link from "next/link"
import { ArrowLeft, Repeat2 } from "lucide-react"
import { useState } from "react"

const assets = ["Pi", "BTC", "ETH", "USDT"]

export default function SwapPage() {
  const [from, setFrom] = useState("Pi")
  const [to, setTo] = useState("USDT")
  const [amount, setAmount] = useState("")

  function reverseAssets() {
    setFrom(to)
    setTo(from)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/account"
          className="flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          الحساب
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-500/20 p-3">
              <Repeat2 className="text-purple-400" size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Swap</h1>
              <p className="mt-1 text-sm text-slate-400">
                مبادلة الأصول الرقمية
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                من
              </label>

              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 outline-none"
              >
                {assets.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={reverseAssets}
              className="mx-auto rounded-full border border-white/10 bg-white/10 p-3 hover:bg-white/20"
              aria-label="تبديل العملات"
            >
              <Repeat2 size={20} />
            </button>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                إلى
              </label>

              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 outline-none"
              >
                {assets.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                المبلغ
              </label>

              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل المبلغ"
                className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 outline-none"
              />
            </div>

            <button
              type="button"
              disabled
              className="mt-2 rounded-2xl bg-purple-500/40 p-4 font-bold text-white"
            >
              Swap — الربط الحقيقي قريبًا
            </button>

            <div className="rounded-2xl border border-purple-400/10 bg-purple-400/5 p-4 text-sm leading-7 text-slate-400">
              Swap منفصل عن Exchange.
              <br />
              Exchange لتحويل العملات داخل NOLERA X.
              <br />
              Swap لمبادلة الأصول الرقمية، وسيتم ربطه لاحقًا
              بشبكات Blockchain وDEX حقيقية.
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
