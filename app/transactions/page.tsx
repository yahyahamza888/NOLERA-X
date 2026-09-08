"use client"

import { useNoleraState } from "../../lib/use-nolera-state"

export default function TransactionsPage() {
  const { transactions, balance } = useNoleraState()

  const formatAmount = (amount: number) =>
    amount.toLocaleString("ar-SD")

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "إيداع"
      case "withdraw":
        return "سحب"
      case "transfer":
        return "تحويل"
      case "purchase":
        return "شراء"
      default:
        return "عملية"
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm text-slate-400">NOLERA X</p>
          <h1 className="text-3xl font-bold">سجل العمليات</h1>
          <p className="mt-2 text-slate-400">
            جميع عمليات حسابك المسجلة داخل النظام
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">الرصيد الحالي</p>
          <p className="mt-2 text-3xl font-bold">
            {formatAmount(balance)}
          </p>
        </div>

        <section className="space-y-3">
          {transactions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-lg font-semibold">لا توجد عمليات حتى الآن</p>
              <p className="mt-2 text-sm text-slate-400">
                عند تنفيذ إيداع أو سحب أو تحويل أو شراء ستظهر العملية هنا.
              </p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{tx.title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {getTypeLabel(tx.type)}
                      {tx.meta ? ` • ${tx.meta}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {tx.date}
                    </p>
                  </div>

                  <div className="text-left">
                    <p className="text-lg font-bold">
                      {tx.type === "deposit" ? "+" : "-"}
                      {formatAmount(tx.amount)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {tx.currency} • {tx.status === "completed" ? "مكتملة" : "معلقة"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        <p className="text-center text-xs text-slate-500">
          نظام NOLERA X — السجل المحلي جاهز للربط بقاعدة البيانات لاحقًا.
        </p>
      </div>
    </main>
  )
}
