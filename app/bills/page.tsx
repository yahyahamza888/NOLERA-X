"use client";

import { useState } from "react";

const bills = [
  { name: "الكهرباء", icon: "⚡", color: "bg-yellow-100" },
  { name: "المياه", icon: "💧", color: "bg-blue-100" },
  { name: "الإنترنت", icon: "🌐", color: "bg-indigo-100" },
  { name: "الهاتف", icon: "📱", color: "bg-green-100" },
  { name: "التلفزيون", icon: "📺", color: "bg-purple-100" },
  { name: "أخرى", icon: "＋", color: "bg-slate-100" },
];

export default function BillsPage() {
  const [selected, setSelected] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  function payBill() {
    if (!selected || !amount) {
      setMessage("اختر الفاتورة وأدخل المبلغ أولاً");
      return;
    }

    setMessage(
      `تم تجهيز دفع فاتورة ${selected} بمبلغ ${Number(amount).toLocaleString()} SDG`
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] p-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm text-slate-500">NOLERA X</p>
          <h1 className="mt-1 text-3xl font-black">الفواتير والدفع</h1>
          <p className="mt-2 text-sm text-slate-500">
            ادفع خدماتك من مكان واحد.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {bills.map((bill) => (
            <button
              key={bill.name}
              onClick={() => {
                setSelected(bill.name);
                setMessage("");
              }}
              className={`rounded-2xl border bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 ${
                selected === bill.name
                  ? "border-slate-950 ring-2 ring-slate-950"
                  : ""
              }`}
            >
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${bill.color}`}
              >
                {bill.icon}
              </div>

              <p className="text-sm font-black">{bill.name}</p>
            </button>
          ))}
        </div>

        <div className="mt-7 rounded-[28px] border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">دفع فاتورة</h2>

          <p className="mt-1 text-sm text-slate-500">
            {selected
              ? `الخدمة المختارة: ${selected}`
              : "اختر نوع الفاتورة من الأعلى"}
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold">
                رقم الحساب / الهاتف
              </label>

              <input
                placeholder="أدخل رقم الحساب أو الهاتف"
                className="w-full rounded-2xl border bg-slate-50 px-4 py-4 outline-none focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">المبلغ</label>

              <div className="flex overflow-hidden rounded-2xl border bg-slate-50">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 text-xl font-black outline-none"
                />

                <span className="flex items-center px-4 font-bold">
                  SDG
                </span>
              </div>
            </div>

            <button
              onClick={payBill}
              className="w-full rounded-2xl bg-slate-950 py-4 font-black text-white transition hover:bg-slate-800"
            >
              دفع الفاتورة
            </button>

            {message && (
              <div className="rounded-2xl bg-slate-100 p-4 text-center text-sm font-bold">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="mt-7 rounded-[26px] border bg-white p-5 shadow-sm">
          <h2 className="font-black">آخر المدفوعات</h2>

          <div className="mt-4 space-y-2">
            {[
              ["⚡", "الكهرباء", "32,000 SDG"],
              ["🌐", "الإنترنت", "18,000 SDG"],
              ["📱", "الهاتف", "10,000 SDG"],
            ].map(([icon, name, value]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-2xl p-3 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    {icon}
                  </div>

                  <span className="text-sm font-bold">{name}</span>
                </div>

                <span className="text-sm font-black">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
