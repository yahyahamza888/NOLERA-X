"use client"

import Link from "next/link"
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, Send } from "lucide-react"
import { getTransactions, financeState } from "../../lib/finance"

export default function TransactionsPage() {
  const transactions = getTransactions()

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft size={18} />
          العودة إلى NOLERA X
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="mt-2 text-white/40">
            سجل العمليات المالية في حساب NOLERA X
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/40">الرصيد الحالي</p>
          <p className="mt-2 text-3xl font-bold">
            ${financeState.balance.toLocaleString()}
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-white/60">لا توجد عمليات بعد</p>
            <p className="mt-2 text-sm text-white/30">
              عند إجراء إيداع أو سحب أو تحويل ستظهر العملية هنا.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const isDeposit = transaction.type === "deposit"
              const isWithdraw = transaction.type === "withdraw"

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                      {isDeposit ? (
                        <ArrowDownToLine size={22} />
                      ) : isWithdraw ? (
                        <ArrowUpFromLine size={22} />
                      ) : (
                        <Send size={22} />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {transaction.description}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        {new Date(transaction.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      {isDeposit ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {transaction.status === "completed"
                        ? "مكتملة"
                        : "قيد التنفيذ"}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-white/30">
          وضع تجريبي — سجل العمليات محفوظ مؤقتًا داخل النظام.
        </p>
      </div>
    </main>
  )
}
