"use client"

import { useEffect, useState } from "react"
import {
  getBalance,
  getTransactions,
  type Transaction,
} from "./nolera-state"

export function useNoleraState() {
  const [balance, setBalanceState] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const refresh = () => {
    setBalanceState(getBalance())
    setTransactions(getTransactions())
  }

  useEffect(() => {
    refresh()

    const handleUpdate = () => refresh()

    window.addEventListener("nolera-data-updated", handleUpdate)

    return () => {
      window.removeEventListener("nolera-data-updated", handleUpdate)
    }
  }, [])

  return {
    balance,
    transactions,
    refresh,
  }
}
