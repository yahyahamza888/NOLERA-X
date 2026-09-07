"use client";

import { useState } from "react";

type Page =
  | "Overview"
  | "Send Money"
  | "Receive Money"
  | "Add Money"
  | "Withdraw"
  | "Cards"
  | "Transactions"
  | "Notifications"
  | "KYC & Verification"
  | "Security"
  | "Settings";

const menu: Page[] = [
  "Overview",
  "Send Money",
  "Receive Money",
  "Add Money",
  "Withdraw",
  "Cards",
  "Transactions",
  "Notifications",
  "KYC & Verification",
  "Security",
  "Settings",
];

export default function Home() {
  const [page, setPage] = useState<Page>("Overview");

  return (
    <main className="min-h-screen bg-[#071417] text-white">
      <header className="sticky top-0 z-20 border-b border-cyan-100/10 bg-[#071417]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button
            onClick={() => setPage("Overview")}
            className="text-2xl font-black"
          >
            NOLERA <span className="text-cyan-300">X</span>
          </button>

          <button
            onClick={() => setPage("Notifications")}
            className="rounded-xl border border-cyan-100/10 px-4 py-2 hover:bg-white/5"
          >
            🔔 Notifications
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-cyan-100/10 p-3 md:min-h-[calc(100vh-73px)] md:w-64 md:border-b-0 md:border-r">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={`mb-1 w-full rounded-xl px-4 py-3 text-left text-sm ${
                page === item
                  ? "bg-cyan-500"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </aside>

        <section className="flex-1 p-5 md:p-8">
          <h1 className="text-3xl font-bold">{page}</h1>
          <p className="mt-2 text-slate-400">
            NOLERA X — Next Generation Digital Finance Platform
          </p>

          {page === "Overview" && <Overview go={setPage} />}
          {page === "Send Money" && (
            <Form title="Send Money" fields={["Recipient", "Amount", "Currency", "Reference"]} />
          )}
          {page === "Receive Money" && (
            <Form title="Receive Money" fields={["Sender", "Amount", "Currency", "Reference"]} />
          )}
          {page === "Add Money" && (
            <Form title="Add Money" fields={["Amount", "Currency", "Funding Method"]} />
          )}
          {page === "Withdraw" && (
            <Form title="Withdraw Money" fields={["Amount", "Currency", "Destination"]} />
          )}
          {page === "Cards" && <Cards />}
          {page === "Transactions" && <Transactions />}
          {page === "Notifications" && <Notifications />}
          {page === "KYC & Verification" && <KYC />}
          {page === "Security" && <Security />}
          {page === "Settings" && <Settings />}
        </section>
      </div>

      <footer className="border-t border-cyan-100/10 p-6 text-center text-sm text-slate-500">
        NOLERA X © 2026 • Investor Prototype • Services subject to applicable
        licensing, regulation and compliance requirements.
      </footer>
    </main>
  );
}

