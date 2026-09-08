"use client"

import { useEffect, useState } from "react"
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NoleraNotification,
} from "@/lib/nolera-notifications"

export default function NotificationsPage() {
  const [items, setItems] = useState<NoleraNotification[]>([])

  function refresh() {
    setItems(getNotifications())
  }

  useEffect(() => {
    refresh()

    const handler = () => refresh()
    window.addEventListener("nolera-notifications-updated", handler)

    return () =>
      window.removeEventListener("nolera-notifications-updated", handler)
  }, [])

  const unread = items.filter((item) => !item.read).length

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              🔔 الإشعارات
            </h1>
            <p className="mt-2 text-slate-500">
              لديك {unread} إشعار غير مقروء
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => {
                markAllNotificationsRead()
                refresh()
              }}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
            >
              قراءة الكل
            </button>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                markNotificationRead(item.id)
                refresh()
              }}
              className={`w-full rounded-2xl border p-5 text-right shadow-sm ${
                item.read
                  ? "border-slate-200 bg-white"
                  : "border-slate-900 bg-white"
              }`}
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="mt-2 text-slate-600">{item.message}</p>
                </div>

                <span className="text-xl">
                  {item.type === "success"
                    ? "✅"
                    : item.type === "warning"
                    ? "⚠️"
                    : "ℹ️"}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-400">{item.date}</p>
            </button>
          ))}

          {!items.length && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">🔔</div>
              <h2 className="mt-4 font-bold">لا توجد إشعارات</h2>
              <p className="mt-2 text-slate-500">
                ستظهر هنا تنبيهات الحساب والعمليات.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
