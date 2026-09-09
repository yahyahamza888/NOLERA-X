"use client";

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
  { name: "التحويل", href: "/transfers", icon: Send, tone: "orange" },
  { name: "إضافة أموال", href: "/add-money", icon: Plus, tone: "purple" },
  { name: "السحب", href: "/withdraw", icon: ArrowUpFromLine, tone: "orange" },
  { name: "البطاقات", href: "/cards", icon: CreditCard, tone: "purple" },
  { name: "الفواتير", href: "/bills", icon: ReceiptText, tone: "orange" },
  { name: "المتجر", href: "/store", icon: Store, tone: "purple" },
  { name: "الأسواق", href: "/markets", icon: Globe2, tone: "orange" },
  { name: "أبو حنين AI", href: "/ai", icon: Sparkles, tone: "purple" },
  { name: "NOLERA PARADISE", href: "/paradise", icon: Heart, tone: "purple" },
  { name: "NOLERA ADS", href: "/ads", icon: Megaphone, tone: "orange" },
  { name: "NOLERA ID", href: "/id", icon: CircleUserRound, tone: "orange" },
  { name: "التحقق", href: "/verification", icon: ShieldCheck, tone: "purple" },
  { name: "الإعدادات", href: "/settings", icon: Settings, tone: "orange" },
];

const products = [
  { name: "كتاب رقمي", category: "كتب", price: "$4.99", icon: "📚" },
  { name: "تصميم احترافي", category: "تصميم", price: "$12.00", icon: "🎨" },
  { name: "دورة رقمية", category: "تعليم", price: "$19.00", icon: "🎓" },
  { name: "قالب متجر", category: "أعمال", price: "$9.99", icon: "🛍️" },
  { name: "حزمة AI", category: "ذكاء اصطناعي", price: "$15.00", icon: "🤖" },
];

export default function HomePage() {
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
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-sm font-bold text-purple-700"
                >
                  <UserRound size={17} />
                  <span className="hidden sm:inline">حسابي</span>
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
            <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6f36a9] via-[#8240b6] to-[#a85bd0] p-5 text-white shadow-xl shadow-purple-200 sm:p-7">
              <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
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
                    <div className="mt-2 text-xs text-orange-200">
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
                  <p className="text-xs font-bold text-orange-500">
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
                            ? "bg-orange-50 text-orange-500"
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
                  <p className="text-xs font-bold text-orange-500">
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
                      ? "bg-white text-orange-500 shadow-sm"
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
                    <div className="flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-orange-50 text-4xl">
                      {tab === "new" ? "✨" : product.icon}
                    </div>
                    <div className="mt-3 truncate text-sm font-black">
                      {tab === "new" ? `${product.name} جديد` : product.name}
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400">
                      {product.category}
                    </div>
                    <div className="mt-2 font-black text-orange-500">
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
                  className="mt-4 block rounded-xl bg-orange-500 py-3 text-center text-xs font-black"
                >
                  إدارة البطاقة
                </Link>
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
                className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
              >
                <ShieldCheck className="text-orange-500" size={23} />
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
            href="/profile"
            className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-bold text-slate-500"
          >
            <UserRound size={20} />
            حسابي
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
        <div className="text-[9px] font-bold tracking-[0.18em] text-orange-500">
          DIGITAL FINANCE
        </div>
      </div>
    </div>
  );
}
