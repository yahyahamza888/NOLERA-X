"use client";

import { useState } from "react"
import { Send, ArrowDownToLine, Plus, ArrowUpFromLine, CreditCard, Wallet, Bell, UserRound, ShieldCheck, Settings, ChevronRight, Menu, X, Zap, Eye, EyeOff, Globe2 } from "lucide-react"

export default function Home() {
  const [showBalance, setShowBalance] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#071417] text-white">
      <div className="flex min-h-screen">

        <aside className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-72 border-r border-cyan-100/10 bg-[#081b1f] p-5 transition-transform lg:static lg:translate-x-0`}>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Zap size={23} />
            </div>
            <div>
              <div className="text-lg font-bold">NOLERA X</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/60">
                Digital Finance
              </div>
            </div>
          </div>

          <p className="mt-10 px-3 text-[10px] uppercase tracking-[0.25em] text-white/30">
            Main
          </p>

          <nav className="mt-3 space-y-2">
            {[
              ["Overview", Home],
              ["Payments", Send],
              ["Cards", CreditCard],
              ["Transactions", Wallet],
            ].map(([name, Icon]) => (
              <button key={name as string} className="flex w-full items-center gap-3 rounded-2xl bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
                <Icon size={18} />
                {name as string}
              </button>
            ))}
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
              <button key={name as string} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/55 hover:bg-white/5 hover:text-white">
                <Icon size={18} />
                {name as string}
              </button>
            ))}
          </nav>

        </aside>

        <section className="min-w-0 flex-1">

          <header className="border-b border-cyan-100/10 bg-[#071417]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between">

              <div className="flex items-center gap-3">
                <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-white/10 p-2 lg:hidden">
                  <Menu size={20} />
                </button>

                <div>
                  <p className="text-xs text-white/35">Good day</p>
                  <h1 className="text-xl font-semibold">Welcome to NOLERA X</h1>
                </div>
              </div>

              <button className="relative rounded-2xl border border-white/10 p-3 text-white/60">
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-lime-300" />
              </button>

            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">

            <section className="rounded-[30px] border border-cyan-300/15 bg-gradient-to-br from-cyan-600/20 via-[#0b2529] to-emerald-500/10 p-6 sm:p-8">

              <div className="flex flex-wrap items-center justify-between gap-5">

                <div>
                  <div className="flex items-center gap-2 text-sm text-white/45">
                    <Wallet size={16} />
                    Total Balance
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-4xl font-bold sm:text-5xl">
                      {showBalance ? "$24,680.50" : "••••••••"}
                    </div>

                    <button onClick={() => setShowBalance(!showBalance)} className="rounded-xl bg-white/5 p-2 text-white/50">
                      {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="mt-3 text-sm text-emerald-300">
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
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                  Quick Actions
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  Move your money
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                <button className="group rounded-3xl border border-cyan-300/15 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[0.05]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <Send size={25} />
                  </div>
                  <h3 className="mt-5 font-semibold">Send Money</h3>
                  <p className="mt-1 text-xs text-white/35">Transfer instantly</p>
                  <ChevronRight className="mt-4 text-white/20 group-hover:text-cyan-300" size={18} />
                </button>

                <button className="group rounded-3xl border border-emerald-300/15 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-emerald-300/[0.05]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <ArrowDownToLine size={25} />
                  </div>
                  <h3 className="mt-5 font-semibold">Receive Money</h3>
                  <p className="mt-1 text-xs text-white/35">Get paid securely</p>
                  <ChevronRight className="mt-4 text-white/20 group-hover:text-emerald-300" size={18} />
                </button>

                <button className="group rounded-3xl border border-cyan-300/15 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/[0.05]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                    <Plus size={25} />
                  </div>
                  <h3 className="mt-5 font-semibold">Add Money</h3>
                  <p className="mt-1 text-xs text-white/35">Fund your account</p>
                  <ChevronRight className="mt-4 text-white/20 group-hover:text-cyan-200" size={18} />
                </button>

                <button className="group rounded-3xl border border-lime-300/15 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-lime-300/30 hover:bg-lime-300/[0.05]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-200">
                    <ArrowUpFromLine size={25} />
                  </div>
                  <h3 className="mt-5 font-semibold">Withdraw</h3>
                  <p className="mt-1 text-xs text-white/35">Move funds out</p>
                  <ChevronRight className="mt-4 text-white/20 group-hover:text-lime-200" size={18} />
                </button>

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

                  <button className="text-xs font-semibold text-cyan-300">
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

                      <div className={tx[4] ? "text-sm font-semibold text-emerald-300" : "text-sm font-semibold text-white/80"}>
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
                  <CreditCard className="text-cyan-300" size={21} />
                </div>

                <div className="mt-5 rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#0c3035] to-[#102523] p-5">

                  <div className="flex items-center justify-between">
                    <span className="font-bold tracking-[0.2em]">
                      NOLERA X
                    </span>
                    <div className="h-7 w-10 rounded-lg border border-lime-200/40 bg-lime-200/10" />
                  </div>

                  <div className="mt-12 text-sm tracking-[0.25em] text-white/60">
                    •••• •••• •••• 4821
                  </div>

                  <div className="mt-5 flex justify-between text-[10px] uppercase tracking-widest text-white/35">
                    <span>YAHYA</span>
                    <span>09/30</span>
                  </div>

                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10">
                  Manage Card
                  <ChevronRight size={16} />
                </button>

              </section>

            </div>

            <section className="mt-6 grid gap-4 md:grid-cols-2">

              <button className="flex items-center gap-4 rounded-3xl border border-cyan-300/10 bg-cyan-300/[0.03] p-5 text-left hover:bg-cyan-300/[0.06]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
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

              <button className="flex items-center gap-4 rounded-3xl border border-emerald-300/10 bg-emerald-300/[0.03] p-5 text-left hover:bg-emerald-300/[0.06]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
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
