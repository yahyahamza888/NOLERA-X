"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import {
  getStoreProducts,
  purchaseStoreProduct,
  type StoreProduct,
} from "../../lib/nolera-store"
import { getWallets } from "../../lib/nolera-finance"
import { getSupabaseClient } from "../../lib/nolera-auth"
import { requireNoleraAuth } from "../../lib/nolera-auth-guard"

type CartItem = {
  product: StoreProduct
  quantity: number
}

const CART_KEY = "nolera_store_cart"

const categoryNames: Record<string, string> = {
  الكل: "الكل",
  كتاب: "كتب",
  قالب: "قوالب",
  تصميم: "تصاميم",
  دورة: "دورات",
  ملف: "ملفات",
  خدمة: "خدمات",
  رقمي: "منتجات رقمية",
}

export default function StorePage() {
  const router = useRouter()
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("الكل")
  const [sortMode, setSortMode] = useState("best")
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [balance, setBalance] = useState(0)

  async function loadStore() {
    try {
      setLoading(true)
      const [items, wallets] = await Promise.all([
        getStoreProducts(),
        getWallets(),
      ])

      setProducts(items)

      const sdg = wallets.find(
        (wallet: any) => String(wallet.currency).toUpperCase() === "SDG",
      )

      setBalance(Number(sdg?.balance || 0))
    } catch (err: any) {
      setError(err?.message || "تعذر تحميل المتجر.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStore()

    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]")
      if (Array.isArray(saved)) setCart(saved)
    } catch {}

    const refresh = () => loadStore()
    window.addEventListener("nolera-data-updated", refresh)

    return () => window.removeEventListener("nolera-data-updated", refresh)
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean)),
    )

    return ["الكل", ...values]
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        category === "الكل" || product.category === category

      const text = `${product.name} ${product.description} ${product.category}`.toLowerCase()

      return matchesCategory && (!query || text.includes(query))
    })
  }, [products, search, category])

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]

    if (sortMode === "best") {
      return list.sort((a: any, b: any) =>
        Number(b.sales_count ?? b.sales ?? b.orders_count ?? 0) -
        Number(a.sales_count ?? a.sales ?? a.orders_count ?? 0)
      )
    }

    if (sortMode === "worst") {
      return list.sort((a: any, b: any) =>
        Number(a.sales_count ?? a.sales ?? a.orders_count ?? 0) -
        Number(b.sales_count ?? b.sales ?? b.orders_count ?? 0)
      )
    }

    if (sortMode === "low") {
      return list.sort((a: any, b: any) =>
        Number(a.price ?? 0) - Number(b.price ?? 0)
      )
    }

    if (sortMode === "high") {
      return list.sort((a: any, b: any) =>
        Number(b.price ?? 0) - Number(a.price ?? 0)
      )
    }

    return list
  }, [filteredProducts, sortMode])

  const newProducts = useMemo(() => {
    return [...products]
      .sort((a: any, b: any) => {
        const ad = new Date(a.created_at ?? 0).getTime()
        const bd = new Date(b.created_at ?? 0).getTime()
        return bd - ad
      })
      .slice(0, 8)
  }, [products])

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(product: StoreProduct) {
    setError("")
    setMessage("")

    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id,
      )

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...current, { product, quantity: 1 }]
    })

    setCartOpen(true)
  }

  function changeQuantity(productId: string, amount: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeItem(productId: string) {
    setCart((current) =>
      current.filter((item) => item.product.id !== productId),
    )
  }

  async function checkout() {
    const authenticated = await requireNoleraAuth(router)
    if (!authenticated) return

    if (!cart.length) {
      setError("السلة فارغة.")
      return
    }

    if (cartTotal > balance) {
      setError(
        `الرصيد غير كافٍ. تحتاج ${cartTotal.toLocaleString()} SDG والمتاح ${balance.toLocaleString()} SDG.`,
      )
      return
    }

    try {
      setCheckoutLoading(true)
      setError("")
      setMessage("")

      const supabase = getSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("يجب تسجيل الدخول لإكمال الشراء.")
      }

      const items = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }))

      const { data, error: checkoutError } = await supabase.rpc(
        "nolera_checkout",
        {
          p_items: items,
        },
      )

      if (checkoutError) throw new Error(checkoutError.message)

      if (!data?.success) {
        throw new Error("تعذر إكمال الطلب.")
      }

      setCart([])
      setCartOpen(false)
      setBalance(Number(data.buyer_balance ?? balance - cartTotal))
      setMessage(
        `تم إكمال الطلب بنجاح 🎉 رقم الطلب: ${data.reference || data.order_id}`,
      )

      window.dispatchEvent(new Event("nolera-data-updated"))
    } catch (err: any) {
      setError(err?.message || "تعذر إكمال عملية الشراء.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8ff] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-purple-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-slate-200 bg-white p-2.5 transition hover:bg-slate-50"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-purple-600" size={21} />
                <h1 className="text-xl font-black">NOLERA STORE</h1>
              </div>
              <p className="text-xs text-slate-500">
                سوق المنتجات والخدمات الرقمية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
            href="/seller"
            className="flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-black text-purple-700"
          >
            <ShoppingBag size={17} />
            لوحة البائع
          </Link>

          <Link
              href="/create-product"
              className="hidden rounded-2xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 sm:block"
            >
              + بيع منتج
            </Link>

            <Link
              href="/orders"
              className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold sm:block"
            >
              طلباتي
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-2xl bg-slate-950 p-3 text-white"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-4 pt-6 sm:px-6">
        <div className="rounded-[28px] border border-purple-100 bg-white p-4 shadow-sm sm:p-5">

          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black text-purple-600">NOLERA STORE</p>
              <h2 className="text-xl font-black sm:text-2xl">
                سوق المنتجات الرقمية
              </h2>
            </div>

            <div className="rounded-2xl bg-purple-50 px-3 py-2 text-xs font-black text-purple-700">
              {products.length} منتج
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {[
              ["best", "🔥 الأكثر مبيعًا"],
              ["worst", "📉 الأقل مبيعًا"],
              ["low", "💰 الأقل سعرًا"],
              ["high", "💎 الأعلى سعرًا"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSortMode(value)}
                className={`whitespace-nowrap rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                  sortMode === value
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:bg-purple-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-11 text-sm font-bold outline-none transition focus:border-purple-400 focus:bg-white"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-purple-600">NEW PRODUCTS</p>
            <h2 className="text-xl font-black">🆕 منتجات جديدة</h2>
          </div>

          <span className="text-xs font-bold text-slate-400">
            اسحب للمزيد ←
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {newProducts.length === 0 ? (
            <div className="w-full rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-400">
              لا توجد منتجات جديدة حاليًا
            </div>
          ) : (
            newProducts.map((product: any) => (
              <Link
                key={product.id}
                href={`/store/${product.id}`}
                className="w-[210px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-purple-100 via-white to-sky-100 text-5xl">
                  {product.icon || "📦"}
                </div>

                <div className="p-4">
                  <h3 className="truncate text-sm font-black">
                    {product.name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {product.description || "منتج رقمي من NOLERA"}
                  </p>

                  <div className="mt-3 text-sm font-black text-purple-700">
                    {Number(product.price || 0).toLocaleString()} SDG
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
            <Check size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-purple-600">NOLERA MARKET</p>
            <h2 className="text-2xl font-black">المنتجات</h2>
          </div>

          <div className="rounded-2xl bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
            الرصيد:{" "}
            <span className="text-slate-900">
              {balance.toLocaleString()} SDG
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-[26px] bg-white"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link
                  href={`/store/${product.id}`}
                  className="block"
                >
                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-purple-100 via-white to-sky-100 text-6xl">
                    {product.icon || "📦"}
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-black text-purple-700">
                        {categoryNames[product.category] || product.category}
                      </span>

                      <span className="text-xs font-bold text-slate-400">
                        NOLERA
                      </span>
                    </div>

                    <h3 className="line-clamp-1 text-lg font-black">
                      {product.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-slate-500">
                      {product.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">السعر</p>
                        <p className="text-lg font-black">
                          {Number(product.price).toLocaleString()}{" "}
                          <span className="text-xs">{product.currency}</span>
                        </p>
                      </div>

                      <span className="rounded-xl bg-slate-100 p-2.5 transition group-hover:bg-purple-600 group-hover:text-white">
                        <ChevronLeft size={18} />
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="px-5 pb-5">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full rounded-2xl bg-slate-950 py-3 text-sm font-black text-white transition hover:bg-purple-700"
                  >
                    أضف إلى السلة
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-14 text-center">
            <div className="text-5xl">🛍️</div>
            <h3 className="mt-4 text-xl font-black">لا توجد منتجات</h3>
            <p className="mt-2 text-sm text-slate-500">
              جرّب بحثًا مختلفًا أو كن أول من ينشر منتجًا.
            </p>
            <Link
              href="/create-product"
              className="mt-5 inline-block rounded-2xl bg-purple-600 px-5 py-3 text-sm font-black text-white"
            >
              إنشاء منتج
            </Link>
          </div>
        )}
      </section>

      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="إغلاق السلة"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-xl font-black">سلة المشتريات</h2>
                <p className="text-xs text-slate-400">
                  {cartCount} عنصر
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="rounded-xl bg-slate-100 p-2"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {!cart.length ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag size={50} className="text-slate-300" />
                  <h3 className="mt-4 font-black">السلة فارغة</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    أضف المنتجات التي تريد شراءها.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                          {item.product.icon || "📦"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-black">
                            {item.product.name}
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            {Number(item.product.price).toLocaleString()}{" "}
                            {item.product.currency}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="h-fit rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
                          <button
                            onClick={() =>
                              changeQuantity(item.product.id, -1)
                            }
                            className="rounded-lg bg-white p-1.5 shadow-sm"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-7 text-center text-sm font-black">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              changeQuantity(item.product.id, 1)
                            }
                            className="rounded-lg bg-white p-1.5 shadow-sm"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="font-black">
                          {(
                            Number(item.product.price) * item.quantity
                          ).toLocaleString()}{" "}
                          {item.product.currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-100 p-5">
                  <div className="mb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">سعر المنتجات</span>
                      <span className="font-bold">
                        {cartTotal.toLocaleString()} SDG
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">رسوم متجر NOLERA (10%)</span>
                      <span className="font-bold text-purple-600">
                        {(cartTotal * 0.10).toLocaleString()} SDG
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="text-base font-black">الإجمالي</span>
                      <span className="text-2xl font-black">
                        {(cartTotal * 1.10).toLocaleString()} SDG
                      </span>
                    </div>
                  </div>

                <button
                  disabled={checkoutLoading}
                  onClick={checkout}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#6f36a9] to-[#a85bd0] py-4 text-sm font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutLoading ? "جارٍ إتمام الطلب..." : "إتمام الشراء"}
                </button>

                <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
                  يتم الخصم والتحويل داخل Supabase في عملية آمنة واحدة.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}
