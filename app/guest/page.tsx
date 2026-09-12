"use client"

import NoleraBrand from "../../components/NoleraBrand"

import Link from "next/link"
import {
  ArrowLeft,
  Wallet,
  Send,
  CreditCard,
  Store,
  ShieldCheck,
  Globe2,
  LogIn,
} from "lucide-react"

export default function GuestPage() {
  const services = [
    {
      title: "Wallet",
      text: "Explore the NOLERA wallet",
      icon: Wallet,
      href: "/wallet",
    },
    {
      title: "Transfers",
      text: "Send and receive money",
      icon: Send,
      href: "/transfers",
    },
    {
      title: "Cards",
      text: "Explore NOLERA cards",
      icon: CreditCard,
      href: "/cards",
    },
    {
      title: "Store",
      text: "Explore digital products",
      icon: Store,
      href: "/store",
    },
  ]

  return (
    <>
      <div className="fixed left-5 top-5 z-50">
        <NoleraBrand compact />
      </div>

      <main
      dir="ltr"
      className="min-h-screen bg-[#12091d] px-4 py-6 text-white"
    >
      <div className="mx-auto max-w-5xl">

        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white"
          >
            <ArrowLeft size={17} />
            Welcome
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-[#24122f]"
          >
            <LogIn size={16} />
            Sign In
          </Link>
        </div>

        <section className="relative mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 text-[15rem] font-black leading-none text-yellow-300/[0.08]">
            X
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <span className="absolute text-6xl font-black text-yellow-300/20">
                  X
                </span>
                <span className="relative text-2xl font-black tracking-[-0.12em]">
                  NR
                </span>
              </div>

              <div>
                <p className="text-2xl font-black">NOLERA X</p>
                <p className="text-xs text-white/40">Guest Mode</p>
              </div>
            </div>

            <h1 className="text-3xl font-black">
              Explore NOLERA X
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-white/60">
              Browse the platform and explore available services.
              Sign in when you want to use account-based financial features.
            </p>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <Link
                key={service.title}
                href={service.href}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 transition hover:-translate-y-1 hover:bg-white/[0.09]"
              >
                <Icon className="mb-4 text-yellow-300" size={25} />

                <h2 className="font-black">
                  {service.title}
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/40">
                  {service.text}
                </p>
              </Link>
            )
          })}
        </section>

        <section className="mt-6 rounded-3xl border border-yellow-300/10 bg-yellow-300/[0.04] p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-1 shrink-0 text-yellow-300" size={22} />

            <div>
              <h2 className="font-black">
                Guest access • Financial actions require sign in
              </h2>

              <p className="mt-1 text-sm leading-6 text-white/50">
                You can explore NOLERA X as a guest.
                Account-based financial actions require secure sign in.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/30">
          <Globe2 size={14} />
          NOLERA X • USD
        </div>

      </div>
      </main>
    </>
  )
}
