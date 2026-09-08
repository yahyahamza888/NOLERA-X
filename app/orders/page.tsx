"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getMyOrders } from "../../lib/nolera-store"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  async function refresh() {
    try {
      setLoading(true)
      setOrders(await getMyOrders())
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر تحميل الطلبات."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 p-6"
    >
      <div className="mx-auto max-w-4xl">

        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">
              📦 طلباتي
            </h1>

            <p className="mt-2 text-slate-500">
              الطلبات محفوظة الآن في Supabase.
            </p>
          </div>

          <Link
            href="/store"
            className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white"
          >
            المتجر
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            جاري تحميل الطلبات...
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">

                  <div>
                    <p className="text-xs text-slate-400">
                      رقم الطلب
                    </p>

                    <h2 className="mt-1 font-black">
                      {order.reference || order.id}
                    </h2>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {order.status}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  {(order.order_items || []).map(
                    (item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between rounded-xl bg-slate-50 p-3"
                      >
                        <span>
                          {item.product_name} × {item.quantity}
                        </span>

                        <strong>
                          {Number(item.total).toLocaleString()}{" "}
                          {order.currency}
                        </strong>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-5 flex justify-between border-t pt-4">
                  <span className="text-slate-500">
                    الإجمالي
                  </span>

                  <strong>
                    {Number(order.total).toLocaleString()}{" "}
                    {order.currency}
                  </strong>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {new Date(order.created_at).toLocaleString(
                    "ar-SD"
                  )}
                </p>
              </div>
            ))}

            {!orders.length && (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <div className="text-5xl">📦</div>

                <h2 className="mt-4 font-bold">
                  لا توجد طلبات حتى الآن
                </h2>

                <p className="mt-2 text-slate-500">
                  عندما تشتري من متجر NOLERA X سيظهر الطلب هنا.
                </p>
              </div>
            )}
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}
