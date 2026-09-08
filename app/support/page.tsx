"use client"

import { useState } from "react"

export default function SupportPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  function send() {
    if (!subject.trim() || !message.trim()) return

    localStorage.setItem(
      "nolera_x_support_last",
      JSON.stringify({
        subject,
        message,
        date: new Date().toLocaleString("ar-SD"),
      })
    )

    setSent(true)
    setSubject("")
    setMessage("")
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">🎧 الدعم والمساعدة</h1>
        <p className="mt-2 text-slate-500">
          تواصل مع فريق NOLERA X وأرسل استفسارك.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <div className="text-3xl">💬</div>
            <p className="mt-3 font-bold">المحادثة</p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <div className="text-3xl">❓</div>
            <p className="mt-3 font-bold">الأسئلة الشائعة</p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <div className="text-3xl">🛡️</div>
            <p className="mt-3 font-bold">مشكلة أمنية</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="عنوان الطلب"
            className="w-full rounded-xl border p-4"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك..."
            className="mt-4 min-h-40 w-full rounded-xl border p-4"
          />

          <button
            onClick={send}
            className="mt-4 w-full rounded-xl bg-slate-900 p-4 font-bold text-white"
          >
            إرسال الطلب
          </button>

          {sent && (
            <p className="mt-4 rounded-xl bg-slate-100 p-4 text-center font-semibold">
              ✅ تم تسجيل طلب الدعم.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
