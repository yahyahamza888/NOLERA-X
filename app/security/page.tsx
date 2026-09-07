"use client";

import { useState } from "react";

export default function SecurityPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(false);

  return (
    <main className="min-h-screen bg-[#05070b] text-white p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Security Center</h1>
        <p className="mt-2 text-white/60">
          إدارة حماية حسابك في NOLERA X
        </p>

        <div className="mt-8 space-y-4">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold">Two-Factor Authentication</h2>
                <p className="mt-1 text-sm text-white/50">
                  طبقة حماية إضافية عند تسجيل الدخول.
                </p>
              </div>

              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`rounded-full px-5 py-2 font-semibold ${
                  twoFactor
                    ? "bg-emerald-400 text-black"
                    : "bg-white/10 text-white"
                }`}
              >
                {twoFactor ? "مفعّل" : "غير مفعّل"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold">Biometric Login</h2>
                <p className="mt-1 text-sm text-white/50">
                  تسجيل الدخول باستخدام بصمة الجهاز عند توفرها.
                </p>
              </div>

              <button
                onClick={() => setBiometric(!biometric)}
                className={`rounded-full px-5 py-2 font-semibold ${
                  biometric
                    ? "bg-cyan-400 text-black"
                    : "bg-white/10 text-white"
                }`}
              >
                {biometric ? "مفعّل" : "غير مفعّل"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-bold">Login Activity</h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="font-medium">Android Device</p>
                  <p className="text-sm text-white/40">الآن</p>
                </div>
                <span className="text-emerald-300">الجلسة الحالية</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Web Browser</p>
                  <p className="text-sm text-white/40">أمس</p>
                </div>
                <span className="text-white/50">تم تسجيل الدخول</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-6 rounded-2xl border border-red-300/10 bg-red-300/5 p-4 text-sm text-red-100/70">
          هذه إعدادات تجريبية. المصادقة الحقيقية وإدارة الجلسات ستحتاج إلى
          نظام Backend آمن قبل إطلاق الخدمات المالية.
        </div>
      </div>
    </main>
  );
}
