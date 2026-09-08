"use client"

import { useState } from "react"
import Link from "next/link"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState("العربية")

  return (
    <main dir="rtl" className="min-h-screen bg-slate-100 p-5">
      <div className="mx-auto max-w-xl rounded-[28px] bg-white p-7 shadow">
        <Link href="/account" className="text-sm font-bold text-slate-500">
          ← الحساب
        </Link>

        <h1 className="mt-5 text-3xl font-black">الإعدادات ⚙️</h1>

        <div className="mt-7 rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black">الإشعارات</h2>
              <p className="mt-1 text-sm text-slate-500">
                تنبيهات الحساب والمعاملات
              </p>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`rounded-full px-5 py-2 font-black ${
                notifications
                  ? "bg-green-600 text-white"
                  : "bg-slate-200"
              }`}
            >
              {notifications ? "مفعلة" : "متوقفة"}
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-5">
          <h2 className="font-black">لغة التطبيق</h2>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-3 w-full rounded-2xl bg-white p-4 outline-none"
          >
            <option>العربية</option>
            <option>English</option>
          </select>
        </div>
      </div>
    </main>
  )
}
