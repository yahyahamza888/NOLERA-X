"use client"

import Link from "next/link"
import { ArrowLeft, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"

export default function NotificationsPage() {
  const supabase = getSupabaseClient()
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState("")

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("يجب تسجيل الدخول.")
      return
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) setError(error.message)
    else setItems(data || [])
  }

  useEffect(() => { load() }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/account" className="flex items-center gap-2 text-slate-300">
          <ArrowLeft size={18}/> الحساب
        </Link>
        <div className="mt-8 flex items-center gap-3">
          <Bell className="text-emerald-400"/>
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>

        {error && <div className="mt-5 rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}

        <div className="mt-6 space-y-3">
          {items.length === 0
            ? <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-500">لا توجد إشعارات.</div>
            : items.map(n => (
              <div key={n.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-semibold">{n.title || n.type || "NOLERA X"}</div>
                <div className="mt-2 text-sm text-slate-400">{n.message || n.body || ""}</div>
              </div>
            ))
          }
        </div>
      </div>
    </main>
  )
}
