"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "مرحباً بك في NOLERA AI 👋 كيف يمكنني مساعدتك اليوم؟",
    },
  ]);

  function sendMessage() {
    const text = input.trim();

    if (!text) return;

    setMessages((old) => [
      ...old,
      { role: "user", text },
      {
        role: "ai",
        text: "تم استلام رسالتك. سيتم ربط NOLERA AI بمحرك ذكاء اصطناعي حقيقي في المرحلة القادمة.",
      },
    ]);

    setInput("");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7fb] p-5">
      <div className="mx-auto flex max-w-5xl flex-col">

        <div className="mb-6">
          <p className="text-sm text-slate-500">NOLERA X</p>

          <h1 className="mt-1 text-3xl font-black">
            NOLERA AI 🤖
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            مساعدك الذكي داخل منظومة NOLERA X.
          </p>
        </div>

        <div className="flex min-h-[65vh] flex-col overflow-hidden rounded-[30px] border bg-white shadow-sm">

          <div className="flex items-center gap-3 border-b p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white">
              AI
            </div>

            <div>
              <p className="font-black">NOLERA AI</p>
              <p className="text-xs text-emerald-600">
                ● متصل
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-7 ${
                    message.role === "user"
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="اكتب رسالتك إلى NOLERA AI..."
                className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-slate-950"
              />

              <button
                onClick={sendMessage}
                className="rounded-2xl bg-slate-950 px-6 font-black text-white"
              >
                إرسال
              </button>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
