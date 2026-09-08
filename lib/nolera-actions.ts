"use client"

import {
  addTransaction,
  changeBalance,
  getBalance,
} from "./nolera-state"

export function deposit(amount: number, title = "إيداع") {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("مبلغ الإيداع غير صحيح")
  }

  const balance = changeBalance(amount)

  addTransaction({
    type: "deposit",
    title,
    amount,
    currency: "SDG",
    status: "completed",
  })

  return balance
}

export function withdraw(amount: number, title = "سحب") {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("مبلغ السحب غير صحيح")
  }

  const current = getBalance()

  if (amount > current) {
    throw new Error("الرصيد غير كافٍ")
  }

  const balance = changeBalance(-amount)

  addTransaction({
    type: "withdraw",
    title,
    amount,
    currency: "SDG",
    status: "completed",
  })

  return balance
}

export function transfer(
  amount: number,
  recipient: string,
  title = "تحويل"
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("مبلغ التحويل غير صحيح")
  }

  const current = getBalance()

  if (amount > current) {
    throw new Error("الرصيد غير كافٍ")
  }

  const balance = changeBalance(-amount)

  addTransaction({
    type: "transfer",
    title,
    amount,
    currency: "SDG",
    status: "completed",
    meta: recipient,
  })

  return balance
}

export function purchase(
  amount: number,
  merchant: string,
  title = "شراء"
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("مبلغ الشراء غير صحيح")
  }

  const current = getBalance()

  if (amount > current) {
    throw new Error("الرصيد غير كافٍ")
  }

  const balance = changeBalance(-amount)

  addTransaction({
    type: "purchase",
    title,
    amount,
    currency: "SDG",
    status: "completed",
    meta: merchant,
  })

  return balance
}
