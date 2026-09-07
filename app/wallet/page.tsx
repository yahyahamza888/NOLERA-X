"use client"

import { useState } from "react"
import Link from "next/link"
import { demoAccount, connectWallet, disconnectWallet } from "../../lib/account"
import { Wallet, Copy, CheckCircle2, ArrowLeft, Link2, ShieldCheck } from "lucide-react"

export default function WalletPage() {
  const [connected, setConnected] = useState(demoAccount.walletConnected)
  const [copied, setCopied] = useState("")

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(address)
    setTimeout(() => setCopied(""), 1500)
  }

  const handleWallet = () => {
    if (connected) {
      disconnectWallet()
      setConnected(false)
    } else {
      connectWallet()
      setConnected(true)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft size={18} />
          العودة إلى NOLERA X
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <Wallet size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">NOLERA Wallet</h1>
                <p className="text-sm text-white/45">
                  محفظتك الرقمية اللامركزية
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleWallet}
            className={`rounded-xl px-5 py-3 font-semibold ${
              connected
                ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "bg-cyan-400 text-slate-950"
            }`}
          >
            {connected ? "المحفظة متصلة ✓" : "ربط المحفظة"}
          </button>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-300" size={22} />
            <div>
              <h2 className="font-semibold">الحساب المالي</h2>
              <p className="text-sm text-white/45">
                الحساب المركزي واللامركزي في واجهة واحدة
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-black/20 p-5">
              <p className="text-sm text-white/40">الرصيد المركزي</p>
              <p className="mt-2 text-3xl font-bold">
                ${demoAccount.fiatBalance.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-white/30">
                {demoAccount.currency}
              </p>
            </div>

            <div className="rounded-2xl bg-black/20 p-5">
              <p className="text-sm text-white/40">حالة Web3</p>
              <p className="mt-2 text-xl font-bold">
                {connected ? "Connected" : "Not Connected"}
              </p>
              <p className="mt-1 text-xs text-white/30">
                بيانات تجريبية — لا توجد معاملة حقيقية
              </p>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-semibold">الأصول الرقمية</h2>

        <div className="grid gap-4">
          {demoAccount.assets.map((asset) => (
            <div
              key={asset.symbol}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 font-bold">
                      {asset.symbol.slice(0, 1)}
                    </div>

                    <div>
                      <h3 className="font-semibold">{asset.name}</h3>
                      <p className="text-xs text-white/40">
                        {asset.symbol} • {asset.network}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    {asset.balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-white/40">{asset.symbol}</p>
                </div>
              </div>

              {asset.address && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-black/20 p-3 text-xs text-white/50">
                  <Link2 size={15} />
                  <span className="flex-1 truncate">{asset.address}</span>
                  <button onClick={() => copyAddress(asset.address!)}>
                    {copied === asset.address ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
