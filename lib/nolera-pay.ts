import { getSupabaseClient } from "./nolera-auth";

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type PaymentLink = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description?: string;
  status: PaymentStatus;
  createdAt: string;
  expiresAt?: string;
};

export type Invoice = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description?: string;
  status: PaymentStatus;
  createdAt: string;
  dueAt?: string;
};

function requireUserId(userId?: string) {
  if (userId) return userId;
  throw new Error("Authentication required");
}

export async function createPaymentLink(input: {
  amount: number;
  currency: string;
  description?: string;
  expiresAt?: string;
}) {
  const supabase = getSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = requireUserId(auth.user?.id);

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  // Backend-ready boundary:
  // Payment links must be persisted by the backend/API.
  // No localStorage and no local balance mutation.
  return {
    id: crypto.randomUUID(),
    userId,
    amount: input.amount,
    currency: input.currency,
    description: input.description,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
    backendRequired: true,
  };
}

export async function createInvoice(input: {
  amount: number;
  currency: string;
  description?: string;
  dueAt?: string;
}) {
  const supabase = getSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = requireUserId(auth.user?.id);

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Invalid invoice amount");
  }

  // Backend-ready boundary:
  // Invoice persistence/payment must happen server-side.
  return {
    id: crypto.randomUUID(),
    userId,
    amount: input.amount,
    currency: input.currency,
    description: input.description,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
    dueAt: input.dueAt,
    backendRequired: true,
  };
}

export async function payMerchant(_input: {
  merchantId: string;
  amount: number;
  currency: string;
  description?: string;
}) {
  const supabase = getSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();
  requireUserId(auth.user?.id);

  if (!Number.isFinite(_input.amount) || _input.amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  // IMPORTANT:
  // Never subtract money in the browser.
  // Real merchant payments must call a protected backend/RPC
  // that validates balance, merchant, currency and authorization
  // atomically on the server.
  throw new Error(
    "Merchant payment backend is not connected yet. No local balance was changed."
  );
}

export async function getPaymentLink(_id: string) {
  // Backend/API lookup boundary.
  // Deliberately does not read localStorage.
  return null;
}

export async function getInvoice(_id: string) {
  // Backend/API lookup boundary.
  // Deliberately does not read localStorage.
  return null;
}

export async function cancelPayment(_id: string) {
  // Cancellation must be performed by the backend/API.
  return {
    success: false,
    backendRequired: true,
  };
}
