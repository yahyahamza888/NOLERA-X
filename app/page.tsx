"use client";

import { financeState, getTransactions } from "../lib/finance"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { translations, languages, type Language } from "../lib/translations"
import { Home as HomeIcon, Send, ArrowDownToLine, Plus, ArrowUpFromLine, CreditCard, Wallet, Bell, UserRound, ShieldCheck, Settings, ChevronRight, Menu, X, Zap, Eye, EyeOff, Globe2 } from "lucide-react"

export default function Home() {
  const [showBalance, setShowBalance] = useState(true)
  const [balance, setBalance] = useState(financeState.balance)
  const [recentTransactions, setRecentTransactions] = useState(getTransactions().slice(0, 3))

  useEffect(() => {
    setBalance(financeState.balance)
    setRecentTransactions(getTransactions().slice(0, 3))
  }, [])
  const [language, setLanguage] = useState<Language>("ar")
  const t = translations[language as keyof typeof translations] ?? translations.ar
  const languageNames = languages
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  const changeLanguage = (next: Language) => {
    setLanguage(next)
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = next
  }

  return (
    <main
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#17101f] text-white" : "bg-[#faf7ff] text-[#30243b]"
      }`}
    >
      <div className="flex min-h-screen">

        <div className="flex flex-col items-center justify-center py-2"><svg viewBox="0 0 120 45" className="h-10 w-28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 24C22 8 34 8 48 22C61 35 72 35 86 20C96 10 105 10 115 17" stroke="#22D3EE" strokeWidth="5" strokeLinecap="round"/><path d="M8 31C25 20 37 20 50 30C63 40 76 39 90 28C99 21 107 21 114 25" stroke="#84CC16" strokeWidth="3" strokeLinecap="round"/></svg><span className="text-lg font-black tracking-[0.22em] text-amber-500">NOLERA X</span></div>\n\n        <aside className={`${mobileOpen ? "translate-x-0" : "translate-x-full"} fixed inset-y-0 right-0 z-50 w-72 border-l border-purple-100/10 bg-[#321d45] p-5 transition-transform lg:static lg:translate-x-0`}>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-600">
              <Zap size={23} />
            </div>
            <div>
              <div className="text-lg font-bold">NOLERA X</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-purple-600/60">
                Digital Finance
              </div>
            </div>
          </div>

          <p className="mt-10 px-3 text-[10px] uppercase tracking-[0.25em] text-white/30">
            Main
          </p>

          <nav className="mt-3 space-y-2">
            <Link href="/" className="flex w-full items-center gap-3 rounded-2xl bg-purple-400/10 px-4 py-3 text-sm text-purple-200">
              <HomeIcon size={18} />
              Overview
            </Link>

            <Link href="/transfers" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white">
              <Send size={18} />
              Payments
            </Link>

            <Link href="/cards" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white">
              <CreditCard size={18} />
              Cards
            </Link>

            <Link href="/transactions" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white">
              <Wallet size={18} />
              Transactions
            </Link>
          </nav>

          <p className="mt-8 px-3 text-[10px] uppercase tracking-[0.25em] text-white/30">
            Services
          </p>

          <nav className="mt-3 space-y-2">
            <Link href="/store" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white">
              <Wallet size={18} />
              Store
            </Link>

            <Link href="/wallet" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white">
              <Wallet size={18} />
              Wallet
            </Link>
            <Link href="/markets" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white">
              <Globe2 size={18} />
              Markets
            </Link>

            <Link href="/ai" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white">
              <Zap size={18} />
              NOLERA AI
            </Link>
          </nav>

          <p className="mt-8 px-3 text-[10px] uppercase tracking-[0.25em] text-white/30">
            Account
          </p>

          <nav className="mt-3 space-y-2">
            {[
              ["NOLERA ID", UserRound],
              ["Verification", ShieldCheck],
              ["Security", ShieldCheck],
              ["Settings", Settings],
            ].map(([name, Icon]) => (
              <Link
                key={name as string}
                href={
                  name === "NOLERA ID"
                    ? "/id"
                    : name === "Profile"
                    ? "/profile"
                    : name === "Verification"
                    ? "/verification"
                    : name === "Security"
                    ? "/security"
                    : "/settings"
                }
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white"
              >
                <Icon size={18} />
                {name as string}
              </Link>
            ))}
          </nav>

        </aside>

        <section className="min-w-0 flex-1">

          <header className="border-b border-purple-100/10 bg-slate-50/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between">

              <div className="flex items-center gap-3">
                <button onClick={() => setMobileOpen(true)} className="order-first rounded-xl border border-purple-200 bg-white p-2 text-purple-700 shadow-sm lg:hidden">
                  <Menu size={20} />
                </button>

                <div>
                  <p className="text-xs text-white/35">Good day</p>
                  <h1 className="text-xl font-semibold">Welcome to NOLERA X</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                  <Link href="/login" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5">
                    Login
                  </Link>
                  <Link href="/register" className="rounded-xl bg-purple-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-purple-300">
                    Register
                  </Link>
                  <button className="relative rounded-2xl border border-white/10 p-3 text-white/60">
                    <Bell size={19} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-fuchsia-300" />
                  </button>
                </div>

            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">

            <section className="rounded-[30px] border border-purple-300/15 bg-gradient-to-br from-purple-600/20 via-[#4b2861] to-violet-500/10 p-6 sm:p-8">

              <div className="flex flex-wrap items-center justify-between gap-5">

                <div>
                  <div className="flex items-center gap-2 text-sm text-white/45">
                    <Wallet size={16} />
                    Total Balance
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-4xl font-bold sm:text-5xl">
                      {showBalance ? `$${balance.toLocaleString()}` : "••••••••"}
                    </div>

                    <button onClick={() => setShowBalance(!showBalance)} className="rounded-xl bg-white/5 p-2 text-white/50">
                      {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="mt-3 text-sm text-violet-300">
                    +8.4% this month
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 px-5 py-4">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Globe2 size={14} />
                    Global Account
                  </div>
                  <div className="mt-2 text-sm font-medium">
                    USD •••• 4821
                  </div>
                </div>

              </div>

            </section>

            <section className="mt-8">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-600/60">
                  Quick Actions
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  Move your money
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                <Link href="/add-money" className="group rounded-3xl border border-purple-300/15 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-purple-300/30 hover:bg-purple-300/[0.05]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-600">
                    <Send size={25} />
                  </div>
                  <h3 className="mt-5 font-semibold">Send Money</h3>
                  <p className="mt-1 text-xs text-white/35">Transfer instantly</p>
                  <ChevronRight className="mt-4 text-white/20 group-hover:text-purple-600" size={18} />
                </Link>

                <Link href="/transfers" className="group rounded-3xl border border-violet-300/15 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-violet-300/30 hover:bg-violet-300/[0.05]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                    <ArrowDownToLine size={25} />
                  </div>
                  <h3 className="mt-5 font-semibold">Receive Money</h3>
                  <p className="mt-1 text-xs text-white/35">Get paid securely</p>
                  <ChevronRight className="mt-4 text-white/20 group-hover:text-violet-300" size={18} />
                </Link>

                <Link href="/transfers" className="group rounded-3xl border border-purple-300/15 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-purple-300/30 hover:bg-purple-300/[0.05]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-200">
                    <Plus size={25} />
                  </div>
                  <h3 className="mt-5 font-semibold">Add Money</h3>
                  <p className="mt-1 text-xs text-white/35">Fund your account</p>
                  <ChevronRight className="mt-4 text-white/20 group-hover:text-purple-200" size={18} />
                </Link>

                <Link href="/withdraw" className="group rounded-3xl border border-fuchsia-300/15 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-fuchsia-300/30 hover:bg-fuchsia-300/[0.05]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-300/10 text-fuchsia-600">
                    <ArrowUpFromLine size={25} />
                  </div>
                  <h3 className="mt-5 font-semibold">Withdraw</h3>
                  <p className="mt-1 text-xs text-white/35">Move funds out</p>
                  <ChevronRight className="mt-4 text-white/20 group-hover:text-fuchsia-600" size={18} />
                </Link>

              </div>
            </section>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">

              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                      Activity
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Recent Transactions
                    </h2>
                  </div>

                  <button className="text-xs font-semibold text-purple-600">
                    View all
                  </button>
                </div>

                <div className="mt-5 divide-y divide-white/5">

                  {[
                    ["☕", "NOLERA Coffee", "Card payment", "- $18.50", false],
                    ["MA", "Mohamed Ali", "Money received", "+ $250.00", true],
                    ["☁️", "Cloud Services", "Subscription", "- $12.00", false],
                  ].map((tx) => (

                    <div key={tx[1] as string} className="flex items-center gap-4 py-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-sm font-semibold">
                        {tx[0]}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {tx[1]}
                        </div>
                        <div className="mt-1 text-xs text-white/30">
                          {tx[2]}
                        </div>
                      </div>

                      <div className={tx[4] ? "text-sm font-semibold text-violet-300" : "text-sm font-semibold text-white/80"}>
                        {tx[3]}
                      </div>

                    </div>

                  ))}

                </div>

              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                      Your Card
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      NOLERA X Card
                    </h2>
                  </div>
                  <CreditCard className="text-purple-600" size={21} />
                </div>

                <div className="mt-5 rounded-3xl border border-purple-300/15 bg-gradient-to-br from-[#512d68] to-[#3c2549] p-5">

                  <div className="flex items-center justify-between">
                    <span className="font-bold tracking-[0.2em]">
                      NOLERA X
                    </span>
                    <div className="h-7 w-10 rounded-lg border border-fuchsia-200/40 bg-fuchsia-200/10" />
                  </div>

                  <div className="mt-12 text-sm tracking-[0.25em] text-white/60">
                    •••• •••• •••• 4821
                  </div>

                  <div className="mt-5 flex justify-between text-[10px] uppercase tracking-widest text-white/35">
                    <span>YAHYA</span>
                    <span>09/30</span>
                  </div>

                </div>

                <Link href="/cards" className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10">
                  Manage Card
                  <ChevronRight size={16} />
                </Link>

              </section>

            </div>

            <section className="mt-6 grid gap-4 md:grid-cols-2">

              <button className="flex items-center gap-4 rounded-3xl border border-purple-300/10 bg-purple-300/[0.03] p-5 text-left hover:bg-purple-300/[0.06]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/10 text-purple-600">
                  <UserRound size={21} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">NOLERA ID</div>
                  <div className="mt-1 text-xs text-white/35">
                    One identity across your NOLERA services
                  </div>
                </div>
                <ChevronRight size={18} className="text-white/25" />
              </button>

              <button className="flex items-center gap-4 rounded-3xl border border-violet-300/10 bg-violet-300/[0.03] p-5 text-left hover:bg-violet-300/[0.06]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                  <ShieldCheck size={21} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Security Center</div>
                  <div className="mt-1 text-xs text-white/35">
                    2FA, trusted devices and transaction protection
                  </div>
                </div>
                <ChevronRight size={18} className="text-white/25" />
              </button>

            </section>

            <footer className="mt-10 border-t border-white/5 pt-6 text-center text-[11px] leading-5 text-white/25">
              NOLERA X is currently an investor demonstration prototype.
              Real financial services require appropriate licensing,
              regulated partners, KYC/AML controls and secure infrastructure.
            </footer>

          </div>
        </section>
      </div>
    </main>
  )
}
