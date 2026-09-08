"use client"

import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"

export default function CardsPage() {
  const supabase = getSupabaseClient()
  const [cards, setCards] = useState<any[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setError("يجب تسجيل الدخول.")
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
      if (error) setError(error.message)
      else setCards(data || [])
    })()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/account" className="flex items-center gap-2 text-slate-300">
          <ArrowLeft size={18}/> الحساب
        </Link>
        <div className="mt-8 flex items-center gap-3">
          <CreditCard className="text-emerald-400"/>
          <h1 className="text-3xl font-bold">Cards</h1>
        </div>

        {error && <div className="mt-5 rounded-2xl bg-red-500/10 p-4 text-red-300">{error}</div>}

        <div className="mt-6 grid gap-4">
          {cards.length === 0
            ? <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-500">لا توجد بطاقات مرتبطة بالحساب.</div>
            : cards.map(card => (
              <div key={card.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xl font-bold">{card.name || "NOLERA X Card"}</div>
                <div className="mt-3 text-slate-400">{card.status || "active"}</div>
              </div>
            ))
          }
        </div>
      </div>
    </main>
  )
}
