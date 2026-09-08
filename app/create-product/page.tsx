"use client"

import { useEffect, useState } from "react"
import {
  getDigitalProducts,
  saveDigitalProduct,
  type DigitalProduct,
} from "../../lib/nolera-products"

const types = [
  { name: "كتاب إلكتروني", icon: "📚" },
  { name: "قالب", icon: "📄" },
  { name: "تصميم", icon: "🎨" },
  { name: "دورة تعليمية", icon: "🎓" },
  { name: "ملف رقمي", icon: "📦" },
  { name: "خدمة رقمية", icon: "⚡" },
]

export default function CreateProductPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [type, setType] = useState(types[0].name)
  const [icon, setIcon] = useState(types[0].icon)
  const [message, setMessage] = useState("")
  const [products, setProducts] = useState<DigitalProduct[]>([])

  useEffect(() => {
    const refresh = () => setProducts(getDigitalProducts())
    refresh()

    window.addEventListener("nolera-products-updated", refresh)
    return () =>
      window.removeEventListener("nolera-products-updated", refresh)
  }, [])

  function generateWithAI() {
    if (!name.trim()) {
      setMessage("اكتب فكرة المنتج أولًا.")
      return
    }

    if (!description.trim()) {
      setDescription(
        `منتج رقمي احترافي بعنوان "${name.trim()}". منتج عملي وسهل الاستخدام يساعد المستخدم على تحقيق أقصى استفادة من المحتوى.`
      )
    }

    setMessage("تم تجهيز وصف أولي للمنتج. يمكنك تعديله قبل النشر.")
  }

  function createProduct() {
    const value = Number(price)

    if (!name.trim() || !description.trim() || !value || value <= 0) {
      setMessage("أدخل اسم المنتج والوصف والسعر بشكل صحيح.")
      return
    }

    const product = saveDigitalProduct({
      name: name.trim(),
      description: description.trim(),
      price: value,
      category: type,
      icon,
      owner: "حساب NOLERA X",
    })

    if (product) {
      setProducts(getDigitalProducts())
      setName("")
      setDescription("")
      setPrice("")
      setMessage("تم إنشاء المنتج ونشره في متجر NOLERA X بنجاح.")
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-slate-500">NOLERA X</p>
            <h1 className="mt-1 text-3xl font-black sm:text-4xl">
              صناعة المنتجات الرقمية 🤖
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              أنشئ منتجك الرقمي، جهزه بالذكاء الاصطناعي وانشره في المتجر.
            </p>
          </div>

          <a
            href="/store"
            className="rounded-2xl bg-slate-950 px-5 py-3 text-center text-sm font-black text-white"
          >
            🛍️ العودة للمتجر
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <section className="rounded-[28px] border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">إنشاء منتج جديد</h2>

            <label className="mt-6 block text-sm font-bold">
              اسم المنتج
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: دليل التجارة الإلكترونية"
              className="mt-2 w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-slate-300"
            />

            <label className="mt-5 block text-sm font-bold">
              نوع المنتج
            </label>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {types.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setType(item.name)
                    setIcon(item.icon)
                  }}
                  className={`rounded-2xl border p-3 text-sm font-bold ${
                    type === item.name
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "bg-white"
                  }`}
                >
                  <div className="text-2xl">{item.icon}</div>
                  {item.name}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-sm font-bold">
              وصف المنتج
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصف المنتج وماذا سيحصل عليه المشتري..."
              rows={6}
              className="mt-2 w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-slate-300"
            />

            <button
              onClick={generateWithAI}
              className="mt-3 w-full rounded-2xl border border-slate-900 py-4 text-sm font-black transition hover:bg-slate-100"
            >
              ✨ تجهيز المحتوى بالذكاء الاصطناعي
            </button>

            <label className="mt-5 block text-sm font-bold">
              السعر — SDG
            </label>

            <input
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="مثال: 15000"
              className="mt-2 w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-slate-300"
            />

            <button
              onClick={createProduct}
              className="mt-5 w-full rounded-2xl bg-slate-950 py-4 text-sm font-black text-white shadow-lg"
            >
              🚀 إنشاء ونشر المنتج
            </button>
          </section>

          <aside className="rounded-[28px] bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-sm font-bold text-white/50">
              NOLERA AI
            </p>

            <h2 className="mt-2 text-2xl font-black">
              حوّل فكرتك إلى منتج
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/70">
              اكتب فكرتك، اختر نوع المنتج، استخدم مساعد الذكاء الاصطناعي
              لتجهيز المحتوى ثم انشر المنتج مباشرة في المتجر.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "💡 فكرة المنتج",
                "🤖 تجهيز المحتوى",
                "💰 تحديد السعر",
                "🛍️ النشر في المتجر",
                "📈 تحقيق الأرباح",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm font-bold"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-[28px] border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">منتجاتي 📦</h2>

          {products.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
              لم تنشئ أي منتج بعد.
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border p-4"
                >
                  <div className="text-4xl">{product.icon}</div>

                  <h3 className="mt-3 font-black">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {product.description}
                  </p>

                  <p className="mt-3 font-black">
                    {product.price.toLocaleString()} SDG
                  </p>

                  <p className="mt-1 text-xs text-green-600">
                    منشور في المتجر
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {message && (
          <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 px-6 py-4 text-center text-sm font-bold text-white shadow-2xl">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}
