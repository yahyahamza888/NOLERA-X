"use client";

import { useState } from "react";

export default function NoleraIdPage() {
  const [copied, setCopied] = useState(false);

  const userId = "NXR-USER-001";

  const copyId = async () => {
    await navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-white p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">NOLERA ID</h1>
        <p className="mt-2 text-white/60">
          هويتك الرقمية داخل منظومة NOLERA X
        </p>

        <div className="mt-8 rounded-3xl border border-cyan-300/15 bg-white/[0.03] p-6">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400 text-2xl font-black text-black">
              NX
            </div>

            <div>
              <h2 className="text-xl font-bold">NOLERA User</h2>
              <p className="text-sm text-white/50">Verified Profile</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-white/50">NOLERA ID</p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-lg">{userId}</p>

              <button
                onClick={copyId}
                className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black"
              >
                {copied ? "تم النسخ ✓" : "نسخ ID"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 p-5">
              <p className="text-sm text-white/50">حالة الحساب</p>
              <p className="mt-2 font-bold text-emerald-300">نشط</p>
            </div>

            <div className="rounded-2xl border border-white/10 p-5">
              <p className="text-sm text-white/50">التحقق</p>
              <p className="mt-2 font-bold text-amber-300">قيد الإعداد</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/50">
          NOLERA ID هو نموذج تجريبي حاليًا، وسيتم ربطه لاحقًا بنظام حسابات
          ومصادقة حقيقي وآمن.
        </div>
      </div>
    </main>
  );
}
