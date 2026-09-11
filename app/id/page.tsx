"use client";

import { useEffect, useState } from "react";
import { getNoleraIdentity, type NoleraIdentity } from "@/lib/nolera-id";

export default function NoleraIdPage() {
  const [identity, setIdentity] = useState<NoleraIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;

    getNoleraIdentity()
      .then((value) => {
        if (!mounted) return;
        setIdentity(value);
        if (!value) setError("يجب تسجيل الدخول لعرض NOLERA ID.");
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "تعذر تحميل الهوية.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function copyId() {
    if (!identity) return;

    try {
      await navigator.clipboard.writeText(identity.noleraId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("تعذر نسخ NOLERA ID.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white p-6 md:p-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
          جارٍ تحميل NOLERA ID...
        </div>
      </main>
    );
  }

  if (!identity) {
    return (
      <main className="min-h-screen bg-[#05070b] text-white p-6 md:p-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-black">NOLERA ID</h1>
          <p className="mt-3 text-red-300">{error || "لا توجد هوية مرتبطة بالحساب."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070b] text-white p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-purple-300">NOLERA X</p>
              <h1 className="mt-1 text-3xl font-black">NOLERA ID</h1>
            </div>

            <div
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                identity.verified
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-amber-500/15 text-amber-300"
              }`}
            >
              {identity.verified ? "موثّق" : "غير موثّق"}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-white/50">الاسم</p>
            <h2 className="mt-1 text-xl font-bold">
              {identity.name || "NOLERA User"}
            </h2>

            {identity.email && (
              <p className="mt-1 text-sm text-white/50">{identity.email}</p>
            )}

            {identity.phone && (
              <p className="mt-1 text-sm text-white/50">{identity.phone}</p>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
            <p className="text-sm text-white/50">معرّفك</p>
            <p className="mt-2 break-all font-mono text-xl font-bold">
              {identity.noleraId}
            </p>

            <button
              onClick={copyId}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold hover:bg-purple-500"
            >
              {copied ? "تم النسخ ✓" : "نسخ NOLERA ID"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/50">حالة الحساب</p>
              <p className="mt-2 font-bold text-emerald-300">نشط</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-white/50">التحقق</p>
              <p
                className={`mt-2 font-bold ${
                  identity.verified
                    ? "text-emerald-300"
                    : "text-amber-300"
                }`}
              >
                {identity.verified ? "تم التحقق" : "قيد التحقق"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
