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
  const [loading, setLoading] = useState(false)

  async function submit() {
    setMessage("")
    setLoading(true)

    try {
      await loginUser(email, password)
      router.push("/account")
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fffaff] p-5">
      <div className="mx-auto mt-12 w-full max-w-md rounded-[28px] bg-white p-7 shadow-xl">
        <p className="text-sm font-bold text-slate-400">NOLERA X</p>
        <h1 className="mt-2 text-3xl font-black">تسجيل الدخول 🔐</h1>

        <input
          className="mt-7 w-full rounded-2xl bg-[#fffaff] p-4 outline-none"
          placeholder="البريد الإلكتروني"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl bg-[#fffaff] p-4 outline-none"
          placeholder="كلمة المرور"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-[#9b6bd3] py-4 font-black text-white disabled:opacity-50"
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>

        <Link
          href="/register"
          className="mt-3 block w-full rounded-2xl border border-purple-200 bg-[#f7efff] py-4 text-center font-black text-[#9b6bd3]"
        >
          إنشاء حساب جديد
        </Link>

        <div className="mt-5 rounded-2xl border border-purple-100 bg-[#fffaff] p-3">
          <p className="mb-3 text-center text-xs font-bold text-slate-400">
            أو الدخول باستخدام
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => alert("سيتم تفعيل Google بعد إعداد مزود Google في Supabase.")}
              className="rounded-xl border border-purple-100 bg-white py-3 font-black text-[#6f4b86]"
            >
              Google
            </button>

            <button
              type="button"
              onClick={() => alert("سيتم تفعيل Apple بعد إعداد مزود Apple في Supabase.")}
              className="rounded-xl border border-purple-100 bg-white py-3 font-black text-[#6f4b86]"
            >
              Apple
            </button>
          </div>
        </div>

        {message && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-center text-sm font-bold text-red-600">
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-slate-500">
          NOLERA X — دخول آمن
        </p>
      </div>
    </main>
  )
}
