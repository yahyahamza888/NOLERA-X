"use client"

import Link from "next/link"
import { ArrowLeft, UserRound, Mail, Wallet, ShieldCheck, CreditCard } from "lucide-react"
import { demoAccount } from "../../lib/account"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft size={18} />
          العودة إلى NOLERA X
        </Link>

        <div className="mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <UserRound size={30} />
          </div>

          <h1 className="mt-5 text-3xl font-bold">Profile</h1>
          <p className="mt-2 text-white/40">
            الملف الشخصي وحساب NOLERA X
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-4">
              <UserRound size={20} className="text-cyan-300" />
              <div>
                <p className="text-xs text-white/35">الاسم</p>
                <p className="mt-1 font-semibold">{demoAccount.name}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-4">
              <Mail size={20} className="text-cyan-300" />
              <div>
                <p className="text-xs text-white/35">البريد الإلكتروني</p>
                <p className="mt-1 font-semibold">{demoAccount.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-4">
              <CreditCard size={20} className="text-cyan-300" />
              <div>
                <p className="text-xs text-white/35">NOLERA ID</p>
                <p className="mt-1 font-semibold">{demoAccount.id}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-4">
              <Wallet size={20} className="text-cyan-300" />
              <div>
                <p className="text-xs text-white/35">العملة الأساسية</p>
                <p className="mt-1 font-semibold">{demoAccount.currency}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-4">
              <ShieldCheck size={20} className="text-cyan-300" />
              <div>
                <p className="text-xs text-white/35">حالة المحفظة</p>
                <p className="mt-1 font-semibold">
                  {demoAccount.walletConnected ? "متصلة" : "غير متصلة"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/settings"
          className="mt-6 block rounded-xl bg-cyan-400 py-4 text-center font-bold text-slate-950 hover:bg-cyan-300"
        >
          إدارة إعدادات الحساب
        </Link>

        <p className="mt-6 text-center text-xs text-white/30">
          وضع تجريبي — بيانات الحساب الحالية ليست مرتبطة بقاعدة بيانات حقيقية.
        </p>
      </div>
    </main>
  )
}
