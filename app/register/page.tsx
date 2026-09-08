"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerUser } from "../../lib/nolera-auth"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  function submit() {
    try {
      registerUser(name, email, phone, password)
      router.push("/account")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ.")
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-100 p-5">
      <div className="mx-auto mt-8 max-w-md rounded-[28px] bg-white p-7 shadow-xl">
        <p className="text-sm font-bold text-slate-400">NOLERA X</p>
        <h1 className="mt-2 text-3xl font-black">إنشاء حساب 👤</h1>

        <input
          className="mt-7 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          placeholder="الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          placeholder="رقم الهاتف"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
          إنشاء الحساب
        </button>

        {message && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-center text-sm font-bold text-red-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          لديك حساب؟
          <Link href="/login" className="mr-2 font-black text-slate-950">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </main>
  )
}
