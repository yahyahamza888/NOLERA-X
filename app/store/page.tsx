"use client";

import { useState } from "react";

const products = [
  { name: "بطاقة رقمية", price: 15000, icon: "💳", category: "خدمات" },
  { name: "اشتراك Premium", price: 25000, icon: "⭐", category: "اشتراكات" },
  { name: "قالب أعمال", price: 12000, icon: "📄", category: "رقمي" },
  { name: "خدمة تصميم", price: 30000, icon: "🎨", category: "خدمات" },
  { name: "كتاب إلكتروني", price: 8000, icon: "📚", category: "رقمي" },
  { name: "قسيمة شراء", price: 20000, icon: "🎟️", category: "قسائم" },
];

export default function StorePage() {
  const [category, setCategory] = useState("الكل");
  const [cart, setCart] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const categories = ["الكل", "خدمات", "رقمي", "اشتراكات", "قسائم"];

  const filtered =
    category === "الكل"
      ? products
      : products.filter((p) => p.category === category);

  function addToCart(name: string) {
    setCart([...cart, name]);
    setMessage(`تمت إضافة "${name}" إلى السلة`);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] p-5">
      <div className="mx-auto max-w-6xl">

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-slate-500">NOLERA X</p>
            <h1 className="mt-1 text-3xl font-black">
              NOLERA Store 🛍️
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              خدمات ومنتجات رقمية في مكان واحد.
            </p>
          </div>

          <button
            onClick={() =>
              setMessage(`السلة تحتوي على ${cart.length} منتج`)
            }
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
          >
            🛒 السلة ({cart.length})
          </button>
        </div>

        <div className="rounded-[24px] border bg-white p-4 shadow-sm">
          <input
            placeholder="ابحث عن منتج أو خدمة..."
            className="w-full rounded-2xl bg-slate-100 px-5 py-4 outline-none"
          />
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold ${
                category === item
                  ? "bg-slate-950 text-white"
                  : "border bg-white text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.name}
              className="overflow-hidden rounded-[26px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-40 items-center justify-center bg-slate-100 text-6xl">
                {product.icon}
              </div>

              <div className="p-5">
                <p className="text-xs font-bold text-slate-500">
                  {product.category}
                </p>

                <h2 className="mt-2 font-black">
                  {product.name}
                </h2>

                <div className="mt-4 flex items-center justify-between">
                  <p className="font-black">
                    {product.price.toLocaleString()} SDG
                  </p>

                  <button
                    onClick={() => addToCart(product.name)}
                    className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white"
                  >
                    أضف للسلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-xl">
            {message}
          </div>
        )}

      </div>
    </main>
  );
}
