"use client"

import Link from "next/link"
import { ArrowLeft, ShieldCheck, Send, RefreshCw, CheckCircle2, Clock3, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"

export default function VerificationPage() {
  const supabase = getSupabaseClient()

  const [verification, setVerification] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [documentType, setDocumentType] = useState("national_id")
  const [documentNumber, setDocumentNumber] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function loadVerification() {
    setLoading(true)
    setError("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("يجب تسجيل الدخول.")
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("verifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) setError(error.message)
    else setVerification(data)

    setLoading(false)
  }

  useEffect(() => {
    loadVerification()
  }, [])

  async function submitVerification(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!fullName.trim() || !documentNumber.trim()) {
      setError("أكمل الاسم ورقم المستند.")
      return
    }

    setSubmitting(true)

    const { data, error } = await supabase.rpc("nolera_submit_verification", {
      p_full_name: fullName.trim(),
      p_document_type: documentType,
      p_document_number: documentNumber.trim(),
    })

    if (error) {
      setError(error.message)
    } else {
      setVerification(data)
      setMessage("تم إرسال طلب التحقق بنجاح. طلبك الآن قيد المراجعة.")
      setFullName("")
      setDocumentNumber("")
    }

    setSubmitting(false)
  }

  const status = verification?.status || ""

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/account"
          className="flex items-center gap-2 text-slate-300 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          الحساب
        </Link>

        <div className="mt-8 rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <ShieldCheck className="text-emerald-400" size={32} />
            </div>

            <div>
              <h1 className="text-3xl font-black">التحقق والهوية</h1>
              <p className="mt-1 text-sm text-slate-400">
                KYC — تأكيد هوية صاحب الحساب
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-bold text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
              {message}
            </div>
          )}

          {loading ? (
            <div className="mt-8 flex items-center justify-center py-10 text-slate-400">
              <RefreshCw className="mr-2 animate-spin" size={18} />
              جاري تحميل حالة التحقق...
            </div>
          ) : verification ? (
            <section className="mt-8">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black">آخر طلب تحقق</h2>

                  {status === "approved" ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                      <CheckCircle2 size={15} />
                      مقبول
                    </span>
                  ) : status === "rejected" ? (
                    <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-black text-red-300">
                      <XCircle size={15} />
                      مرفوض
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-300">
                      <Clock3 size={15} />
                      قيد المراجعة
                    </span>
                  )}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">الاسم</p>
                    <p className="mt-1 font-bold">
                      {verification.full_name || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">نوع المستند</p>
                    <p className="mt-1 font-bold">
                      {verification.document_type || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">رقم المستند</p>
                    <p className="mt-1 font-bold">
                      {verification.document_number
                        ? `••••${String(verification.document_number).slice(-4)}`
                        : "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">تاريخ الطلب</p>
                    <p className="mt-1 font-bold">
                      {verification.created_at
                        ? new Date(verification.created_at).toLocaleDateString(
                            "ar"
                          )
                        : "-"}
                    </p>
                  </div>
                </div>

                {verification.notes && (
                  <div className="mt-3 rounded-2xl bg-white/5 p-4">
                    <p className="text-xs text-slate-500">ملاحظات المراجعة</p>
                    <p className="mt-1 text-sm font-bold">
                      {verification.notes}
                    </p>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <form onSubmit={submitVerification} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  الاسم الكامل
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="اكتب اسمك الكامل"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  نوع المستند
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-white outline-none"
                >
                  <option value="national_id">الهوية الوطنية</option>
                  <option value="passport">جواز السفر</option>
                  <option value="driving_license">رخصة القيادة</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  رقم المستند
                </label>
                <input
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="رقم المستند"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition focus:border-emerald-400"
                />
              </div>

              <div className="rounded-2xl border border-amber-400/10 bg-amber-500/5 p-4 text-xs leading-6 text-slate-400">
                في هذه المرحلة يتم تسجيل بيانات طلب التحقق فقط. رفع صور
                المستندات سنضيفه لاحقًا بطريقة آمنة عبر التخزين الخاص.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 font-black text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
                {submitting ? "جاري إرسال الطلب..." : "إرسال طلب التحقق"}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={loadVerification}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10"
          >
            <RefreshCw size={16} />
            تحديث حالة التحقق
          </button>
        </div>
      </div>
    </main>
  )
}
