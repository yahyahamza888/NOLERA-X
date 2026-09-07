"use client";

import { useState } from "react";

export default function CardsPage() {
  const [showNumber, setShowNumber] = useState(false);
  const [frozen, setFrozen] = useState(false);

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] p-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm text-slate-500">NOLERA X</p>
          <h1 className="mt-1 text-3xl font-black">بطاقاتي</h1>
        </div>

        <div className="relative mx-auto max-w-md overflow-hidden rounded-[30px] bg-slate-950 p-7 text-white shadow-2xl">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50">NOLERA X</p>
                <p className="font-black">VIRTUAL CARD</p>
              </div>
              <div className="text-2xl font-black italic">NX</div>
            </div>

            <div className="mt-12">
              <div className="mb-3 h-10 w-14 rounded-lg bg-white/80" />
              <p className="font-mono text-xl tracking-[3px]">
                {showNumber
                  ? "5392 8471 2910 7284"
                  : "•••• •••• •••• 7284"}
              </p>
            </div>

            <div className="mt-8 flex justify-between">
              <div>
                <p className="text-[10px] text-white/50">CARD HOLDER</p>
                <p className="text-sm font-bold">YAHYA</p>
              </div>

              <div>
                <p className="text-[10px] text-white/50">EXPIRES</p>
                <p className="text-sm font-bold">09/30</p>
              </div>

              <div>
                <p className="text-[10px] text-white/50">CVV</p>
                <p className="text-sm font-bold">•••</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3">
          <button
            onClick={() => setShowNumber(!showNumber)}
            className="rounded-2xl border bg-white p-4 font-bold shadow-sm"
          >
            {showNumber ? "إخفاء البيانات" : "عرض البيانات"}
          </button>

          <button
            onClick={() => setFrozen(!frozen)}
            className={`rounded-2xl p-4 font-bold shadow-sm ${
              frozen ? "bg-red-600 text-white" : "border bg-white"
            }`}
          >
            {frozen ? "إلغاء تجميد البطاقة" : "تجميد البطاقة"}
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <CardOption icon="＋" title="إضافة بطاقة" />
          <CardOption icon="🔒" title="إعدادات الأمان" />
          <CardOption icon="📊" title="عمليات البطاقة" />
        </div>
      </div>
    </main>
  );
}

function CardOption({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <button className="rounded-2xl border bg-white p-5 text-right shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 text-2xl">{icon}</div>
      <p className="font-black">{title}</p>
    </button>
  );
}
