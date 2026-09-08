"use client"

import { getSupabaseClient } from "./nolera-auth"

export const supabase = getSupabaseClient()

export async function currentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("يجب تسجيل الدخول أولا.")
  }

  return user
}

export async function getWallets() {
  const user = await currentUser()

  const { data, error } = await supabase
    .from("wallets")
    .select("id,currency,balance")
    .eq("user_id", user.id)
    .order("currency")

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getTransactions(limit = 50) {
  const user = await currentUser()

  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id,type,status,recipient,reference,metadata,currency,created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function changeWallet(
  currency: string,
  amount: number,
  type: "deposit" | "withdraw"
) {
  await currentUser()

  const cleanCurrency = currency.trim().toUpperCase()

  if (!cleanCurrency) {
    throw new Error("العملة غير صحيحة.")
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("المبلغ غير صحيح.")
  }

  const functionName =
    type === "deposit" ? "nolera_deposit" : "nolera_withdraw"

  const { data, error } = await supabase.rpc(functionName, {
    p_currency: cleanCurrency,
    p_amount: amount,
  })

  if (error) {
    throw new Error(error.message)
  }

  window.dispatchEvent(new Event("nolera-data-updated"))

  return data
}

export async function transferMoney(
  currency: string,
  recipient: string,
  amount: number
) {
  const user = await currentUser()

  const cleanCurrency = currency.trim().toUpperCase()
  const cleanRecipient = recipient.trim()

  if (!cleanCurrency) {
    throw new Error("العملة غير صحيحة.")
  }

  if (!cleanRecipient) {
    throw new Error("أدخل معرف المستلم.")
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("المبلغ غير صحيح.")
  }

  if (cleanRecipient === user.id) {
    throw new Error("لا يمكنك التحويل لنفس الحساب.")
  }

  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuid.test(cleanRecipient)) {
    throw new Error(
      "معرف المستلم غير صحيح. استخدم معرف حساب NOLERA X."
    )
  }

  const { data, error } = await supabase.rpc("nolera_transfer", {
    p_currency: cleanCurrency,
    p_recipient_id: cleanRecipient,
    p_amount: amount,
  })

  if (error) {
    throw new Error(error.message)
  }

  window.dispatchEvent(new Event("nolera-data-updated"))

  return data
}

export async function getExchangeRates() {
  await currentUser()

  const { data, error } = await supabase.rpc(
    "nolera_get_exchange_rates"
  )

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function exchangeMoney(
  fromCurrency: string,
  toCurrency: string,
  amount: number
) {
  await currentUser()

  const from = fromCurrency.trim().toUpperCase()
  const to = toCurrency.trim().toUpperCase()

  if (!from || !to || from === to) {
    throw new Error("اختر عملتين مختلفتين.")
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("المبلغ غير صحيح.")
  }

  const { data, error } = await supabase.rpc(
    "nolera_exchange",
    {
      p_from_currency: from,
      p_to_currency: to,
      p_from_amount: amount,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  window.dispatchEvent(new Event("nolera-data-updated"))

  return data
}
