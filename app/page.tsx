"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Wallet,
  ArrowRight,
  Sparkles,
  Truck,
  ShoppingBag,
  Building2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Package,
  Store,
} from "lucide-react"

import { useNoleraLanguage } from "@/components/NoleraLanguageProvider"
import { useNoleraAuth } from "../lib/use-nolera-auth"
import { getWallets } from "../lib/nolera-finance"
import { getStoreProducts, type StoreProduct } from "../lib/nolera-store"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useNoleraAuth()
  const { language, setLanguage } = useNoleraLanguage()

  const [search, setSearch] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [balance, setBalance] = useState<number | null>(null)
  const [currency, setCurrency] = useState("USD")
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) {
      setBalance(null)
      return
    }

    let active = true

    async function loadHomeData() {
      setLoadingData(true)
      setError("")

      try {
        const [walletsResult, productsResult] = await Promise.all([
          getWallets(),
          getStoreProducts(),
        ])

        if (!active) return

        const preferredWallet =
          walletsResult.find((wallet) => wallet.currency === "USD") ||
          walletsResult[0]

        setBalance(Number(preferredWallet?.balance || 0))
        setCurrency(preferredWallet?.currency || "USD")
        setProducts(productsResult || [])
      } catch (err) {
        if (!active) return

        setError(
          err instanceof Error
            ? err.message
            : "تعذر تحميل بيانات الرئيسية."
        )
      } finally {
        if (active) {
          setLoadingData(false)
        }
      }
    }

    loadHomeData()

    return () => {
      active = false
    }
  }, [user])

  const ar = language === "ar"

  const activeProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.status === "active" ||
          product.status === "published" ||
          !product.status
      ),
    [products]
  )

  const searchedProducts = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return activeProducts

    return activeProducts.filter((product) => {
      const text = [
        product.name,
        product.description,
        product.category,
        product.currency,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return text.includes(q)
    })
  }, [activeProducts, search])

  const popularProducts = useMemo(
    () => searchedProducts.slice(0, 8),
    [searchedProducts]
  )

  const lowerPriceProducts = useMemo(
    () =>
      [...searchedProducts]
        .sort((a, b) => Number(a.price) - Number(b.price))
        .slice(0, 8),
    [searchedProducts]
  )

  const highValueProducts = useMemo(
    () =>
      [...searchedProducts]
        .sort((a, b) => Number(b.price) - Number(a.price))
        .slice(0, 8),
    [searchedProducts]
  )

  const featuredProduct =
    searchedProducts[0] || activeProducts[0] || null

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-purple-700" />
      </main>
    )
  }

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 pb-28 text-slate-900"
    >
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm"
              aria-label={ar ? "فتح القائمة" : "Open menu"}
            >
              <span className="text-xl leading-none">☰</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/account")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"
              aria-label="الحساب"
            >
              <span className="text-sm font-black">
                {user?.role === "super_admin" ? "SA" : "U"}
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <div
                className="flex items-center gap-0.5 select-none"
                aria-label="NOLERA"
              >
                <span className="text-3xl font-black tracking-[-0.12em] text-emerald-600">
                  N
                </span>
                <span className="text-3xl font-black tracking-[-0.12em] text-orange-500">
                  R
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm font-black text-slate-900">
                  {user?.role === "super_admin"
                    ? (ar ? "مرحباً بك، Super Admin" : "Welcome, Super Admin")
                    : (ar ? "مرحباً بك" : "Welcome")}
                </p>
                <p className="mt-0.5 text-[11px] font-bold text-slate-400">
                  {ar ? "في منصتك التجارية العالمية" : "In your global commerce platform"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setLanguage(language === "ar" ? "en" : "ar")
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black"
            >
              {ar ? "EN" : "العربية"}
            </button>
          </div>

          {/* REAL SEARCH */}
          <div className="relative mt-3">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                ar
                  ? "ابحث عن منتج، خدمة، شركة أو قسم..."
                  : "Search products, services, companies..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-4 pl-12 pr-4 text-sm font-bold outline-none transition focus:border-purple-400 focus:bg-white rtl:pl-4 rtl:pr-12"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {[
              ["/wallet", ar ? "المحفظة" : "Wallet"],
              ["/transfers", ar ? "تحويل" : "Transfers"],
              ["/services", ar ? "الخدمات" : "Services"],
              ["/store", ar ? "المتجر" : "Store"],
              ["/ads", "NOLERA ADS"],
              ["/paradise", "NOLERA PARADISE"],
              ["/logistics", "Logistics"],
              ["/ai", "NOLERA AI"],
              ["/markets", ar ? "الأسواق" : "Markets"],
              ["/bills", ar ? "الفواتير" : "Bills"],
              ["/cards", ar ? "البطاقات" : "Cards"],
              ["/orders", ar ? "الطلبات" : "Orders"],
              ["/support", ar ? "الدعم" : "Support"],
              ["/notifications", ar ? "الإشعارات" : "Notifications"],
              ["/verification", ar ? "التحقق" : "Verification"],
            ].map(([href, label]) => (
              <button
                key={href}
                type="button"
                onClick={() => router.push(href)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label={ar ? "إغلاق القائمة" : "Close menu"}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <aside
            className={`absolute top-0 h-full w-[82%] max-w-sm bg-white p-5 shadow-2xl ${
              ar ? "right-0" : "left-0"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-emerald-600">NOLERA X</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">
                  {ar ? "القائمة الرئيسية" : "Main Menu"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg font-black"
              >
                ×
              </button>
            </div>

            <nav className="mt-6 grid grid-cols-2 gap-2.5">
              {[
                ["/wallet", ar ? "المحفظة" : "Wallet"],
                ["/transfers", ar ? "التحويلات" : "Transfers"],
                ["/services", ar ? "الخدمات" : "Services"],
                ["/store", ar ? "المتجر" : "Store"],
                ["/ads", "NOLERA ADS"],
                ["/paradise", "NOLERA PARADISE"],
                ["/logistics", "Logistics"],
                ["/ai", "NOLERA AI"],
                ["/markets", ar ? "الأسواق" : "Markets"],
                ["/orders", ar ? "الطلبات" : "Orders"],
                ["/support", ar ? "الدعم" : "Support"],
                ["/notifications", ar ? "الإشعارات" : "Notifications"],
              ].map(([href, label]) => (
                <button
                  key={href}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    router.push(href)
                  }}
                  className="rounded-2xl border border-purple-100 bg-purple-50/60 px-3 py-3 text-center text-xs font-black text-slate-800 transition hover:bg-purple-100"
                >
                  {label}
                </button>
              ))}
            </nav>

            {user?.role === "super_admin" && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  router.push("/admin")
                }}
                className="mt-4 w-full rounded-2xl bg-purple-800 px-4 py-3 text-sm font-black text-white"
              >
                Super Admin
              </button>
            )}
          </aside>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-5 px-4 py-5">

        {/* BALANCE */}
        {user && (
          <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 to-purple-950 p-5 text-white shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-white/60">
                  {ar ? "رصيدك المتاح" : "Available balance"}
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <strong className="text-3xl font-black">
                    {balance === null
                      ? "..."
                      : balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </strong>

                  <span className="pb-1 text-sm font-black text-white/70">
                    {currency}
                  </span>
                </div>
              </div>

              <Wallet className="h-8 w-8 text-white/80" />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => router.push("/wallet")}
                className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm font-black text-purple-800"
              >
                {ar ? "المحفظة" : "Wallet"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/add-money")}
                className="flex-1 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white ring-1 ring-white/20"
              >
                {ar ? "إضافة أموال" : "Add money"}
              </button>
            </div>
          </section>
        )}

        {/* TWO MAIN SERVICES */}
        <section className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push("/logistics")}
            className="group rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Truck className="h-6 w-6" />
            </div>

            <p className="mt-4 text-base font-black">
              {ar ? "NOLERA Logistics" : "NOLERA Logistics"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {ar
                ? "عقارات، نقل وخدمات عالمية"
                : "Property, logistics and global services"}
            </p>

            <div className="mt-4 flex items-center gap-1 text-xs font-black text-emerald-600">
              {ar ? "اكتشف" : "Explore"}
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/ai")}
            className="group rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <Sparkles className="h-6 w-6" />
            </div>

            <p className="mt-4 text-base font-black">
              {ar ? "NOLERA AI" : "NOLERA AI"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {ar
                ? "ذكاء، بحث وتحليل"
                : "Intelligence, research and analysis"}
            </p>

            <div className="mt-4 flex items-center gap-1 text-xs font-black text-purple-700">
              {ar ? "ابدأ" : "Start"}
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </section>

        {/* PRODUCTS PANORAMA */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-black">
                {ar ? "الأكثر مبيعاً" : "Best sellers"}
              </p>
              <p className="text-xs text-slate-500">
                {ar
                  ? "منتجات حقيقية من متجر NOLERA"
                  : "Live products from NOLERA Store"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/store")}
              className="text-xs font-black text-purple-700"
            >
              {ar ? "المتجر" : "Store"}
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {popularProducts.length === 0 ? (
              <div className="w-full rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
                <Package className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-500">
                  {loadingData
                    ? "جاري تحميل المنتجات..."
                    : "لا توجد منتجات متاحة حالياً."}
                </p>
              </div>
            ) : (
              popularProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => router.push(`/store/${product.id}`)}
                  className="w-44 shrink-0 overflow-hidden rounded-3xl bg-white text-left shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex h-32 items-center justify-center bg-slate-100 text-5xl">
                    {product.icon || "📦"}
                  </div>

                  <div className="p-3">
                    <p className="truncate text-sm font-black">
                      {product.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {product.category}
                    </p>

                    <p className="mt-3 text-sm font-black text-purple-700">
                      {Number(product.price).toLocaleString()}{" "}
                      {product.currency}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* FEATURED PRODUCT */}
        {featuredProduct && (
          <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="grid md:grid-cols-2">
              <div className="flex min-h-56 items-center justify-center bg-gradient-to-br from-slate-100 to-purple-50 text-7xl">
                {featuredProduct.icon || "🛍️"}
              </div>

              <div className="p-6">
                <div className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-[10px] font-black text-purple-700">
                  {ar ? "منتج مميز" : "FEATURED PRODUCT"}
                </div>

                <h2 className="mt-4 text-2xl font-black">
                  {featuredProduct.name}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  {featuredProduct.description ||
                    (ar
                      ? "منتج متاح في متجر NOLERA."
                      : "Available in the NOLERA Store.")}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <strong className="text-xl font-black text-purple-700">
                    {Number(featuredProduct.price).toLocaleString()}{" "}
                    {featuredProduct.currency}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/store/${featuredProduct.id}`)
                    }
                    className="rounded-2xl bg-purple-700 px-5 py-3 text-sm font-black text-white"
                  >
                    {ar ? "عرض المنتج" : "View product"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PROPERTY / LOGISTICS */}
        <button
          type="button"
          onClick={() => router.push("/logistics")}
          className="w-full overflow-hidden rounded-3xl bg-white text-left shadow-sm ring-1 ring-slate-200"
        >
          <div className="flex min-h-52 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
            <Building2 className="h-20 w-20 text-emerald-600/60" />
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-600">
                  NOLERA Global Services
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {ar
                    ? "العقارات والخدمات اللوجستية"
                    : "Property & Logistics"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {ar
                    ? "ابحث عن عقار، مكتب، شركة أو خدمة من منصة NOLERA."
                    : "Find property, offices, companies and services through NOLERA."}
                </p>
              </div>

              <ChevronLeft className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </button>

        {/* VALUE PANORAMA */}
        <section>
          <div className="mb-3">
            <p className="text-lg font-black">
              {ar ? "الأعلى رواجاً وقيمة" : "Trending & highest value"}
            </p>
            <p className="text-xs text-slate-500">
              {ar
                ? "ترتيب حقيقي مبني على المنتجات المتاحة"
                : "Real ordering from available products"}
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {highValueProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => router.push(`/store/${product.id}`)}
                className="w-48 shrink-0 rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex h-28 items-center justify-center rounded-2xl bg-slate-100 text-5xl">
                  {product.icon || "📦"}
                </div>

                <p className="mt-3 truncate text-sm font-black">
                  {product.name}
                </p>

                <p className="mt-2 text-sm font-black text-purple-700">
                  {Number(product.price).toLocaleString()}{" "}
                  {product.currency}
                </p>

                <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-slate-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {ar ? "قيمة أعلى" : "Higher value"}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* LOWEST VALUE */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-lg font-black">
              {ar ? "خيارات أقل سعراً" : "Lower-price picks"}
            </p>

            <div className="flex items-center gap-1 text-xs text-slate-400">
              <ChevronRight className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4" />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {lowerPriceProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => router.push(`/store/${product.id}`)}
                className="w-40 shrink-0 rounded-3xl bg-white p-3 text-left shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex h-24 items-center justify-center rounded-2xl bg-slate-100 text-4xl">
                  {product.icon || "📦"}
                </div>

                <p className="mt-3 truncate text-xs font-black">
                  {product.name}
                </p>

                <p className="mt-2 text-sm font-black text-emerald-600">
                  {Number(product.price).toLocaleString()}{" "}
                  {product.currency}
                </p>
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* STORE CTA */}
        <button
          type="button"
          onClick={() => router.push("/store")}
          className="flex w-full items-center justify-between rounded-3xl bg-slate-900 p-5 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <ShoppingBag className="h-5 w-5" />
            </div>

            <div className="text-left">
              <p className="text-sm font-black">
                {ar ? "استكشف متجر NOLERA" : "Explore NOLERA Store"}
              </p>
              <p className="mt-1 text-xs text-white/50">
                {ar
                  ? "منتجات وخدمات رقمية"
                  : "Digital products and services"}
              </p>
            </div>
          </div>

          <Store className="h-5 w-5 text-white/60" />
        </button>
      </div>
    </main>
  )
}