function Overview({ go }: { go: (p: Page) => void }) {
  const actions: Page[] = [
    "Send Money",
    "Receive Money",
    "Add Money",
    "Withdraw",
  ];

  return (
    <div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <Card title="Total Balance" value="$12,480.00" />
        <Card title="Available Balance" value="$9,850.00" />
        <Card title="Pending" value="$2,630.00" />
      </div>

      <div className="mt-7 rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-widest text-cyan-300">
          NOLERA ID
        </p>
        <h2 className="mt-2 text-2xl font-bold">NX-DEMO-2048</h2>
        <p className="mt-2 text-slate-400">
          One identity for your local and global financial services.
        </p>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        {actions.map((a) => (
          <button
            key={a}
            onClick={() => go(a)}
            className="rounded-2xl border border-cyan-100/10 bg-white/5 p-5 text-left hover:bg-white/10"
          >
            <b>{a}</b>
            <p className="mt-2 text-sm text-slate-400">
              Open {a} service
            </p>
          </button>
        ))}
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <button
          onClick={() => go("KYC & Verification")}
          className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6 text-left hover:bg-white/10"
        >
          <h2 className="text-xl font-bold">Identity & KYC</h2>
          <p className="mt-2 text-slate-400">
            Verify identity before regulated financial services.
          </p>
        </button>

        <button
          onClick={() => go("Security")}
          className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6 text-left hover:bg-white/10"
        >
          <h2 className="text-xl font-bold">Security Center</h2>
          <p className="mt-2 text-slate-400">
            Protect your account with modern security controls.
          </p>
        </button>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Form({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div className="mt-7 max-w-2xl rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
      <div className="mb-6 rounded-2xl border border-lime-300/20 bg-lime-300/5 p-4 text-sm text-lime-200">
        Demo workflow — no real financial transaction is executed.
      </div>

      {fields.map((field) => (
        <label key={field} className="mb-5 block">
          <span className="mb-2 block text-sm text-slate-400">
            {field}
          </span>
          <input
            placeholder={field}
            className="w-full rounded-xl border border-cyan-100/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
          />
        </label>
      ))}

      <button
        onClick={() =>
          alert("Demo only — no real financial transaction is executed.")
        }
        className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-400"
      >
        Continue
      </button>
    </div>
  );
}

function Cards() {
  return (
    <Box title="Cards">
      <div className="rounded-3xl bg-gradient-to-br from-cyan-600 to-slate-900 p-7">
        <p className="text-sm">NOLERA X</p>
        <p className="mt-12 text-2xl tracking-[5px]">
          •••• •••• •••• 4821
        </p>
        <div className="mt-6 flex justify-between">
          <span>DEMO USER</span>
          <span>12/30</span>
        </div>
      </div>

      <button
        onClick={() => alert("Card management demo")}
        className="mt-5 rounded-xl bg-cyan-500 px-5 py-3"
      >
        Manage Card
      </button>
    </Box>
  );
}

function Transactions() {
  return (
    <Box title="Transactions">
      {[
        "Received +$1,200.00",
        "Payment -$85.50",
        "Transfer -$300.00",
        "Added +$500.00",
      ].map((x) => (
        <div
          key={x}
          className="flex justify-between border-b border-cyan-100/10 py-4"
        >
          <span>{x}</span>
          <span className="text-slate-500">Demo</span>
        </div>
      ))}
    </Box>
  );
}

function Notifications() {
  return (
    <Box title="Notifications">
      {[
        "Welcome to NOLERA X",
        "Your KYC verification is pending",
        "New security alert",
        "Transfer status updated",
      ].map((x) => (
        <div key={x} className="border-b border-cyan-100/10 py-4">
          <b>{x}</b>
          <p className="text-sm text-slate-500">
            Today • Demo notification
          </p>
        </div>
      ))}
    </Box>
  );
}

function KYC() {
  return (
    <Box title="Identity Verification">
      <p className="text-slate-400">
        Complete identity verification before accessing regulated
        financial services.
      </p>

      {[
        "Personal Information",
        "Government ID",
        "Selfie / Identity Check",
        "Address Verification",
      ].map((x) => (
        <div
          key={x}
          className="mt-4 rounded-xl border border-cyan-100/10 p-4"
        >
          {x}
          <span className="float-right text-lime-200">Pending</span>
        </div>
      ))}

      <button
        onClick={() => alert("KYC demo workflow")}
        className="mt-6 rounded-xl bg-cyan-500 px-6 py-3"
      >
        Start Verification
      </button>
    </Box>
  );
}

function Security() {
  return (
    <Box title="Security Center">
      {[
        "Two-Factor Authentication",
        "Login Alerts",
        "Trusted Devices",
        "Transaction Protection",
      ].map((x) => (
        <div
          key={x}
          className="mb-3 flex justify-between rounded-xl border border-cyan-100/10 p-4"
        >
          <span>{x}</span>
          <span className="text-emerald-400">Enabled</span>
        </div>
      ))}
    </Box>
  );
}

function Settings() {
  return (
    <Box title="Settings">
      {[
        "Profile",
        "NOLERA ID",
        "Local / Global Account",
        "Language",
        "Currency",
        "Privacy",
        "Terms & Conditions",
      ].map((x) => (
        <button
          key={x}
          onClick={() => alert(`${x} — demo settings module`)}
          className="mb-3 block w-full rounded-xl border border-cyan-100/10 p-4 text-left hover:bg-white/5"
        >
          {x}
        </button>
      ))}
    </Box>
  );
}

function Box({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7 max-w-3xl rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
      <h2 className="mb-5 text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
