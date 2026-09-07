
"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Clock,
  Search,
  Settings,
  LayoutDashboard,
  CreditCard,
  LogOut,
  UserCheck,
} from "lucide-react"

const stats = [
  { title: "Total Users", value: "12,480", change: "+8.4%", icon: Users },
  { title: "Total Balance", value: "$2.84M", change: "+12.7%", icon: Wallet },
  { title: "Transactions", value: "48,291", change: "+5.2%", icon: Activity },
  { title: "Verified Users", value: "9,842", change: "+6.1%", icon: ShieldCheck },
]

const transactions = [
  { id: "TX-10482", user: "User One", type: "Transfer", amount: "$1,250", status: "Completed" },
  { id: "TX-10481", user: "User Two", type: "Card Payment", amount: "$340", status: "Completed" },
  { id: "TX-10480", user: "User Three", type: "Deposit", amount: "$2,100", status: "Pending" },
  { id: "TX-10479", user: "User Four", type: "Withdrawal", amount: "$780", status: "Completed" },
]

const users = [
  { name: "User One", email: "user1@nolera.demo", status: "Verified", plan: "Premium" },
  { name: "User Two", email: "user2@nolera.demo", status: "Verified", plan: "Standard" },
  { name: "User Three", email: "user3@nolera.demo", status: "Pending", plan: "Standard" },
  { name: "User Four", email: "user4@nolera.demo", status: "Review", plan: "Premium" },
  { name: "User Five", email: "user5@nolera.demo", status: "Verified", plan: "Standard" },
]

export default function AdminPage() {
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-200 bg-white p-5 md:flex md:flex-col">
          <div className="mb-8">
            <div className="text-2xl font-black tracking-tight">NOLERA X</div>
            <div className="mt-1 text-xs text-slate-500">Administration Center</div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              href="/transactions"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <Activity size={18} />
              Transactions
            </Link>

            <Link
              href="/cards"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <CreditCard size={18} />
              Cards
            </Link>

            <Link
              href="/verification"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <UserCheck size={18} />
              Verification
            </Link>

            <Link
              href="/security"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <ShieldCheck size={18} />
              Security
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <Settings size={18} />
              Settings
            </Link>
          </nav>

          <div className="mt-auto">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <LogOut size={18} />
              Exit Admin
            </Link>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1">

          {/* Header */}
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-5 py-5 md:px-8">
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage NOLERA X system activity and users
                </p>
              </div>

              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                Back
              </Link>
            </div>
          </header>

          <div className="space-y-6 p-5 md:p-8">

            {/* System status */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div>
                  <p className="font-semibold">System Operational</p>
                  <p className="text-sm text-slate-500">
                    All demo services are running normally
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} />
                Last checked: Just now
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ title, value, change, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <Icon size={20} />
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      {change}
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-slate-500">{title}</p>
                  <p className="mt-1 text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            {/* Transactions + Alerts */}
            <div className="grid gap-6 xl:grid-cols-3">

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                  <div>
                    <h2 className="font-bold">Recent Transactions</h2>
                    <p className="text-sm text-slate-500">
                      Latest platform activity
                    </p>
                  </div>

                  <Link
                    href="/transactions"
                    className="text-sm font-semibold underline"
                  >
                    View all
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3">ID</th>
                        <th className="px-5 py-3">User</th>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-t border-slate-100"
                        >
                          <td className="px-5 py-4 font-semibold">
                            {transaction.id}
                          </td>
                          <td className="px-5 py-4">{transaction.user}</td>
                          <td className="px-5 py-4 text-slate-500">
                            {transaction.type}
                          </td>
                          <td className="px-5 py-4 font-semibold">
                            {transaction.amount}
                          </td>
                          <td className="px-5 py-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <AlertTriangle size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold">Security Alerts</h2>
                    <p className="text-sm text-slate-500">
                      Items requiring attention
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Pending Verification
                      </span>
                      <span className="font-bold">184</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Users waiting for review
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        Security Alerts
                      </span>
                      <span className="font-bold">7</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Demo alerts requiring attention
                    </p>
                  </div>

                  <Link
                    href="/security"
                    className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                  >
                    Open Security Center
                  </Link>
                </div>
              </div>
            </div>

            {/* Users */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-bold">Users & Verification</h2>
                  <p className="text-sm text-slate-500">
                    Monitor accounts and verification status
                  </p>
                </div>

                <div className="relative w-full md:w-72">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3">User</th>
                      <th className="px-5 py-3">Email</th>
                      <th className="px-5 py-3">Plan</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.email}
                        className="border-t border-slate-100"
                      >
                        <td className="px-5 py-4 font-semibold">
                          {user.name}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {user.email}
                        </td>

                        <td className="px-5 py-4">
                          {user.plan}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-8 text-center text-sm text-slate-500"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Wallet size={20} />
                <div>
                  <h2 className="font-bold">Quick Admin Controls</h2>
                  <p className="text-sm text-slate-500">
                    Access important management areas
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/add-money"
                  className="rounded-xl border border-slate-200 p-4 text-sm font-semibold hover:bg-slate-50"
                >
                  Money Management
                </Link>

                <Link
                  href="/cards"
                  className="rounded-xl border border-slate-200 p-4 text-sm font-semibold hover:bg-slate-50"
                >
                  Card Management
                </Link>

                <Link
                  href="/verification"
                  className="rounded-xl border border-slate-200 p-4 text-sm font-semibold hover:bg-slate-50"
                >
                  KYC Verification
                </Link>

                <Link
                  href="/settings"
                  className="rounded-xl border border-slate-200 p-4 text-sm font-semibold hover:bg-slate-50"
                >
                  Platform Settings
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="pb-6 text-center text-xs text-slate-400">
              NOLERA X Admin • Demo prototype • No real financial transactions
            </div>

          </div>
        </section>
      </div>
    </main>
  )
}
