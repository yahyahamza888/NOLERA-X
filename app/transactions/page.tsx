"use client"

import Link from "next/link"
import { ArrowLeft, ArrowDownUp, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"

type Transaction = {
  id: string
  type: string
  status: string
  recipient: string | null
  reference: string | null
  metadata: any
  currency: string | null
  created_at?: string
}

export default function TransactionsPage() {
  const supabase = getSupabaseClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadTransactions() {
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
      .from("transactions")
      .select(
        "id, type, status, recipient, reference, metadata, currency, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setTransactions(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadTransactions()

    const handler = () => loadTransactions()
    window.addEventListener("nolera-data-updated", handler)

    return () =>
      window.removeEventListener("nolera-data-updated", handler)
  }, [])

  function title(tx: Transaction) {
    if (tx.type === "exchange") {
      const from = tx.metadata?.from_currency || tx.currency || ""
      const to = tx.metadata?.to_currency || tx.recipient || ""
      return `Exchange ${from} → ${to}`
    }

    return tx.type || "Transaction"
  }

  function amount(tx: Transaction) {
    if (tx.type === "exchange") {
      return `${tx.metadata?.from_amount ?? ""} ${tx.metadata?.from_currency ?? tx.currency ?? ""}`
    }

    return tx.currency || ""
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/account"
            className="flex items-center gap-2 text-sm text-slate-300"
          >
            <ArrowLeft size={18} />
            الحساب
          </Link>

          <button
            onClick={loadTransactions}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-2xl bg-blue-500/20 p-4">
            <ArrowDownUp className="text-blue-400" size={30} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-slate-400">
              سجل العمليات الحقيقي من قاعدة بيانات NOLERA X
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
            جاري تحميل العمليات...
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
            لا توجد عمليات حتى الآن.
          </div>
        )}

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">{title(tx)}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {tx.reference || tx.id}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">{amount(tx)}</div>
                  <div
                    className={
                      tx.status === "completed"
                        ? "mt-1 text-xs text-emerald-400"
                        : "mt-1 text-xs text-yellow-400"
                    }
                  >
                    {tx.status}
                  </div>
                </div>
              </div>

              {tx.metadata?.rate && (
                <div className="mt-3 text-xs text-slate-500">
                  Rate: {tx.metadata.rate}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
