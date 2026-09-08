
"use client"

export type Transaction = {
  id: string
  type: "deposit" | "withdraw" | "transfer" | "purchase"
  title: string
  amount: number
  currency: string
  status: "completed" | "pending"
  date: string
  meta?: string
}

const KEY = "nolera_x_transactions"
const BALANCE_KEY = "nolera_x_balance"

export function getBalance() {
  if (typeof window === "undefined") return 0
  return Number(localStorage.getItem(BALANCE_KEY) || "0")
}

export function setBalance(value: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem(BALANCE_KEY, String(Math.max(0, value)))
  }
}

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]")
  } catch {
    return []
  }
}

export function addTransaction(tx: Omit<Transaction, "id" | "date">) {
  if (typeof window === "undefined") return

  const transaction: Transaction = {
    ...tx,
    id: crypto.randomUUID(),
    date: new Date().toLocaleString("ar-SD"),
  }

  localStorage.setItem(
    KEY,
    JSON.stringify([transaction, ...getTransactions()])
  )

  window.dispatchEvent(new Event("nolera-data-updated"))
}

export function changeBalance(amount: number) {
  const next = getBalance() + amount
  setBalance(next)
  window.dispatchEvent(new Event("nolera-data-updated"))
  return next
}
