"use client";

import { useState } from "react";

const markets = [
  { name: "Bitcoin", symbol: "BTC", price: "$104,820", change: "+2.41%", icon: "₿" },
  { name: "Ethereum", symbol: "ETH", price: "$4,180", change: "+1.82%", icon: "◆" },
  { name: "Pi Network", symbol: "PI", price: "$0.39", change: "-1.20%", icon: "π" },
  { name: "US Dollar", symbol: "USD", price: "3,500 SDG", change: "+0.15%", icon: "$" },
  { name: "Euro", symbol: "EUR", price: "4,080 SDG", change: "+0.32%", icon: "€" },
  { name: "Gold", symbol: "XAU", price: "$3,580", change: "+0.74%", icon: "Au" },
];

export default function MarketsPage() {
  const [selected, setSelected] = useState(markets[0]);

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] p-5">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <p className="text-sm text-slate-500">NOLERA X</p>
          <h1 className="mt-1 text-3xl font-black">الأسواق</h1>
          <p className="mt-2 text-sm text-slate-500">
            تابع العملات والأسواق من مكان واحد.
          </p>
        </div>

        <div className="rounded-[28px] bg-slate-950 p-7 text-white shadow-xl">
          <p className="text-sm text-white/50">
            السعر الحالي
          </p>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-black">
              {selected.icon}
            </div>

            <div>
              <h2 className="text-xl font-black">
                {selected.name}
              </h2>
              <p className="text-sm text-white/50">
                {selected.symbol}
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-end justify-between">
            <p className="text-4xl font-black">
              {selected.price}
            </p>

            <span
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                selected.change.startsWith("+")
                  ? "bg-white/10 text-white"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {selected.change}
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <button
              key={market.symbol}
              onClick={() => setSelected(market)}
              className={`rounded-[24px] border bg-white p-5 text-right shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                selected.symbol === market.symbol
                  ? "ring-2 ring-slate-950"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 font-black">
                    {market.icon}
                  </div>

                  <div>
                    <p className="font-black">
                      {market.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {market.symbol}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-sm font-black ${
                    market.change.startsWith("+")
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {market.change}
                </span>

              </div>

              <p className="mt-5 text-lg font-black">
                {market.price}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-7 rounded-[26px] border bg-white p-6 shadow-sm">
          <h2 className="font-black">تنبيه الأسعار 🔔</h2>

          <p className="mt-2 text-sm text-slate-500">
            احصل على تنبيه عندما يصل الأصل إلى السعر الذي تحدده.
          </p>

          <button className="mt-5 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white">
            إنشاء تنبيه
          </button>
        </div>

      </div>
    </main>
  );
}
