"use client"

import { useState } from "react"

export default function AIPage() {
  const [message, setMessage] = useState("")
  const [answer, setAnswer] = useState("")

  function ask() {
    if (!message.trim()) return

    setAnswer(
      "أنا NOLERA AI. هذه نسخة تجريبية حاليًا، وسنربطني بمحرك ذكاء اصطناعي حقيقي في المرحلة القادمة."
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">🤖 NOLERA AI</h1>
        <p className="mt-2 text-slate-400">
          مساعدك الذكي داخل منظومة NOLERA X
        </p>

        <div className="mt-8 rounded-3xl bg-slate-900 p-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب سؤالك..."
            className="min-h-40 w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white"
          />

          <button
            onClick={ask}
            className="mt-4 w-full rounded-xl bg-white p-4 font-bold text-slate-900"
          >
            اسأل NOLERA AI
          </button>

          {answer && (
            <div className="mt-6 rounded-2xl bg-slate-800 p-5 leading-8">
              {answer}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
