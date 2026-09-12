"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getStoreProduct, type StoreProduct } from "../../../lib/nolera-store"

export default function ProductPage() {
  const params = useParams()
  const id = String(params?.id || "")

  const [product, setProduct] = useState<StoreProduct | null>(null)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const item = await getStoreProduct(id)
        setProduct(item)

        const { getSupabaseClient } = await import("../../../lib/nolera-auth")
        const supabase = getSupabaseClient()
        const { data: wallets } = await supabase.from("wallets").select("currency,balance")
        const sdg = (wallets || []).find((w: any) => w.currency === "SDG")
        setBalance(Number(sdg?.balance || 0))
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "تعذر تحميل المنتج.")
      } finally {
        setLoading(false)
      }
    }

    if (id) load()
  }, [id])

  async function buy() {
    if (!product) return

    if (balance < Number(product.price)) {
      setMessage("الرصيد غير كافٍ لشراء هذا المنتج.")
      return
    }

    setBuying(true)
    setMessage("جاري تنفيذ الشراء...")

    try {
      const { getSupabaseClient } = await import("../../../lib/nolera-auth")
      const supabase = getSupabaseClient()

      const { data, error } = await supabase.rpc("nolera_checkout", {
        p_items: [
          {
            product_id: product.id,
            quantity: 1,
          },
        ],
      })

      if (error) throw new Error(error.message)

      if (data?.success === false) {
        throw new Error(data?.message || "فشل الشراء.")
      }

      setBalance(Number(data?.buyer_balance ?? balance - Number(product.price)))
      setMessage(`تم الشراء بنجاح 🎉 رقم الطلب: ${data?.reference || "تم إنشاء الطلب"}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "حدث خطأ أثناء الشراء.")
    } finally {
      setBuying(false)
    }
  }

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          جاري تحميل المنتج...
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-5xl">📦</div>
          <h1 className="mb-2 text-2xl font-bold">المنتج غير موجود</h1>
          <p className="mb-6 text-slate-500">{message}</p>
          <Link
            href="/store"
            className="inline-block rounded-2xl bg-purple-600 px-6 py-3 font-bold text-white"
          >
            العودة إلى المتجر
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/store" className="font-bold text-purple-600">
            ← المتجر
          </Link>

          <Link href="/orders" className="text-sm font-bold text-slate-600">
            طلباتي
          </Link>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-lg">
          <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-orange-400 p-8 text-white">
            <div className="text-7xl">{product.icon || "📦"}</div>
          </div>

          <div className="p-6 md:p-10">
            <div className="mb-3 inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
              {product.category}
            </div>

            <h1 className="mb-4 text-3xl font-black md:text-4xl">
              {product.name}
            </h1>

            <p className="mb-8 whitespace-pre-wrap leading-8 text-slate-600">
              {product.description}
            </p>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">السعر</div>
                <div className="mt-1 text-3xl font-black text-purple-700">
                  {Number(product.price).toLocaleString()} {product.currency}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">رصيدك الحالي</div>
                <div className="mt-1 text-2xl font-black">
                  {balance.toLocaleString()} SDG
                </div>
              </div>
            </div>

            {message && (
              <div className="mb-5 rounded-2xl bg-purple-50 p-4 text-sm font-bold text-purple-800">
                {message}
              </div>
            )}

            <button
              onClick={buy}
              disabled={buying}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-4 text-lg font-black text-white shadow-lg disabled:opacity-50"
            >
              {buying ? "جاري الشراء..." : "شراء الآن"}
            </button>

            <div className="mt-5 text-center text-sm text-slate-500">
              الدفع من رصيد NOLERA X بشكل آمن.
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
