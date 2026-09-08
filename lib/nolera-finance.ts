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

/*
 * =========================================================
 * ADD MONEY / DEPOSIT
 * التنفيذ يتم بالكامل داخل Supabase RPC
 * =========================================================
 */
export async function changeWallet(
  currency: string,
  amount: number,
  type: "deposit" | "withdraw"
) {
  await currentUser()

  if (!currency.trim()) {
    throw new Error("العملة غير صحيحة.")
  }

  if (!amount || amount <= 0) {
    throw new Error("المبلغ غير صحيح.")
  }

  const functionName =
    type === "deposit"
      ? "nolera_deposit"
      : "nolera_withdraw"

  const { data, error } = await supabase.rpc(functionName, {
    p_currency: currency.trim(),
    p_amount: amount,
  })

  if (error) {
    throw new Error(error.message)
  }

  window.dispatchEvent(new Event("nolera-data-updated"))

  return data
}

/*
 * =========================================================
 * TRANSFER
 * التنفيذ بالكامل داخل Supabase RPC
 * =========================================================
 */
export async function transferMoney(
  currency: string,
  recipient: string,
  amount: number
) {
  const user = await currentUser()

  if (!currency.trim()) {
    throw new Error("العملة غير صحيحة.")
  }

  if (!recipient.trim()) {
    throw new Error("أدخل معرف المستلم.")
  }

  if (!amount || amount <= 0) {
    throw new Error("المبلغ غير صحيح.")
  }

  if (recipient.trim() === user.id) {
    throw new Error("لا يمكنك التحويل لنفس الحساب.")
  }

  /*
   * نتحقق من أن النص المرسل هو UUID صالح
   * حتى لا يصل طلب غير صحيح إلى RPC.
   */
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuid.test(recipient.trim())) {
    throw new Error(
      "معرف المستلم غير صحيح. استخدم معرف حساب NOLERA X."
    )
  }

  const { data, error } = await supabase.rpc(
    "nolera_transfer",
    {
      p_currency: currency.trim(),
      p_recipient_id: recipient.trim(),
      p_amount: amount,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  window.dispatchEvent(new Event("nolera-data-updated"))

  return data
}
