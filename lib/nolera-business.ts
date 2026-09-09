"use client";

export interface FeeRule {
  id: string;
  operation:
    | "transfer"
    | "payment"
    | "exchange"
    | "market";
  percentage: number;
  fixedAmount: number;
  currency: string;
  active: boolean;
}

export interface BusinessPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  currency: string;
  features: string[];
  active: boolean;
}

export interface BusinessRevenue {
  transactionFees: number;
  marketplaceFees: number;
  subscriptionRevenue: number;
  apiRevenue: number;
  aiRevenue: number;
  totalRevenue: number;
}

const FEE_KEY = "nolera-fee-rules";
const PLAN_KEY = "nolera-business-plans";

const defaultFees: FeeRule[] = [
  {
    id: "transfer",
    operation: "transfer",
    percentage: 0.5,
    fixedAmount: 0,
    currency: "USD",
    active: true,
  },
  {
    id: "payment",
    operation: "payment",
    percentage: 1,
    fixedAmount: 0,
    currency: "USD",
    active: true,
  },
  {
    id: "exchange",
    operation: "exchange",
    percentage: 0.25,
    fixedAmount: 0,
    currency: "USD",
    active: true,
  },
  {
    id: "market",
    operation: "market",
    percentage: 5,
    fixedAmount: 0,
    currency: "USD",
    active: true,
  },
];

const defaultPlans: BusinessPlan[] = [
  {
    id: "free",
    name: "NOLERA Free",
    monthlyPrice: 0,
    currency: "USD",
    features: [
      "Wallet",
      "Transfers",
      "Marketplace",
    ],
    active: true,
  },
  {
    id: "pro",
    name: "NOLERA Pro",
    monthlyPrice: 19,
    currency: "USD",
    features: [
      "Advanced analytics",
      "AI financial assistant",
      "Merchant tools",
      "Payment links",
    ],
    active: true,
  },
  {
    id: "business",
    name: "NOLERA Business",
    monthlyPrice: 49,
    currency: "USD",
    features: [
      "Business dashboard",
      "API access",
      "Webhooks",
      "Advanced risk tools",
    ],
    active: true,
  },
];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFeeRules(): FeeRule[] {
  return load(FEE_KEY, defaultFees);
}

export function calculateFee(
  operation: FeeRule["operation"],
  amount: number,
): number {
  const rule = getFeeRules().find(
    (item) =>
      item.operation === operation &&
      item.active,
  );

  if (!rule || amount <= 0) return 0;

  return (
    amount * (rule.percentage / 100) +
    rule.fixedAmount
  );
}

export function getBusinessPlans(): BusinessPlan[] {
  return load(PLAN_KEY, defaultPlans);
}

export function calculateRevenue(
  transactionFees = 0,
  marketplaceFees = 0,
  subscriptionRevenue = 0,
  apiRevenue = 0,
  aiRevenue = 0,
): BusinessRevenue {
  return {
    transactionFees,
    marketplaceFees,
    subscriptionRevenue,
    apiRevenue,
    aiRevenue,
    totalRevenue:
      transactionFees +
      marketplaceFees +
      subscriptionRevenue +
      apiRevenue +
      aiRevenue,
  };
}

export function getBusinessModel() {
  return {
    revenueStreams: [
      "Transaction fees",
      "Marketplace commission",
      "Merchant subscriptions",
      "AI premium",
      "API usage",
      "Business services",
    ],
    target: "Global financial infrastructure",
  };
}
