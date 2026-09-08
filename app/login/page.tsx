"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginUser } from "../../lib/nolera-auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  function submit() {
    try {
      loginUser(email, password)
      router.push("/account")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ.")
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-100 p-5">
      <div className="mx-auto mt-12 max-w-md rounded-[28px] bg-white p-7 shadow-xl">
        <p className="text-sm font-bold text-slate-400">NOLERA X</p>
        <h1 className="mt-2 text-3xl font-black">تسجيل الدخول 🔐</h1>

        <input
          className="mt-7 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          placeholder="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="mt-5 w-full rounded-2xl bg-slate-950 py-4 font-black text-white"
        >
          دخول
        </button>

        {message && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-center text-sm font-bold text-red-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          ليس لديك حساب؟
          <Link href="/register" className="mr-2 font-black text-slate-950">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </main>
  )
}
