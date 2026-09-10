"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { getSupabaseClient } from "../../lib/nolera-auth"
import { requireNoleraAuth } from "../../lib/nolera-auth-guard"

export default function CardsPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [cards, setCards] = useState<any[]>([])
  const [network, setNetwork] = useState("Visa")
  const [cardType, setCardType] = useState("virtual")
  const [currency, setCurrency] = useState("SDG")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let active = true

    async function loadCards() {
      const authenticated = await requireNoleraAuth(router)

      if (!authenticated) return

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)

      if (!active) return

      if (error) {
        setError(error.message)
      } else {
        setCards(data || [])
      }

      setLoading(false)
    }

    loadCards()

    return () => {
      active = false
    }
  }, [router, supabase])

  async function createCard() {
    setError("")
    setMessage("")

    const authenticated = await requireNoleraAuth(router)

    if (!authenticated) return

    setCreating(true)

    try {
      setMessage(
        `تم إرسال طلب بطاقة NOLERA X ${network} (${cardType === "virtual" ? "افتراضية" : "فعلية"}) بعملة ${currency}.`
      )
    } catch (err: any) {
      setError(err?.message || "تعذر إنشاء طلب البطاقة.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf8ff] px-4 py-6 text-slate-900"
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm"
        >
          <ArrowLeft size={18} />
          الحساب
        </Link>

        <header className="mt-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-700">
              <CreditCard size={25} />
            </div>

            <div>
              <p className="text-sm font-black text-purple-600">
                NOLERA X
              </p>
              <h1 className="text-3xl font-black">
                بطاقاتي
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            أنشئ بطاقة NOLERA X واختر نوع البطاقة وشبكة الدفع
            المناسبة حسب البلد ومزود إصدار البطاقات.
          </p>
        </header>

        {message && (
          <div className="mt-6 rounded-3xl border border-sky-200 bg-sky-50 p-4 text-sm font-bold text-sky-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <section className="mt-7 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#6f36a9] via-[#8240b6] to-[#a85bd0] p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white/70">
                NOLERA X
              </p>
              <p className="mt-2 text-xl font-black">
                NOLERA CARD
              </p>
            </div>

            <CreditCard size={34} />
          </div>

          <div className="mt-12 text-2xl tracking-[0.25em]">
            •••• •••• •••• 0000
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-white/60">
                CARD HOLDER
              </p>
              <p className="mt-1 font-black">
                NOLERA USER
              </p>
            </div>

            <div className="text-left">
              <p className="text-[10px] text-white/60">
                NETWORK
              </p>
              <p className="mt-1 font-black">
                {network}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-7 rounded-[30px] border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            <h2 className="text-xl font-black">
              إنشاء بطاقة جديدة
            </h2>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-black">
              نوع البطاقة
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setCardType("virtual")}
                className={`rounded-2xl border p-4 text-right transition ${
                  cardType === "virtual"
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="font-black">💳 بطاقة افتراضية</p>
                <p className="mt-1 text-xs text-slate-500">
                  مناسبة للدفع الإلكتروني.
                </p>
              </button>

              <button
                onClick={() => setCardType("physical")}
                className={`rounded-2xl border p-4 text-right transition ${
                  cardType === "physical"
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="font-black">💳 بطاقة فعلية</p>
                <p className="mt-1 text-xs text-slate-500">
                  إصدار فعلي لاحقًا حسب البلد والمزود.
                </p>
              </button>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-black">
              شبكة الدفع
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {["Visa", "Mastercard"].map((item) => (
                <button
                  key={item}
                  onClick={() => setNetwork(item)}
                  className={`rounded-2xl border p-4 font-black transition ${
                    network === item
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-black">
              العملة
            </p>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-bold outline-none focus:border-purple-400"
            >
              <option value="SDG">الجنيه السوداني — SDG</option>
              <option value="USD">الدولار الأمريكي — USD</option>
              <option value="EUR">اليورو — EUR</option>
              <option value="GBP">الجنيه الإسترليني — GBP</option>
            </select>
          </div>

          <button
            onClick={createCard}
            disabled={creating}
            className="mt-7 w-full rounded-2xl bg-gradient-to-r from-[#6f36a9] to-[#a85bd0] p-4 font-black text-white shadow-lg disabled:opacity-60"
          >
            {creating ? "جاري إرسال الطلب..." : "إنشاء بطاقة NOLERA X"}
          </button>

          <div className="mt-5 flex gap-3 rounded-2xl bg-sky-50 p-4">
            <ShieldCheck
              className="shrink-0 text-sky-500"
              size={21}
            />
            <p className="text-xs leading-6 text-slate-600">
              هذه واجهة Prototype حاليًا. إصدار البطاقات
              الحقيقية سيتم لاحقًا من خلال مزود بطاقات
              مرخّص ومتوافق مع المتطلبات التنظيمية.
            </p>
          </div>
        </section>

        <section className="mt-7">
          <h2 className="mb-4 text-xl font-black">
            بطاقات الحساب
          </h2>

          {loading ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-400 shadow-sm">
              جاري تحميل البطاقات...
            </div>
          ) : cards.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-purple-200 bg-white p-10 text-center">
              <CreditCard
                size={42}
                className="mx-auto text-purple-200"
              />
              <h3 className="mt-4 font-black">
                لا توجد بطاقات بعد
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                اختر نوع البطاقة والشبكة ثم أرسل طلبك.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black">
                        {card.name || "NOLERA X Card"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {card.network || "NOLERA"}
                      </p>
                    </div>

                    <span className="rounded-xl bg-sky-50 px-3 py-2 text-xs font-black text-sky-700">
                      {card.status || "active"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
