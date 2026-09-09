"use client";

export type NoleraCurrency =
  | "SDG"
  | "USD"
  | "EUR"
  | "GBP"
  | "SAR"
  | "AED"
  | "KWD"
  | "EGP"
  | "Pi"
  | "BTC"
  | "ETH"
  | "USDT";

export type CoreOperation =
  | "deposit"
  | "withdraw"
  | "transfer"
  | "payment"
  | "exchange"
  | "purchase"
  | "fee"
  | "refund";

export type CoreTransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export interface NoleraMoney {
  amount: number;
  currency: NoleraCurrency;
}

export interface CoreTransaction {
  id: string;
  reference: string;
  userId: string;
  operation: CoreOperation;
  amount: number;
  currency: NoleraCurrency;
  status: CoreTransactionStatus;
  recipient?: string;
  description?: string;
  fee?: NoleraMoney;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface CoreBalance {
  currency: NoleraCurrency;
  available: number;
  pending: number;
}

export interface CoreState {
  balances: CoreBalance[];
  transactions: CoreTransaction[];
}

const STORAGE_KEY = "nolera-core-v2";

const defaultState: CoreState = {
  balances: [
    { currency: "USD", available: 24680.5, pending: 0 },
    { currency: "SDG", available: 0, pending: 0 },
    { currency: "USDT", available: 1500, pending: 0 },
    { currency: "BTC", available: 0.125, pending: 0 },
    { currency: "ETH", available: 2.4, pending: 0 },
    { currency: "Pi", available: 0, pending: 0 },
  ],
  transactions: [],
};

function loadState(): CoreState {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState;
  } catch {
    return defaultState;
  }
}

function saveState(state: CoreState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function reference(prefix = "NXR") {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${random}`;
}

export function getCoreState(): CoreState {
  return loadState();
}

export function getBalance(currency: NoleraCurrency): CoreBalance {
  const state = loadState();

  return (
    state.balances.find((item) => item.currency === currency) ?? {
      currency,
      available: 0,
      pending: 0,
    }
  );
}

export function setBalance(
  currency: NoleraCurrency,
  amount: number,
): CoreBalance {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Invalid balance");
  }

  const state = loadState();
  const existing = state.balances.find(
    (item) => item.currency === currency,
  );

  if (existing) {
    existing.available = amount;
  } else {
    state.balances.push({
      currency,
      available: amount,
      pending: 0,
    });
  }

  saveState(state);
  return getBalance(currency);
}

export function addBalance(
  currency: NoleraCurrency,
  amount: number,
): CoreBalance {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const current = getBalance(currency);
  return setBalance(currency, current.available + amount);
}

export function subtractBalance(
  currency: NoleraCurrency,
  amount: number,
): CoreBalance {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const current = getBalance(currency);

  if (current.available < amount) {
    throw new Error("Insufficient balance");
  }

  return setBalance(currency, current.available - amount);
}

export function createCoreTransaction(
  input: Omit<CoreTransaction, "id" | "reference" | "createdAt">,
): CoreTransaction {
  const state = loadState();

  const transaction: CoreTransaction = {
    ...input,
    id: crypto.randomUUID(),
    reference: reference(),
    createdAt: new Date().toISOString(),
  };

  state.transactions.unshift(transaction);
  saveState(state);

  return transaction;
}

export function getCoreTransactions(): CoreTransaction[] {
  return loadState().transactions;
}

export function resetCoreDemoState() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  }
}
