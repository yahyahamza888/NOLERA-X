"use client"

import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    if (!name || !email || !password) {
      setMessage("يرجى إكمال جميع البيانات")
      return
    }

    if (password.length < 6) {
      setMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      return
    }

    setMessage("تم إنشاء الحساب بنجاح — وضع تجريبي")
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-black text-slate-950">
            N
          </div>

          <h1 className="text-3xl font-bold">NOLERA X</h1>
          <p className="mt-2 text-sm text-slate-400">
            إنشاء حساب جديد
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 أحرف على الأقل"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-white py-3 font-bold text-slate-950 transition hover:bg-slate-200"
          >
            إنشاء الحساب
          </button>
        </form>

        {message && (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-center text-sm text-slate-300">
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-semibold text-white">
            تسجيل الدخول
          </Link>
        </p>

        <Link
          href="/"
          className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-300"
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </main>
  )
}
