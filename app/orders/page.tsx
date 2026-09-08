"use client"

import { useNoleraState } from "@/lib/use-nolera-state"

export default function OrdersPage() {
  const { transactions } = useNoleraState()

  const purchases = transactions.filter((tx) => tx.type === "purchase")

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">📦 طلباتي</h1>
        <p className="mt-2 text-slate-500">
          سجل المنتجات والخدمات التي تم شراؤها.
        </p>

        <div className="mt-8 space-y-4">
          {purchases.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold">{item.title}</h2>
                  {item.meta && (
                    <p className="mt-1 text-sm text-slate-500">
                      البائع: {item.meta}
                    </p>
                  )}
                </div>

                <span className="font-bold">
                  {item.amount.toLocaleString()} {item.currency}
                </span>
              </div>

              <div className="mt-4 flex justify-between text-xs text-slate-400">
                <span>مكتمل</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}

          {!purchases.length && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">📦</div>
              <h2 className="mt-4 font-bold">لا توجد طلبات حتى الآن</h2>
              <p className="mt-2 text-slate-500">
                عندما تشتري من متجر NOLERA X ستظهر طلباتك هنا.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
