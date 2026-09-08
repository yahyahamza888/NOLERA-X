"use client"

import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"

export default function VerificationPage() {
  const supabase = getSupabaseClient()
  const [verification, setVerification] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setError("يجب تسجيل الدخول.")
      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) setError(error.message)
      else setVerification(data)
    })()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/account" className="flex items-center gap-2 text-slate-300">
          <ArrowLeft size={18}/> الحساب
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <ShieldCheck className="text-emerald-400" size={32}/>
          <h1 className="mt-4 text-3xl font-bold">Verification</h1>

          {error && <div className="mt-5 rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}

          {verification ? (
            <div className="mt-6 space-y-3">
              <div>الاسم: {verification.full_name || "-"}</div>
              <div>نوع المستند: {verification.document_type || "-"}</div>
              <div>الحالة: <span className="text-emerald-400">{verification.status || "pending"}</span></div>
            </div>
          ) : (
            <div className="mt-6 text-slate-400">لا يوجد طلب تحقق حتى الآن.</div>
          )}
        </div>
      </div>
    </main>
  )
}
