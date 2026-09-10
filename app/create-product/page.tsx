"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  createStoreProduct,
  getMyProducts,
} from "../../lib/nolera-store"

const types = [
  { name: "كتاب إلكتروني", icon: "📚", hint: "أدلة وكتب رقمية" },
  { name: "قالب", icon: "📄", hint: "قوالب جاهزة للبيع" },
  { name: "تصميم", icon: "🎨", hint: "تصاميم وملفات إبداعية" },
  { name: "دورة تعليمية", icon: "🎓", hint: "محتوى تعليمي" },
  { name: "ملف رقمي", icon: "📦", hint: "ملفات وأدوات رقمية" },
  { name: "خدمة رقمية", icon: "⚡", hint: "خدمات عبر الإنترنت" },
]

const currencies = ["SDG", "USD"]

export default function CreateProductPage() {
  const [idea, setIdea] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [audience, setAudience] = useState("")
  const [benefits, setBenefits] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState("SDG")
  const [type, setType] = useState(types[0].name)
  const [icon, setIcon] = useState(types[0].icon)
  const [products, setProducts] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  async function refresh() {
    try {
      setProducts(await getMyProducts())
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر تحميل المنتجات."
      )
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const selectedType = useMemo(
    () => types.find((item) => item.name === type) || types[0],
    [type]
  )

  function generateWithAI() {
    const source = (idea || name).trim()

    if (!source) {
      setMessage("اكتب فكرة المنتج أولاً.")
      return
    }

    setGenerating(true)

    const generatedName =
      name.trim() ||
      source
        .replace(/\s+/g, " ")
        .slice(0, 55)

    const generatedAudience =
      audience.trim() ||
      "أصحاب المشاريع الصغيرة، المستقلون وصنّاع المحتوى"

    const generatedDescription =
      description.trim() ||
      `منتج رقمي عملي بعنوان "${generatedName}". تم تصميمه لمساعدة المستخدم على الوصول إلى نتيجة واضحة بطريقة بسيطة ومنظمة، مع محتوى قابل للاستخدام مباشرة.`

    const generatedBenefits =
      benefits.trim() ||
      "محتوى عملي وسهل الاستخدام\nتوفير الوقت والجهد\nخطوات واضحة وقابلة للتطبيق\nمناسب للمبتدئين والمحترفين"

    const generatedPrice =
      price.trim() ||
      (currency === "USD" ? "9.99" : "15000")

    setName(generatedName)
    setAudience(generatedAudience)
    setDescription(generatedDescription)
    setBenefits(generatedBenefits)
    setPrice(generatedPrice)

    setTimeout(() => {
      setGenerating(false)
      setMessage(
        "تم تجهيز مسودة المنتج. راجع البيانات قبل النشر."
      )
    }, 350)
  }

  async function createProduct() {
    const value = Number(price)

    if (
      !name.trim() ||
      !description.trim() ||
      !value ||
      value <= 0
    ) {
      setMessage(
        "أدخل اسم المنتج والوصف والسعر بشكل صحيح."
      )
      return
    }

    try {
      setLoading(true)
      setMessage("جاري إنشاء المنتج في NOLERA STORE...")

      await createStoreProduct({
        name: name.trim(),
        description: description.trim(),
        price: value,
        currency,
        category: type,
        icon,
      })

      setIdea("")
      setName("")
      setDescription("")
      setAudience("")
      setBenefits("")
      setPrice("")

      setMessage(
        "تم إنشاء المنتج ونشره في NOLERA STORE بنجاح 🎉"
      )

      await refresh()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر إنشاء المنتج."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5f7fb] p-4 text-slate-900 sm:p-6"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#35154d] via-[#512d68] to-[#e86f32] p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-white/60">
                NOLERA X • DIGITAL PRODUCT FACTORY
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-5xl">
                حوّل فكرتك إلى منتج رقمي 🚀
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                استخدم NOLERA AI لتجهيز فكرة المنتج، ثم راجعها
                وانشرها مباشرة داخل NOLERA STORE.
              </p>
            </div>

            <Link
              href="/store"
              className="rounded-2xl bg-white px-6 py-3 text-center text-sm font-black text-slate-950"
            >
              🛍️ فتح NOLERA STORE
            </Link>
          </div>
        </header>

        {/* STEPS */}
        <div className="mt-5 grid gap-3 sm:grid-cols-5">
          {[
            ["01", "الفكرة", "💡"],
            ["02", "AI", "🤖"],
            ["03", "التفاصيل", "📝"],
            ["04", "المعاينة", "👀"],
            ["05", "النشر", "🚀"],
          ].map(([number, label, emoji]) => (
            <div
              key={number}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-600">
                  {number}
                </span>
                <span>{emoji}</span>
              </div>
              <p className="mt-2 text-sm font-black">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">

          {/* FACTORY */}
          <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-purple-600">
                  NOLERA AI
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  مصنع المنتج الرقمي
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  ابدأ بالفكرة، ودع النظام يجهز لك مسودة قابلة
                  للتعديل قبل النشر.
                </p>
              </div>

              <div className="hidden rounded-2xl bg-purple-50 px-4 py-3 text-center sm:block">
                <div className="text-2xl">🤖</div>
                <p className="mt-1 text-xs font-black text-purple-700">
                  AI Factory
                </p>
              </div>
            </div>

            {/* IDEA */}
            <label className="mt-7 block text-sm font-black">
              💡 فكرة المنتج
            </label>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="مثال: أريد منتجاً يساعد أصحاب المشاريع الصغيرة في السودان على إدارة أعمالهم..."
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl bg-slate-100 p-4 text-sm outline-none transition focus:ring-4 focus:ring-purple-100"
            />

            <button
              onClick={generateWithAI}
              disabled={generating}
              className="mt-3 w-full rounded-2xl bg-gradient-to-r from-[#512d68] to-[#e86f32] py-4 text-sm font-black text-white shadow-lg disabled:opacity-50"
            >
              {generating
                ? "🤖 NOLERA AI يعمل..."
                : "✨ توليد مسودة المنتج بالذكاء الاصطناعي"}
            </button>

            {/* NAME */}
            <label className="mt-6 block text-sm font-black">
              اسم المنتج
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: دليل المشاريع الصغيرة"
              className="mt-2 w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100"
            />

            {/* TYPE */}
            <label className="mt-6 block text-sm font-black">
              نوع المنتج
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {types.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setType(item.name)
                    setIcon(item.icon)
                  }}
                  className={`rounded-2xl border p-4 text-right transition ${
                    type === item.name
                      ? "border-purple-600 bg-purple-50 ring-2 ring-purple-100"
                      : "border-slate-200 bg-white hover:border-purple-300"
                  }`}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <p className="mt-2 text-sm font-black">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {item.hint}
                  </p>
                </button>
              ))}
            </div>

            {/* DESCRIPTION */}
            <label className="mt-6 block text-sm font-black">
              وصف المنتج
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ما الذي سيحصل عليه المشتري؟ وما المشكلة التي يحلها المنتج؟"
              rows={6}
              className="mt-2 w-full resize-none rounded-2xl bg-slate-100 p-4 outline-none focus:ring-4 focus:ring-purple-100"
            />

            {/* AUDIENCE */}
            <label className="mt-6 block text-sm font-black">
              🎯 الجمهور المستهدف
            </label>

            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="مثال: الطلاب، أصحاب المشاريع، المصممين..."
              className="mt-2 w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100"
            />

            {/* BENEFITS */}
            <label className="mt-6 block text-sm font-black">
              ⭐ المزايا
            </label>

            <textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder={"ميزة 1\nميزة 2\nميزة 3"}
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl bg-slate-100 p-4 outline-none focus:ring-4 focus:ring-purple-100"
            />

            {/* PRICE */}
            <label className="mt-6 block text-sm font-black">
              💰 السعر
            </label>

            <div className="mt-2 grid grid-cols-[1fr_120px] gap-3">
              <input
                type="number"
                min="1"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="مثال: 15000"
                className="rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-4 focus:ring-purple-100"
              />

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-2xl bg-slate-100 px-4 py-4 font-bold outline-none"
              >
                {currencies.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <button
              disabled={loading}
              onClick={createProduct}
              className="mt-6 w-full rounded-2xl bg-slate-950 py-4 text-sm font-black text-white shadow-lg disabled:opacity-50"
            >
              {loading
                ? "🚀 جارٍ النشر..."
                : "🚀 إنشاء ونشر المنتج في NOLERA STORE"}
            </button>
          </section>

          {/* PREVIEW / AI */}
          <aside className="space-y-5">

            <section className="overflow-hidden rounded-[30px] bg-slate-950 p-6 text-white shadow-xl">
              <p className="text-xs font-black tracking-widest text-purple-300">
                PRODUCT PREVIEW
              </p>

              <div className="mt-5 rounded-[26px] bg-white p-5 text-slate-900">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                  {icon}
                </div>

                <p className="mt-5 text-xs font-bold text-purple-600">
                  {selectedType.name}
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {name.trim() || "اسم منتجك هنا"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {description.trim() ||
                    "سيظهر وصف المنتج هنا بعد كتابة التفاصيل."}
                </p>

                {audience.trim() && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-400">
                      الجمهور
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      {audience}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-lg font-black text-purple-600">
                    {price
                      ? `${Number(price).toLocaleString()} ${currency}`
                      : "السعر"}
                  </span>

                  <span className="rounded-xl bg-purple-50 px-3 py-2 text-xs font-black text-purple-700">
                    NOLERA STORE
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6">
              <p className="text-sm font-black text-purple-600">
                🤖 NOLERA AI FLOW
              </p>

              <div className="mt-4 space-y-3">
                {[
                  ["💡", "تحليل فكرة المنتج"],
                  ["🧠", "تجهيز الاسم والوصف"],
                  ["🎯", "اقتراح الجمهور"],
                  ["💰", "تجهيز التسعير"],
                  ["👀", "مراجعة المعاينة"],
                  ["🛍️", "النشر في المتجر"],
                ].map(([emoji, text], index) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="flex-1 text-sm font-bold">
                      {text}
                    </span>
                    <span className="text-xs font-black text-slate-300">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {/* MY PRODUCTS */}
        <section className="mt-6 rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-purple-600">
                MY PRODUCTS
              </p>
              <h2 className="mt-1 text-2xl font-black">
                منتجاتي 📦
              </h2>
            </div>

            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black">
              {products.length} منتج
            </span>
          </div>

          {products.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-10 text-center text-sm text-slate-500">
              لم تنشئ أي منتج بعد. ابدأ بفكرة المنتج أعلاه.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                      {product.icon || "📦"}
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                      {product.status === "published"
                        ? "منشور"
                        : product.status || "مسودة"}
                    </span>
                  </div>

                  <h3 className="mt-4 font-black">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="font-black text-purple-600">
                      {Number(product.price).toLocaleString()}{" "}
                      {product.currency}
                    </span>

                    <span className="text-xs font-bold text-slate-400">
                      {product.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MESSAGE */}
        {message && (
          <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-lg -translate-x-1/2 rounded-2xl bg-slate-950 px-6 py-4 text-center text-sm font-black text-white shadow-2xl">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}
