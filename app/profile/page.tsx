"use client"

import { useState } from "react"
import Link from "next/link"
import { updateCurrentUser } from "../../lib/nolera-auth"
import { useNoleraAuth } from "../../lib/use-nolera-auth"

export default function ProfilePage() {
  const { user } = useNoleraAuth()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  if (!user) {
    return (
      <main dir="rtl" className="p-6 text-center">
        <Link href="/login">سجل الدخول أولًا</Link>
      </main>
    )
  }

  function save() {
    try {
      updateCurrentUser({ name, phone })
      setMessage("تم حفظ بيانات الملف الشخصي.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ.")
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-100 p-5">
      <div className="mx-auto max-w-xl rounded-[28px] bg-white p-7 shadow">
        <Link href="/account" className="text-sm font-bold text-slate-500">
          ← الحساب
        </Link>

        <h1 className="mt-5 text-3xl font-black">الملف الشخصي 👤</h1>

        <p className="mt-5 text-sm text-slate-500">{user.email}</p>

        <input
          className="mt-5 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          placeholder={user.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          placeholder={user.phone || "رقم الهاتف"}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={save}
          className="mt-5 w-full rounded-2xl bg-slate-950 py-4 font-black text-white"
        >
          حفظ التغييرات
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-bold text-green-600">
            {message}
          </p>
        )}
      </div>
    </main>
  )
}
