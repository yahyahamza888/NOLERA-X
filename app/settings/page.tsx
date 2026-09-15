"use client"

import { useState } from "react"
import Link from "next/link"
import { useNoleraLanguage } from "@/components/NoleraLanguageProvider"

export default function SettingsPage() {
  const { language, setLanguage } = useNoleraLanguage()
  const [notifications, setNotifications] = useState(true)

  const ar = language === "ar"

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-100 p-5"
    >
      <div className="mx-auto max-w-xl rounded-[28px] bg-white p-7 shadow">
        <Link
          href="/account"
          className="text-sm font-bold text-slate-500"
        >
          {ar ? "← الحساب" : "← Account"}
        </Link>

        <h1 className="mt-5 text-3xl font-black">
          {ar ? "الإعدادات ⚙️" : "Settings ⚙️"}
        </h1>

        <div className="mt-7 rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-black">
                {ar ? "الإشعارات" : "Notifications"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {ar
                  ? "تنبيهات الحساب والمعاملات"
                  : "Account and transaction alerts"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`rounded-full px-5 py-2 font-black ${
                notifications
                  ? "bg-green-600 text-white"
                  : "bg-slate-200"
              }`}
            >
              {notifications
                ? ar
                  ? "مفعلة"
                  : "Enabled"
                : ar
                  ? "متوقفة"
                  : "Disabled"}
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-5">
          <h2 className="font-black">
            {ar ? "لغة التطبيق" : "App Language"}
          </h2>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value === "ar" ? "ar" : "en")
            }
            className="mt-3 w-full rounded-2xl bg-white p-4 outline-none"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>

          <p className="mt-3 text-xs font-bold text-slate-400">
            {ar
              ? "سيتم تطبيق اللغة على واجهة NOLERA X."
              : "The selected language applies to the NOLERA X interface."}
          </p>
        </div>
      </div>
    </main>
  )
}
