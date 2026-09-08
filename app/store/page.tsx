"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  getStoreProducts,
  purchaseStoreProduct,
  type StoreProduct,
} from "../../lib/nolera-store"
import { getWallets } from "../../lib/nolera-finance"

type CartItem = StoreProduct & {
  quantity: number
}

export default function StorePage() {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("الكل")
  const [cartOpen, setCartOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [balance, setBalance] = useState(0)

  async function refresh() {
    try {
      setLoading(true)

      const [storeProducts, wallets] = await Promise.all([
        getStoreProducts(),
        getWallets(),
      ])

      setProducts(storeProducts)

      const sdg = wallets.find(
        (wallet) => wallet.currency === "SDG"
      )

      setBalance(Number(sdg?.balance || 0))
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "تعذر تحميل المتجر."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()

    const handler = () => refresh()

    window.addEventListener(
      "nolera-data-updated",
      handler
    )

    return () =>
      window.removeEventListener(
        "nolera-data-updated",
        handler
      )
  }, [])

  function showMessage(text: string) {
    setMessage(text)
    window.setTimeout(() => setMessage(""), 3500)
  }

  const categories = useMemo(() => {
    return [
      "الكل",
      ...Array.from(
        new Set(products.map((product) => product.category))
      ),
    ]
  }, [products])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)

      const matchesCategory =
        category === "الكل" ||
        product.category === category

      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )

  const cartCurrency =
    cart.length > 0 ? cart[0].currency : "SDG"

  function addToCart(product: StoreProduct) {
    if (cart.length > 0 && cart[0].currency !== product.currency) {
      showMessage(
        "لا يمكن جمع منتجات بعملات مختلفة في سلة واحدة."
      )
      return
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      )

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ]
    })

    showMessage("تمت إضافة المنتج إلى السلة 🛒")
  }

  function increase(id: string) {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  function decrease(id: string) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function remove(id: string) {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    )
  }

  async function checkout() {
    if (!cart.length) {
      showMessage("السلة فارغة.")
      return
    }

    if (cart.length > 1) {
      showMessage(
        "نفّذ شراء كل منتج بشكل منفصل حاليًا لضمان تسجيل كل طلب بدقة."
      )
      return
    }

    const item = cart[0]
    const total =
      Number(item.price) * item.quantity

    if (balance < total && item.currency === "SDG") {
      showMessage("الرصيد غير كافٍ.")
      return
    }

    try {
      setBuying(true)

      await purchaseStoreProduct(
        item.id,
        item.quantity
      )

      setCart([])
      setCartOpen(false)

      showMessage(
        `تم شراء ${item.name} بنجاح 🎉`
      )

      await refresh()
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "تعذر إتمام عملية الشراء."
      )
    } finally {
      setBuying(false)
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-7xl">

        <header className="rounded-[28px] bg-slate-950 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-bold text-white/50">
                NOLERA X
              </p>

              <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                متجر NOLERA X 🛍️
              </h1>

              <p className="mt-2 text-sm text-white/60">
                متجر رقمي مرتبط بقاعدة بيانات NOLERA X.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/create-product"
                className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950"
              >
                🤖 اصنع منتجًا
              </Link>

              <Link
                href="/orders"
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black"
              >
                📦 طلباتي
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black"
              >
                🛒 السلة ({cart.length})
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <p className="text-xs text-white/50">
              رصيد SDG
            </p>

            <p className="mt-1 text-2xl font-black">
              {balance.toLocaleString()} SDG
            </p>
          </div>
        </header>

        <section className="mt-5 rounded-[24px] border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔎 ابحث عن منتج..."
              className="w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none"
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

        {loading ? (
          <div className="mt-5 rounded-[26px] bg-white p-10 text-center">
            جاري تحميل المتجر...
          </div>
        ) : (
          <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-[26px] border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl">
                  {product.icon || "📦"}
                </div>

                <p className="mt-4 text-xs font-bold text-slate-400">
                  {product.category}
                </p>

                <h2 className="mt-1 text-lg font-black">
                  {product.name}
                </h2>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {product.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <strong className="text-lg font-black">
                    {Number(product.price).toLocaleString()}{" "}
                    {product.currency}
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
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="mt-5 rounded-[26px] border bg-white p-10 text-center text-slate-500">
            لا توجد منتجات منشورة حاليًا.
          </div>
        )}

        {cartOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 p-4">
            <div className="mr-auto h-full w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">
                  سلة المشتريات 🛒
                </h2>

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
                            <div className="text-2xl">
                              {item.icon || "📦"}
                            </div>

                            <h3 className="mt-1 font-black">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {Number(item.price).toLocaleString()}{" "}
                              {item.currency}
                            </p>
                          </div>

                          <button
                            onClick={() => remove(item.id)}
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
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toLocaleString()}{" "}
                            {item.currency}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-100 p-4">
                    <div className="flex justify-between">
                      <span>الإجمالي</span>

                      <strong>
                        {cartTotal.toLocaleString()}{" "}
                        {cartCurrency}
                      </strong>
                    </div>

                    <p className="mt-3 text-center text-xs text-slate-500">
                      الخصم والتحويل يتمان داخل Supabase
                      في عملية ذرية واحدة.
                    </p>
                  </div>

                  <button
                    disabled={buying}
                    onClick={checkout}
                    className="mt-4 w-full rounded-2xl bg-slate-950 py-4 font-black text-white disabled:opacity-50"
                  >
                    {buying
                      ? "جارٍ إتمام الشراء..."
                      : "💳 إتمام الشراء"}
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
