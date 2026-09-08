"use client"

import { useState } from "react"

export default function VerificationPage() {
  const [status, setStatus] = useState("غير موثق")

  function submit() {
    setStatus("قيد المراجعة")
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">التحقق من الهوية</h1>
        <p className="mt-2 text-slate-500">
          أكمل بيانات التحقق لاستخدام الخدمات المالية المتقدمة.
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5">
          <p className="font-bold">الحالة</p>
          <p className="mt-2">{status}</p>
        </div>

        <input
          placeholder="الاسم الكامل"
          className="mt-6 w-full rounded-xl border p-4"
        />

        <input
          placeholder="رقم الهوية"
          className="mt-4 w-full rounded-xl border p-4"
        />

        <button
          onClick={submit}
          className="mt-6 w-full rounded-xl bg-slate-900 p-4 font-bold text-white"
        >
          إرسال للمراجعة
        </button>
      </div>
    </main>
  )
}
