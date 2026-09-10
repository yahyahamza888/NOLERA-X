"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Box,
  ChevronLeft,
  DollarSign,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { getSupabaseClient } from "../../lib/nolera-auth"

type Product = {
  id: string
  owner_id: string
  name: string
  description: string
  price: number
  currency: string
  category: string
  icon: string | null
  status: string
  created_at: string
}

type Sale = {
  id: string
  buyer_id: string
  total: number
  currency: string
  payment_method: string
  status: string
  reference: string | null
  created_at: string
  order_items: {
    id: string
    product_id: string | null
    product_name: string
    quantity: number
    unit_price: number
    total: number
  }[]
}

type WalletRow = {
  id: string
  currency: string
  balance: number
}

const supabase = getSupabaseClient()

export default function SellerPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [wallets, setWallets] = useState<WalletRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  async function loadDashboard() {
    try {
      setLoading(true)
      setMessage("")

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage("يجب تسجيل الدخول لعرض لوحة البائع.")
        return
      }

      const [productsResult, ordersResult, walletsResult] =
        await Promise.all([
          supabase
            .from("products")
            .select(
              "id,owner_id,name,description,price,currency,category,icon,status,created_at"
            )
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false }),

          supabase
            .from("orders")
            .select(`
              id,
              buyer_id,
              total,
              currency,
              payment_method,
              status,
              reference,
              created_at,
              order_items (
                id,
                product_id,
                product_name,
                quantity,
                unit_price,
                total
              )
            `)
            .order("created_at", { ascending: false })
            .limit(100),

          supabase
            .from("wallets")
            .select("id,currency,balance")
            .eq("user_id", user.id),
        ])

      if (productsResult.error) throw new Error(productsResult.error.message)
      if (ordersResult.error) throw new Error(ordersResult.error.message)
      if (walletsResult.error) throw new Error(walletsResult.error.message)

      const ownProducts = (productsResult.data || []) as Product[]
      const ownProductIds = new Set(ownProducts.map((p) => p.id))

      const allOrders = (ordersResult.data || []) as Sale[]

      const sellerSales = allOrders
        .map((order) => ({
          ...order,
          order_items: (order.order_items || []).filter(
            (item) => item.product_id && ownProductIds.has(item.product_id)
          ),
        }))
        .filter((order) => order.order_items.length > 0)

      setProducts(ownProducts)
      setSales(sellerSales)
      setWallets((walletsResult.data || []) as WalletRow[])
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر تحميل لوحة البائع."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const publishedProducts = useMemo(
    () => products.filter((p) => p.status === "published").length,
    [products]
  )

  const totalSales = useMemo(
    () =>
      sales.reduce(
        (sum, order) =>
          sum +
          order.order_items.reduce(
            (itemSum, item) => itemSum + Number(item.total || 0),
            0
          ),
        0
      ),
    [sales]
  )

  const totalUnits = useMemo(
    () =>
      sales.reduce(
        (sum, order) =>
          sum +
          order.order_items.reduce(
            (itemSum, item) => itemSum + Number(item.quantity || 0),
            0
          ),
        0
      ),
    [sales]
  )

  const productStats = useMemo(() => {
    const map = new Map<
      string,
      { name: string; icon: string; units: number; sales: number }
    >()

    for (const order of sales) {
      for (const item of order.order_items) {
        const key = item.product_id || item.product_name
        const existing = map.get(key)

        if (existing) {
          existing.units += Number(item.quantity || 0)
          existing.sales += Number(item.total || 0)
        } else {
          const product = products.find((p) => p.id === item.product_id)
          map.set(key, {
            name: item.product_name,
            icon: product?.icon || "📦",
            units: Number(item.quantity || 0),
            sales: Number(item.total || 0),
          })
        }
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
  }, [sales, products])

  const sdgBalance =
    wallets.find((wallet) => wallet.currency.toUpperCase() === "SDG")
      ?.balance || 0

  const usdBalance =
    wallets.find((wallet) => wallet.currency.toUpperCase() === "USD")
      ?.balance || 0

  function formatMoney(value: number, currency = "SDG") {
    return `${Number(value || 0).toLocaleString("ar-SD")} ${currency}`
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-950"
    >
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-slate-200 bg-white p-2.5"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <p className="text-xs font-black text-purple-600">
                NOLERA X
              </p>
              <h1 className="text-xl font-black sm:text-2xl">
                لوحة البائع
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboard}
              className="rounded-2xl border border-slate-200 bg-white p-3"
              title="تحديث"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            <Link
              href="/create-product"
              className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white sm:flex"
            >
              <Plus size={17} />
              إنشاء منتج
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-6 pt-7 sm:px-6">
        <div className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#6f36a9] via-[#8240b6] to-[#a85bd0] p-6 text-white shadow-xl sm:p-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                <TrendingUp size={14} />
                NOLERA SELLER
              </div>

              <h2 className="max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
                حوّل منتجاتك الرقمية
                <br />
                إلى مصدر دخل.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
                تابع مبيعاتك، منتجاتك، ورصيدك من مكان واحد داخل
                منظومة NOLERA X.
              </p>
            </div>

            <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-bold text-white/70">
                رصيد SDG
              </p>
              <p className="mt-1 text-3xl font-black">
                {sdgBalance.toLocaleString("ar-SD")}
              </p>
              <p className="text-xs font-bold text-white/70">SDG</p>
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {message}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<DollarSign size={21} />}
            label="إجمالي المبيعات"
            value={formatMoney(totalSales)}
            description="إجمالي قيمة المنتجات المباعة"
          />

          <StatCard
            icon={<ShoppingBag size={21} />}
            label="عمليات البيع"
            value={sales.length.toLocaleString("ar-SD")}
            description="طلبات تحتوي منتجاتك"
          />

          <StatCard
            icon={<Package size={21} />}
            label="الوحدات المباعة"
            value={totalUnits.toLocaleString("ar-SD")}
            description="إجمالي الكميات المباعة"
          />

          <StatCard
            icon={<Box size={21} />}
            label="منتجاتي"
            value={products.length.toLocaleString("ar-SD")}
            description={`${publishedProducts} منتج منشور`}
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 lg:grid-cols-[1.35fr_.65fr] sm:px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-purple-600">
                SALES
              </p>
              <h2 className="text-xl font-black">آخر المبيعات</h2>
            </div>

            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-700">
              <BarChart3 size={19} />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : sales.length === 0 ? (
            <EmptyState
              icon="💰"
              title="لا توجد مبيعات حتى الآن"
              text="عندما يشتري أحد منتجاتك ستظهر العملية هنا."
            />
          ) : (
            <div className="space-y-3">
              {sales.slice(0, 8).map((order) => {
                const amount = order.order_items.reduce(
                  (sum, item) => sum + Number(item.total || 0),
                  0
                )

                const names = order.order_items
                  .map((item) => item.product_name)
                  .join("، ")

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-black">
                          {names}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.reference || order.id}
                        </p>
                      </div>

                      <div className="shrink-0 text-left">
                        <p className="font-black text-emerald-600">
                          +{amount.toLocaleString("ar-SD")}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {order.currency}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-slate-400">
                      <span>
                        {order.order_items.reduce(
                          (sum, item) => sum + Number(item.quantity || 0),
                          0
                        )}{" "}
                        وحدة
                      </span>

                      <span>
                        {new Date(order.created_at).toLocaleString(
                          "ar-SD"
                        )}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-purple-600">
                TOP PRODUCTS
              </p>
              <h2 className="text-xl font-black">الأكثر مبيعاً</h2>
            </div>
            <TrendingUp size={19} className="text-purple-600" />
          </div>

          {productStats.length === 0 ? (
            <EmptyState
              icon="📦"
              title="لا توجد بيانات"
              text="ستظهر المنتجات هنا بعد أول عملية بيع."
            />
          ) : (
            <div className="space-y-3">
              {productStats.map((product, index) => (
                <div
                  key={`${product.name}-${index}`}
                  className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    {product.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {product.units.toLocaleString("ar-SD")} وحدة
                    </p>
                  </div>

                  <strong className="text-sm">
                    {product.sales.toLocaleString("ar-SD")}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-purple-600">
                MY PRODUCTS
              </p>
              <h2 className="text-xl font-black">منتجاتي</h2>
            </div>

            <Link
              href="/create-product"
              className="flex items-center gap-1 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white"
            >
              <Plus size={15} />
              منتج جديد
            </Link>
          </div>

          {products.length === 0 ? (
            <EmptyState
              icon="✨"
              title="ابدأ أول منتج رقمي"
              text="أنشئ منتجاً وانشره في NOLERA STORE."
              action={
                <Link
                  href="/create-product"
                  className="mt-4 inline-flex rounded-2xl bg-purple-600 px-5 py-3 text-sm font-black text-white"
                >
                  إنشاء منتج
                </Link>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  href={`/store/${product.id}`}
                  className="group rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                      {product.icon || "📦"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {product.category}
                      </p>
                    </div>

                    <ChevronLeft
                      size={18}
                      className="text-slate-300 transition group-hover:text-purple-600"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                        product.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.status === "published"
                        ? "منشور"
                        : product.status}
                    </span>

                    <strong>
                      {Number(product.price).toLocaleString(
                        "ar-SD"
                      )}{" "}
                      {product.currency}
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/store"
            className="flex items-center justify-between rounded-[24px] bg-slate-950 p-5 text-white"
          >
            <div>
              <p className="text-lg font-black">NOLERA STORE</p>
              <p className="mt-1 text-xs text-white/60">
                استكشف السوق والمنتجات
              </p>
            </div>
            <ArrowUpRight size={22} />
          </Link>

          <Link
            href="/orders"
            className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white p-5"
          >
            <div>
              <p className="text-lg font-black">طلباتي</p>
              <p className="mt-1 text-xs text-slate-500">
                عمليات الشراء الخاصة بحسابك
              </p>
            </div>
            <ShoppingBag size={22} />
          </Link>

          <div className="flex items-center justify-between rounded-[24px] border border-purple-100 bg-purple-50 p-5">
            <div>
              <p className="text-lg font-black">المحافظ</p>
              <p className="mt-1 text-xs text-purple-700/70">
                {usdBalance.toLocaleString("ar-SD")} USD
              </p>
            </div>
            <Wallet size={22} className="text-purple-700" />
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 left-5 right-5 z-20 sm:hidden">
        <Link
          href="/create-product"
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-sm font-black text-white shadow-2xl"
        >
          <Plus size={18} />
          إنشاء منتج رقمي
        </Link>
      </div>
    </main>
  )
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-purple-50 p-3 text-purple-700">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-xs font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-2xl font-black">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-400">{description}</p>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: string
  title: string
  text: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-3 font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
      {action}
    </div>
  )
}
