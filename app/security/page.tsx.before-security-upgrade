"use client"

import { useState } from "react"
import Link from "next/link"
import { changePassword } from "../../lib/nolera-auth"
import { useNoleraAuth } from "../../lib/use-nolera-auth"

export default function SecurityPage() {
  const { user } = useNoleraAuth()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")

  if (!user) {
    return (
      <main dir="rtl" className="p-6 text-center">
        <Link href="/login">سجل الدخول أولًا</Link>
      </main>
    )
  }

  function savePassword() {
    try {
      changePassword(oldPassword, newPassword)
      setOldPassword("")
      setNewPassword("")
      setMessage("تم تغيير كلمة المرور بنجاح.")
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

        <h1 className="mt-5 text-3xl font-black">أمان الحساب 🛡️</h1>

        <div className="mt-6 rounded-2xl bg-green-50 p-5">
          <p className="font-black text-green-700">الحساب نشط</p>
          <p className="mt-1 text-sm text-green-600">
            يمكنك تغيير كلمة المرور من هنا.
          </p>
        </div>

        <input
          className="mt-6 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          type="password"
          placeholder="كلمة المرور الحالية"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl bg-slate-100 p-4 outline-none"
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={savePassword}
          className="mt-5 w-full rounded-2xl bg-slate-950 py-4 font-black text-white"
        >
          تغيير كلمة المرور
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
