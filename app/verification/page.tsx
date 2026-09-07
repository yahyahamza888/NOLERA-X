"use client";

import { useState } from "react";

export default function VerificationPage() {
  const [started, setStarted] = useState(false);

  return (
    <main className="min-h-screen bg-[#05070b] text-white p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Verification</h1>
        <p className="mt-2 text-white/60">
          التحقق من هوية المستخدم في NOLERA X
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="rounded-2xl border border-amber-300/10 bg-amber-300/5 p-5">
            <p className="text-sm text-amber-200">حالة التحقق</p>
            <p className="mt-2 text-xl font-bold">غير مكتمل</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 p-5">
              <p className="font-semibold">1. المعلومات الشخصية</p>
              <p className="mt-1 text-sm text-white/50">
                الاسم والبيانات الأساسية.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-5">
              <p className="font-semibold">2. إثبات الهوية</p>
              <p className="mt-1 text-sm text-white/50">
                مستند هوية رسمي عند تفعيل نظام KYC الحقيقي.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-5">
              <p className="font-semibold">3. مراجعة الحساب</p>
              <p className="mt-1 text-sm text-white/50">
                مراجعة البيانات قبل اعتماد الحساب.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="mt-6 w-full rounded-2xl bg-cyan-400 px-5 py-4 font-bold text-black"
          >
            {started ? "بدأت عملية التحقق التجريبية ✓" : "بدء التحقق"}
          </button>

          {started && (
            <div className="mt-4 rounded-2xl bg-cyan-400/10 p-4 text-cyan-200">
              تم بدء العملية التجريبية. نظام KYC الحقيقي سيتم ربطه لاحقًا
              بمزود معتمد.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
