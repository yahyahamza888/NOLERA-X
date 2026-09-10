"use client";

import { useNoleraAuth } from "../lib/use-nolera-auth"
import { financeState, getTransactions } from "../lib/finance";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Wallet,
  UserRound,
  Send,
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
  CreditCard,
  Bell,
  ShieldCheck,
  Settings,
  Store,
  ShoppingBag,
  Sparkles,
  Globe2,
  ReceiptText,
  Menu,
  X,
  Eye,
  EyeOff,
  ChevronLeft,
  Zap,
  CircleUserRound,
  Megaphone,
  Heart,
} from "lucide-react";

const services = [
  { name: "المحفظة", href: "/wallet", icon: Wallet, tone: "purple" },
  { name: "التحويل", href: "/transfers", icon: Send, tone: "blue" },
  { name: "إضافة أموال", href: "/add-money", icon: Plus, tone: "purple" },
  { name: "السحب", href: "/withdraw", icon: ArrowUpFromLine, tone: "blue" },
  { name: "البطاقات", href: "/cards", icon: CreditCard, tone: "purple" },
  { name: "الفواتير", href: "/bills", icon: ReceiptText, tone: "blue" },
  { name: "المتجر", href: "/store", icon: Store, tone: "purple" },
  { name: "الأسواق", href: "/markets", icon: Globe2, tone: "blue" },
  { name: "أبو حنين AI", href: "/ai", icon: Sparkles, tone: "purple" },
  { name: "NOLERA PARADISE", href: "/paradise", icon: Heart, tone: "purple" },
  { name: "NOLERA ADS", href: "/ads", icon: Megaphone, tone: "blue" },
  { name: "NOLERA ID", href: "/id", icon: CircleUserRound, tone: "blue" },
  { name: "التحقق", href: "/verification", icon: ShieldCheck, tone: "purple" },
  { name: "الإعدادات", href: "/settings", icon: Settings, tone: "blue" },
];

const products = [
  { name: "كتاب رقمي", category: "كتب", price: "$4.99", icon: "📚" },
  { name: "تصميم احترافي", category: "تصميم", price: "$12.00", icon: "🎨" },
  { name: "دورة رقمية", category: "تعليم", price: "$19.00", icon: "🎓" },
  { name: "قالب متجر", category: "أعمال", price: "$9.99", icon: "🛍️" },
  { name: "حزمة AI", category: "ذكاء اصطناعي", price: "$15.00", icon: "🤖" },
];

