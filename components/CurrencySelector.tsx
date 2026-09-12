"use client"

import { useEffect, useState } from "react"
import {
  getNoleraCurrency,
  setNoleraCurrency,
  NOLERA_CURRENCIES,
  type NoleraCurrency,
} from "../lib/nolera-currency"

export default function CurrencySelector() {
  const [currency, setCurrency] =
    useState<NoleraCurrency>("USD")

  useEffect(() => {
    setCurrency(getNoleraCurrency())

    const handleChange = () => {
      setCurrency(getNoleraCurrency())
    }

    window.addEventListener(
      "nolera-currency-change",
      handleChange
    )

    return () =>
      window.removeEventListener(
        "nolera-currency-change",
        handleChange
      )
  }, [])

  function changeCurrency(value: NoleraCurrency) {
    setCurrency(value)
    setNoleraCurrency(value)
  }

  return (
    <select
      value={currency}
      onChange={(event) =>
        changeCurrency(event.target.value as NoleraCurrency)
      }
      className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none"
      aria-label="Currency"
    >
      {NOLERA_CURRENCIES.map((item) => (
        <option
          key={item.code}
          value={item.code}
          className="bg-[#12091d] text-white"
        >
          {item.code} — {item.name}
        </option>
      ))}
    </select>
  )
}
