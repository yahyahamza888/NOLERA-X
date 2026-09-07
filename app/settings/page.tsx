"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [language, setLanguage] = useState("العربية");

  return (
    <main className="min-h-screen bg-[#05070b] text-white p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-white/60">
          تخصيص إعدادات حسابك في NOLERA X
        </p>

        <div className="mt-8 space-y-4">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-bold">General</h2>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p>اللغة</p>
                <p className="mt-1 text-sm text-white/40">
                  اختر لغة واجهة NOLERA X
                </p>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 outline-none"
              >
                <option>العربية</option>
                <option>English</option>
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-bold">Notifications</h2>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p>إشعارات الحساب</p>
                <p className="mt-1 text-sm text-white/40">
                  إشعارات التحويلات والعمليات المهمة.
                </p>
              </div>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`rounded-full px-5 py-2 font-semibold ${
                  notifications
                    ? "bg-cyan-400 text-black"
                    : "bg-white/10 text-white"
                }`}
              >
                {notifications ? "مفعّل" : "متوقف"}
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
              <div>
                <p>العروض والتحديثات</p>
                <p className="mt-1 text-sm text-white/40">
                  استقبال الأخبار والعروض من NOLERA X.
                </p>
              </div>

              <button
                onClick={() => setMarketing(!marketing)}
                className={`rounded-full px-5 py-2 font-semibold ${
                  marketing
                    ? "bg-emerald-400 text-black"
                    : "bg-white/10 text-white"
                }`}
              >
                {marketing ? "مفعّل" : "متوقف"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-red-300/10 bg-red-300/5 p-6">
            <h2 className="font-bold text-red-200">Danger Zone</h2>
            <p className="mt-2 text-sm text-white/50">
              خيارات حذف الحساب أو تعطيله ستتم إضافتها بعد بناء نظام الحسابات
              الحقيقي.
            </p>

            <button
              disabled
              className="mt-5 rounded-xl border border-red-300/20 px-5 py-3 text-red-200/40"
            >
              حذف الحساب
            </button>
          </div>

        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/40">
          إعدادات النسخة الحالية تجريبية وسيتم حفظها بشكل دائم بعد ربط قاعدة
          البيانات.
        </div>
      </div>
    </main>
  );
}
