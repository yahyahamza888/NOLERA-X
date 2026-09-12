"use client"

import Link from "next/link"
import { ArrowLeft, RefreshCw, WalletCards } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"

type Wallet = {
  id: string
  currency: string
  balance: number
}

const currencies = ["SDG", "USD", "Pi", "BTC", "ETH", "USDT"]

export default function WalletPage() {
  const supabase = getSupabaseClient()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadWallets() {
    setLoading(true)
    setError("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("يجب تسجيل الدخول أولًا.")
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("wallets")
      .select("id, currency, balance")
      .eq("user_id", user.id)
      .order("currency")

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setWallets(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadWallets()

    const handler = () => loadWallets()
    window.addEventListener("nolera-data-updated", handler)
    window.addEventListener("nolera-auth-updated", handler)

    return () => {
      window.removeEventListener("nolera-data-updated", handler)
      window.removeEventListener("nolera-auth-updated", handler)
    }
  }, [])

  const balance = (currency: string) =>
    Number(wallets.find((w) => w.currency === currency)?.balance || 0)

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/account"
            className="flex items-center gap-2 text-sm text-slate-300"
          >
            <ArrowLeft size={18} />
            الحساب
          </Link>

          <button
            onClick={loadWallets}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-2xl bg-emerald-500/20 p-4">
            <WalletCards className="text-emerald-400" size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">NOLERA X Wallet</h1>
            <p className="text-slate-400">
              أرصدتك الحقيقية المخزنة في قاعدة بيانات NOLERA X
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
            جاري تحميل الأرصدة...
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currencies.map((currency) => (
              <div
                key={currency}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-lg font-semibold">{currency}</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    Wallet
                  </span>
                </div>

                <div className="text-3xl font-bold">
                  {balance(currency).toLocaleString(undefined, {
                    maximumFractionDigits: 8,
                  })}
                </div>

                <div className="mt-2 text-sm text-slate-500">
                  {currency}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link
            href="/exchange"
            className="rounded-2xl bg-emerald-500 p-4 text-center font-bold text-slate-950"
          >
            Exchange
          </Link>

          <Link
            href="/transactions"
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center font-semibold"
          >
            Transactions
          </Link>

          <Link
            href="/transfers"
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center font-semibold"
          >
            Transfer
          </Link>
        </div>
      </div>
    </main>
  )
}