export default function HomePage() {
  const { user, loading: authLoading } = useNoleraAuth()
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(financeState.balance);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tab, setTab] = useState<"best" | "new">("best");

  useEffect(() => {
    setBalance(financeState.balance);
  }, []);

  const transactions = getTransactions().slice(0, 4);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#fbf8ff] pb-24 text-[#24152f]"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px]">
        <aside className="hidden w-[260px] shrink-0 border-l border-purple-100 bg-white p-5 lg:block">
          <div className="sticky top-5">
            <Brand />

            <nav className="mt-8 space-y-1.5">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Icon size={19} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#6d35a8] to-[#9a4dca] p-5 text-white">
              <Sparkles size={24} />
              <div className="mt-3 font-bold">أبو حنين AI</div>
              <p className="mt-1 text-xs leading-5 text-white/75">
                مساعدك الذكي داخل منظومة NOLERA X
              </p>
              <Link
                href="/ai"
                className="mt-4 block rounded-xl bg-white/15 px-3 py-2 text-center text-xs font-bold"
              >
                افتح المساعد
              </Link>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-purple-100 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenu(true)}
                  className="rounded-xl border border-purple-100 bg-white p-2 text-purple-700 lg:hidden"
                >
                  <Menu size={21} />
                </button>
                <Brand compact />
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/notifications"
                  className="relative rounded-xl border border-purple-100 bg-white p-2.5 text-purple-700"
                >
                  <Bell size={19} />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
                </Link>
                {authLoading ? (
                  <div className="h-10 w-20 animate-pulse rounded-xl bg-purple-50" />
                ) : user ? (
                  <Link
                    href="/account"
                    className="flex items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-sm font-bold text-purple-700"
                  >
                    <UserRound size={17} />
                    <span className="hidden sm:inline">حسابي</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="rounded-xl border border-purple-100 bg-white px-3 py-2 text-xs font-black text-purple-700"
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-xl bg-purple-700 px-3 py-2 text-xs font-black text-white"
                    >
                      إنشاء حساب
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
            <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6f36a9] via-[#8240b6] to-[#a85bd0] p-5 text-white shadow-xl shadow-purple-200 sm:p-7">
              <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[#38bdf8]/20 blur-3xl" />
              <div className="absolute -bottom-20 right-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-white/75">
                      <Wallet size={17} />
                      رصيدك الإجمالي
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="text-3xl font-black tracking-tight sm:text-5xl">
                        {showBalance
                          ? `$${balance.toLocaleString()}`
                          : "••••••••"}
                      </div>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="rounded-xl bg-white/10 p-2"
                      >
                        {showBalance ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-[#bae6fd]">
                      حساب NOLERA X
                    </div>
                  </div>

                  <div className="hidden rounded-2xl border border-white/15 bg-white/10 p-3 text-left sm:block">
                    <div className="text-[10px] text-white/60">
                      NOLERA ID
                    </div>
                    <div className="mt-1 font-bold">يحيى حمزة</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-2 sm:max-w-2xl sm:gap-3">
                  {[
                    ["تحويل", "/transfers", Send],
                    ["استلام", "/transfers", ArrowDownToLine],
                    ["إضافة", "/add-money", Plus],
                    ["سحب", "/withdraw", ArrowUpFromLine],
                  ].map(([label, href, Icon]) => {
                    const ActionIcon = Icon as typeof Send;
                    return (
                      <Link
                        key={label as string}
                        href={href as string}
                        className="flex flex-col items-center justify-center rounded-2xl bg-white/10 px-2 py-3 text-center transition hover:bg-white/20"
                      >
                        <ActionIcon size={19} />
                        <span className="mt-1.5 text-[11px] font-bold">
                          {label as string}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold text-[#38bdf8]">
                    NOLERA X
                  </p>
                  <h2 className="mt-1 text-xl font-black">الخدمات</h2>
                </div>
                <Link
                  href="/bills"
                  className="text-xs font-bold text-purple-700"
                >
                  عرض الكل
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
                {services.map((item) => {
                  const Icon = item.icon;
                  const orange = item.tone === "orange";
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group rounded-2xl border border-purple-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                    >
                      <div
                        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${
                          orange
                            ? "bg-[#e0f2fe] text-[#38bdf8]"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="mt-2 text-center text-[11px] font-bold leading-4 text-slate-700 sm:text-xs">
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#38bdf8]">
                    NOLERA X MARKET
                  </p>
                  <h2 className="mt-1 text-xl font-black">المتجر</h2>
                </div>
                <Link
                  href="/store"
                  className="text-xs font-bold text-purple-700"
                >
                  المتجر كاملًا
                </Link>
              </div>

              <div className="mb-3 flex w-fit rounded-2xl bg-purple-100 p-1">
                <button
                  onClick={() => setTab("best")}
                  className={`rounded-xl px-4 py-2 text-xs font-bold ${
                    tab === "best"
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-purple-500"
                  }`}
                >
                  الأكثر مبيعًا
                </button>
                <button
                  onClick={() => setTab("new")}
                  className={`rounded-xl px-4 py-2 text-xs font-bold ${
                    tab === "new"
                      ? "bg-white text-[#38bdf8] shadow-sm"
                      : "text-purple-500"
                  }`}
                >
                  الجديد
                </button>
              </div>

              <div className="-mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-2 scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
                {products.map((product, index) => (
                  <Link
                    href="/store"
                    key={product.name}
                    className="min-w-[145px] snap-start rounded-2xl border border-purple-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:min-w-0"
                  >
                    <div className="flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-[#e0f2fe] text-4xl">
                      {tab === "new" ? "✨" : product.icon}
                    </div>
                    <div className="mt-3 truncate text-sm font-black">
                      {tab === "new" ? `${product.name} جديد` : product.name}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400">
                      {product.category}
                    </div>
                    <div className="mt-2 font-black text-[#38bdf8]">
                      {product.price}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-7 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
              <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-purple-400">
                      ACTIVITY
                    </p>
                    <h2 className="mt-1 text-lg font-black">
                      آخر العمليات
                    </h2>
                  </div>
                  <Link
                    href="/transactions"
                    className="text-xs font-bold text-purple-700"
                  >
                    الكل
                  </Link>
                </div>

                <div className="mt-4 divide-y divide-purple-50">
                  {(transactions.length
                    ? transactions
                    : [
                        {
                          id: "1",
                          type: "payment",
                          amount: -18.5,
                          description: "NOLERA Coffee",
                        },
                        {
                          id: "2",
                          type: "receive",
                          amount: 250,
                          description: "Money received",
                        },
                        {
                          id: "3",
                          type: "payment",
                          amount: -12,
                          description: "Cloud Services",
                        },
                      ]
                  ).map((tx: any) => (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                        <ReceiptText size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold">
                          {tx.description || tx.recipient || "عملية مالية"}
                        </div>
                        <div className="mt-0.5 text-[10px] text-slate-400">
                          NOLERA X
                        </div>
                      </div>
                      <div
                        className={`text-sm font-black ${
                          Number(tx.amount) >= 0
                            ? "text-green-600"
                            : "text-slate-700"
                        }`}
                      >
                        {Number(tx.amount) >= 0 ? "+" : "-"}$
                        {Math.abs(Number(tx.amount || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-[#4f2778] to-[#7e3ca9] p-5 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white/60">NOLERA X</p>
                    <h2 className="mt-1 text-lg font-black">بطاقتك</h2>
                  </div>
                  <CreditCard size={22} />
                </div>
                <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span>NOLERA X</span>
                    <span>VIRTUAL</span>
                  </div>
                  <div className="mt-8 text-sm tracking-[0.22em] text-white/70">
                    •••• •••• •••• 4821
                  </div>
                  <div className="mt-4 flex justify-between text-[9px] text-white/55">
                    <span>YAHYA HAMZA</span>
                    <span>09/30</span>
                  </div>
                </div>
                <Link
                  href="/cards"
                  className="mt-4 block rounded-xl bg-[#38bdf8] py-3 text-center text-xs font-black"
                >
                  إدارة البطاقة
                </Link>
              </div>
            </section>


            <section className="mt-7 overflow-hidden rounded-[28px] border border-purple-100 bg-white shadow-sm">
              <div className="relative overflow-hidden bg-gradient-to-br from-[#24152f] via-[#45225b] to-[#6d35a8] p-5 text-white sm:p-7">
                <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#38bdf8]/15 blur-3xl" />
                <div className="absolute -left-20 -bottom-24 h-60 w-60 rounded-full bg-purple-300/10 blur-3xl" />

                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.18em] text-[#7dd3fc]">
                      NOLERA WORLD MAP
                    </p>
                    <h2 className="mt-1 text-xl font-black sm:text-2xl">
                      العالم داخل NOLERA X
                    </h2>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-white/65">
                      منظومة رقمية تبدأ من السودان وتمتد إلى العالم.
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl sm:flex">
                    🌍
                  </div>
                </div>

                <div className="relative mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-[#17101f]/70 p-2 sm:p-4">
                  <svg
                    viewBox="0 0 1000 500"
                    className="h-auto w-full"
                    role="img"
                    aria-label="خريطة العالم"
                  >
                    <defs>
                      <radialGradient id="worldGlow">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity=".45" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                      </radialGradient>
                      <filter id="mapGlow">
                        <feGaussianBlur stdDeviation="5" />
                      </filter>
                    </defs>

                    <ellipse cx="500" cy="250" rx="390" ry="190" fill="url(#worldGlow)" />

                    <g
                      fill="#d8b4fe"
                      stroke="#f5eaff"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    >
                      {/* North America */}
                      <path d="M90 105 L145 70 L205 82 L245 112 L230 145 L190 145 L172 178 L132 165 L118 140 L82 132 Z" />
                      {/* South America */}
                      <path d="M270 205 L315 220 L340 265 L327 315 L300 365 L272 395 L252 350 L258 310 L240 270 Z" />
                      {/* Europe */}
                      <path d="M455 120 L490 105 L520 120 L535 145 L510 160 L480 150 L458 138 Z" />
                      {/* Asia */}
                      <path d="M520 125 L575 92 L650 100 L720 125 L790 150 L850 190 L820 220 L760 208 L720 225 L675 205 L620 215 L580 190 L535 175 Z" />
                      {/* Africa */}
                      <path d="M465 190 L515 180 L555 215 L550 275 L520 330 L480 355 L450 310 L442 255 Z" />
                      {/* Australia */}
                      <path d="M735 330 L785 315 L835 335 L850 370 L820 395 L770 390 L735 365 Z" />
                      {/* Greenland */}
                      <path d="M300 55 L350 38 L390 55 L380 95 L335 105 L305 88 Z" />
                    </g>

                    {/* Sudan / NOLERA origin */}
                    <circle cx="503" cy="251" r="16" fill="#38bdf8" opacity=".25" filter="url(#mapGlow)" />
                    <circle cx="503" cy="251" r="7" fill="#38bdf8" stroke="white" strokeWidth="3" />
                    <path d="M503 251 L555 215" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" />
                    <rect x="555" y="198" width="150" height="38" rx="12" fill="#ffffff" fillOpacity=".12" stroke="#ffffff" strokeOpacity=".18" />
                    <text x="575" y="222" fill="white" fontSize="15" fontWeight="800">
                      NOLERA X
                    </text>
                  </svg>
                </div>

                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold">
                    🌍 Global Network
                  </div>
                  <div className="rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-1.5 text-[10px] font-bold text-[#bae6fd]">
                    🇸🇩 Sudan Origin
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold">
                    NOLERA X
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/id"
                className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm"
              >
                <CircleUserRound className="text-purple-700" size={23} />
                <div className="mt-3 text-sm font-black">NOLERA ID</div>
                <div className="mt-1 text-[10px] leading-4 text-slate-400">
                  هويتك داخل منظومة NOLERA X
                </div>
              </Link>
              <Link
                href="/security"
                className="rounded-2xl border border-[#bae6fd]/50 bg-white p-4 shadow-sm"
              >
                <ShieldCheck className="text-[#38bdf8]" size={23} />
                <div className="mt-3 text-sm font-black">الأمان</div>
                <div className="mt-1 text-[10px] leading-4 text-slate-400">
                  حماية الحساب والمعاملات
                </div>
              </Link>
            </section>

            <footer className="mt-8 pb-3 text-center text-[10px] leading-5 text-slate-400">
              NOLERA X — منصة رقمية تجريبية قابلة للتطوير
            </footer>
          </div>
        </section>
      </div>

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileMenu(false)}
            aria-label="إغلاق القائمة"
          />
          <aside className="absolute right-0 top-0 h-full w-[82%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setMobileMenu(false)}
                className="rounded-xl bg-purple-50 p-2 text-purple-700"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="mt-7 space-y-1.5">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    onClick={() => setMobileMenu(false)}
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Icon size={19} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-purple-100 bg-white/95 px-2 py-2 shadow-[0_-5px_20px_rgba(91,45,120,.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 rounded-xl bg-purple-50 px-2 py-2 text-[11px] font-black text-purple-700"
          >
            <Home size={20} />
            الرئيسية
          </Link>
          <Link
            href="/wallet"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-bold text-slate-500"
          >
            <Wallet size={20} />
            محفظتي
          </Link>
          <Link
            href="/paradise"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-bold text-slate-500"
          >
            <Heart size={20} />
            Paradise
          </Link>
          <Link
            href="/ads"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-bold text-slate-500"
          >
            <Megaphone size={20} />
            Ads
          </Link>
          <Link
            href={user ? "/account" : "/login"}
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-bold text-slate-500"
          >
            <UserRound size={20} />
            {user ? "حسابي" : "دخول"}
          </Link>
        </div>
      </nav>
    </main>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-700 to-purple-500 text-white shadow-sm ${
          compact ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <Zap size={compact ? 19 : 23} fill="currentColor" />
      </div>
      <div>
        <div className="text-base font-black tracking-tight text-purple-800">
          NOLERA X
        </div>
        <div className="text-[9px] font-bold tracking-[0.18em] text-[#38bdf8]">
          DIGITAL FINANCE
        </div>
      </div>
    </div>
  );
}
