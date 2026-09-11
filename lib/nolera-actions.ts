"use client";

import { getSupabaseClient } from "./nolera-auth";

type RpcResult = {
  success?: boolean;
  type?: string;
  currency?: string;
  amount?: number;
  balance?: number;
  sender_balance?: number;
  receiver_balance?: number;
  fee?: number;
  reference?: string;
  operation_id?: string;
};

async function callRpc(
  functionName: string,
  args: Record<string, unknown>
): Promise<RpcResult> {
  const supabase = getSupabaseClient();

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("يجب تسجيل الدخول أولاً.");
  }

  const { data, error } = await supabase.rpc(functionName, args);

  if (error) {
    throw new Error(error.message || "فشلت العملية المالية.");
  }

  return (data || {}) as RpcResult;
}

function validateAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("المبلغ غير صحيح.");
  }
}

export async function deposit(
  amount: number,
  currency = "SDG"
) {
  validateAmount(amount);

  return callRpc("nolera_deposit", {
    p_currency: currency,
    p_amount: amount,
  });
}

export async function withdraw(
  amount: number,
  currency = "SDG"
) {
  validateAmount(amount);

  return callRpc("nolera_withdraw", {
    p_currency: currency,
    p_amount: amount,
  });
}

export async function transfer(
  amount: number,
  recipientId: string,
  currency = "SDG"
) {
  validateAmount(amount);

  if (!recipientId?.trim()) {
    throw new Error("معرّف المستلم غير صحيح.");
  }

  return callRpc("nolera_transfer", {
    p_currency: currency,
    p_recipient_id: recipientId,
    p_amount: amount,
  });
}

/*
 * لا يوجد حالياً nolera_purchase في Supabase.
 * لذلك لا يتم خصم أي رصيد من المتصفح.
 */
export async function purchase(
  _amount: number,
  _merchant?: string,
  _title = "شراء"
) {
  throw new Error(
    "الدفع لهذا النوع من المشتريات يحتاج إلى Purchase RPC آمن في Backend. لم يتم خصم أي رصيد."
  );
}
