"use client"

import Link from "next/link"
import { ArrowLeft, ArrowDownUp } from "lucide-react"

const assets = [
  ["Pi","Pi Network","Digital Asset"],
  ["BTC","Bitcoin","Digital Asset"],
  ["ETH","Ethereum","Digital Asset"],
  ["USDT","Tether","Stablecoin"],
]

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/account" className="flex items-center gap-2 text-slate-300">
          <ArrowLeft size={18}/> الحساب
        </Link>

        <h1 className="mt-8 text-3xl font-bold">Markets</h1>
        <p className="mt-2 text-slate-400">الأصول الرقمية المتاحة داخل NOLERA X</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {assets.map(([symbol,name,type]) => (
            <div key={symbol} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">{symbol}</div>
                  <div className="text-sm text-slate-400">{name}</div>
                </div>
                <ArrowDownUp className="text-emerald-400"/>
              </div>
              <div className="mt-5 text-xs text-slate-500">{type}</div>
              <Link href="/exchange" className="mt-4 block rounded-xl bg-white/10 p-3 text-center">
                Exchange
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
