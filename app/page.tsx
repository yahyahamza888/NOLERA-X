"use client"

import Link from "next/link"
import { ArrowDownUp, WalletCards, Send, PlusCircle, MinusCircle, Store } from "lucide-react"
import { useEffect, useState } from "react"
import { getWallets, getTransactions } from "../lib/nolera-finance"

export default function Home() {
  const [wallets, setWallets] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  async function load() {
    try {
      setWallets(await getWallets())
      setTransactions(await getTransactions(5))
    } catch {}
  }

  useEffect(() => {
    load()
    const h = () => load()
    window.addEventListener("nolera-data-updated", h)
    return () => window.removeEventListener("nolera-data-updated", h)
  }, [])

  const total = wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0)

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black">NOLERA X</h1>
        <p className="mt-2 text-slate-400">منصتك المالية الرقمية</p>

        <div className="mt-8 rounded-3xl bg-emerald-500 p-6 text-slate-950">
          <div className="text-sm">إجمالي الأرصدة الرقمية</div>
          <div className="mt-2 text-4xl font-black">{total.toLocaleString()}</div>
          <div className="mt-1 text-sm">حسب مجموع أرصدة العملات دون تحويل بينها</div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["/wallet","Wallet",WalletCards],
            ["/exchange","Exchange",ArrowDownUp],
            ["/transfers","Transfer",Send],
            ["/store","Store",Store],
            ["/add-money","Add Money",PlusCircle],
            ["/withdraw","Withdraw",MinusCircle],
          ].map(([href,label,Icon]: any) => (
            <Link key={href} href={href} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Icon size={22} className="mb-3 text-emerald-400" />
              <div className="font-bold">{label}</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 text-xl font-bold">آخر العمليات</div>
          {transactions.length === 0 ? (
            <div className="text-slate-500">لا توجد عمليات.</div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="border-b border-white/5 py-4 last:border-0">
                <div className="flex justify-between">
                  <span>{tx.type}</span>
                  <span>{tx.currency || ""}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {tx.reference || tx.id}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
