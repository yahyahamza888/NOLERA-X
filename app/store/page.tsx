"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { purchase } from "../../lib/nolera-actions"
import { useNoleraState } from "../../lib/use-nolera-state"
import { getDigitalProducts, type DigitalProduct } from "../../lib/nolera-products"

type Product = {
  id: string
  name: string
  price: number
  category: string
  icon: string
  description: string
}

type CartItem = Product & { quantity: number }

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "بطاقة رقمية",
    price: 15000,
    category: "رقمي",
    icon: "💳",
    description: "بطاقة رقمية جاهزة للاستخدام.",
  },
  {
    id: "2",
    name: "اشتراك Premium",
    price: 25000,
    category: "اشتراكات",
    icon: "⭐",
    description: "اشتراك مميز بخدمات إضافية.",
  },
  {
    id: "3",
    name: "قالب أعمال",
    price: 12000,
    category: "رقمي",
    icon: "📄",
    description: "قالب احترافي جاهز للأعمال.",
  },
  {
    id: "4",
    name: "خدمة تصميم",
    price: 30000,
    category: "خدمات",
    icon: "🎨",
    description: "خدمة تصميم رقمية احترافية.",
  },
  {
    id: "5",
    name: "كتاب إلكتروني",
    price: 8000,
    category: "رقمي",
    icon: "📚",
    description: "كتاب إلكتروني مفيد وقابل للقراءة.",
  },
  {
    id: "6",
    name: "قسيمة شراء",
    price: 20000,
    category: "قسائم",
    icon: "🎟️",
    description: "قسيمة شراء رقمية.",
  },
]

const categories = ["الكل", "خدمات", "رقمي", "اشتراكات", "قسائم"]

export default function StorePage() {
  const { balance } = useNoleraState()

  const [createdProducts, setCreatedProducts] = useState<DigitalProduct[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("الكل")
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"pi" | "bank">("pi")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const refresh = () => setCreatedProducts(getDigitalProducts())
    refresh()

    window.addEventListener("nolera-products-updated", refresh)

    return () => {
      window.removeEventListener("nolera-products-updated", refresh)
    }
  }, [])

  const products = useMemo<Product[]>(() => {
    return [
      ...createdProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        icon: product.icon,
        description: product.description,
      })),
      ...defaultProducts,
    ]
  }, [createdProducts])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === "الكل" || product.category === category

      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  function showMessage(text: string) {
    setMessage(text)
    window.setTimeout(() => setMessage(""), 3000)
  }

  function addToCart(product: Product) {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id)

      if (exists) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...current, { ...product, quantity: 1 }]
    })

    showMessage("تمت إضافة المنتج إلى السلة 🛒")
  }

  function increase(id: string) {
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  function decrease(id: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeFromCart(id: string) {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  function checkout() {
    if (cart.length === 0) {
      showMessage("السلة فارغة.")
      return
    }

    if (cartTotal > balance) {
      showMessage(
        `الرصيد غير كافٍ. المطلوب ${cartTotal.toLocaleString()} SDG والمتاح ${balance.toLocaleString()} SDG.`
      )
      return
    }

    try {
      for (const item of cart) {
        purchase(
          item.price * item.quantity,
          item.name,
          "شراء من متجر NOLERA X"
        )
      }

      setCart([])
      setCartOpen(false)

      showMessage(
        `تمت عملية الشراء بنجاح بقيمة ${cartTotal.toLocaleString()} SDG 🎉`
      )
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إتمام عملية الشراء."
      )
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[28px] bg-slate-950 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-white/50">NOLERA X</p>
              <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                متجر NOLERA X 🛍️
              </h1>
              <p className="mt-2 text-sm text-white/60">
                منتجات رقمية وخدمات واشتراكات في مكان واحد.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/create-product"
                className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950"
              >
                🤖 اصنع منتجًا
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black"
              >
                🛒 السلة ({cartCount})
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/50">رصيد NOLERA X المحلي</p>
            <p className="mt-1 text-2xl font-black">
              {balance.toLocaleString()} SDG
            </p>
          </div>
        </header>

        <section className="mb-5 rounded-[24px] border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔎 ابحث عن منتج..."
              className="w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none focus:ring-2 focus:ring-slate-300"
            />

            <div className="flex gap-2 overflow-x-auto">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-black ${
                    category === item
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-[26px] border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl">
                {product.icon}
              </div>

              <p className="mt-4 text-xs font-bold text-slate-400">
                {product.category}
              </p>

              <h2 className="mt-1 text-lg font-black">{product.name}</h2>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {product.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-2">
                <strong className="text-lg font-black">
                  {product.price.toLocaleString()} SDG
                </strong>

                <button
                  onClick={() => addToCart(product)}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
                >
                  أضف للسلة
                </button>
              </div>
            </article>
          ))}
        </section>

        {filteredProducts.length === 0 && (
          <div className="rounded-[26px] border bg-white p-10 text-center text-slate-500">
            لا توجد منتجات مطابقة للبحث.
          </div>
        )}

        {cartOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 p-4">
            <div className="mr-auto h-full w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">سلة المشتريات 🛒</h2>

                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-xl bg-slate-100 px-4 py-2 font-black"
                >
                  إغلاق
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  السلة فارغة.
                </div>
              ) : (
                <>
                  <div className="mt-6 space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-2xl">{item.icon}</div>
                            <h3 className="mt-1 font-black">{item.name}</h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.price.toLocaleString()} SDG
                            </p>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm font-bold text-red-500"
                          >
                            حذف
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decrease(item.id)}
                              className="h-9 w-9 rounded-xl bg-slate-100 font-black"
                            >
                              −
                            </button>

                            <span className="w-8 text-center font-black">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => increase(item.id)}
                              className="h-9 w-9 rounded-xl bg-slate-100 font-black"
                            >
                              +
                            </button>
                          </div>

                          <strong>
                            {(item.price * item.quantity).toLocaleString()} SDG
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-100 p-4">
                    <div className="flex justify-between text-sm">
                      <span>الإجمالي</span>
                      <strong>{cartTotal.toLocaleString()} SDG</strong>
                    </div>

                    <div className="mt-2 flex justify-between text-sm">
                      <span>رصيدك</span>
                      <strong>{balance.toLocaleString()} SDG</strong>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMethod("pi")}
                        className={`rounded-xl p-3 text-sm font-black ${
                          paymentMethod === "pi"
                            ? "bg-slate-950 text-white"
                            : "bg-white"
                        }`}
                      >
                        🟣 Pi Wallet
                      </button>

                      <button
                        onClick={() => setPaymentMethod("bank")}
                        className={`rounded-xl p-3 text-sm font-black ${
                          paymentMethod === "bank"
                            ? "bg-slate-950 text-white"
                            : "bg-white"
                        }`}
                      >
                        🏦 بنك / بطاقة
                      </button>
                    </div>

                    <p className="mt-3 text-center text-xs text-slate-500">
                      طريقة الدفع الحالية واجهة محلية للاختبار، والخصم يتم من
                      رصيد NOLERA X المحلي.
                    </p>
                  </div>

                  <button
                    onClick={checkout}
                    className="mt-4 w-full rounded-2xl bg-slate-950 py-4 font-black text-white shadow-lg"
                  >
                    💳 إتمام الشراء — {cartTotal.toLocaleString()} SDG
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {message && (
          <div className="fixed bottom-6 left-1/2 z-[60] w-[calc(100%-32px)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 px-6 py-4 text-center text-sm font-bold text-white shadow-2xl">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}
