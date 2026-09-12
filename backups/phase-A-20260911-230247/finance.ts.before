export type TransactionType = "deposit" | "withdraw" | "transfer"

export type Transaction = {
  id: string
  type: TransactionType
  amount: number
  currency: string
  description: string
  date: string
  status: "completed" | "pending"
}

export const financeState = {
  balance: 24680.5,
  currency: "USD",
  transactions: [] as Transaction[],
}

export function deposit(amount: number, description = "Deposit") {
  if (amount <= 0) return false

  financeState.balance += amount

  financeState.transactions.unshift({
    id: `DEP-${Date.now()}`,
    type: "deposit",
    amount,
    currency: financeState.currency,
    description,
    date: new Date().toISOString(),
    status: "completed",
  })

  return true
}

export function withdraw(amount: number, description = "Withdrawal") {
  if (amount <= 0 || amount > financeState.balance) return false

  financeState.balance -= amount

  financeState.transactions.unshift({
    id: `WTH-${Date.now()}`,
    type: "withdraw",
    amount,
    currency: financeState.currency,
    description,
    date: new Date().toISOString(),
    status: "completed",
  })

  return true
}

export function transfer(
  amount: number,
  recipient: string,
  description = "Transfer"
) {
  if (amount <= 0 || amount > financeState.balance || !recipient) {
    return false
  }

  financeState.balance -= amount

  financeState.transactions.unshift({
    id: `TRF-${Date.now()}`,
    type: "transfer",
    amount,
    currency: financeState.currency,
    description: `${description} → ${recipient}`,
    date: new Date().toISOString(),
    status: "completed",
  })

  return true
}

export function getTransactions() {
  return financeState.transactions
}
