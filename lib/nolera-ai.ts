"use client";

import type { CoreTransaction } from "./nolera-core-v2";

export interface AIInsight {
  id: string;
  title: string;
  message: string;
  type: "saving" | "spending" | "risk" | "income" | "general";
  createdAt: string;
}

export interface AIAction {
  id: string;
  title: string;
  description: string;
  action: string;
}

export function analyzeTransactions(
  transactions: CoreTransaction[],
): AIInsight[] {
  const insights: AIInsight[] = [];

  const completed = transactions.filter(
    (tx) => tx.status === "completed",
  );

  const payments = completed.filter(
    (tx) => tx.operation === "payment" || tx.operation === "purchase",
  );

  if (payments.length >= 5) {
    insights.push({
      id: crypto.randomUUID(),
      title: "Spending pattern detected",
      message:
        "You have several recent payment transactions. Consider reviewing your spending categories.",
      type: "spending",
      createdAt: new Date().toISOString(),
    });
  }

  const transfers = completed.filter(
    (tx) => tx.operation === "transfer",
  );

  if (transfers.length > 0) {
    insights.push({
      id: crypto.randomUUID(),
      title: "Transfer activity",
      message:
        "Your account has recent transfer activity. Review recipients and transaction references regularly.",
      type: "general",
      createdAt: new Date().toISOString(),
    });
  }

  if (completed.length === 0) {
    insights.push({
      id: crypto.randomUUID(),
      title: "NOLERA AI is ready",
      message:
        "Start using your wallet and NOLERA AI will build financial insights from your activity.",
      type: "general",
      createdAt: new Date().toISOString(),
    });
  }

  return insights;
}

export function generateSmartActions(): AIAction[] {
  return [
    {
      id: "track",
      title: "Track spending",
      description: "Review your recent financial activity.",
      action: "transactions",
    },
    {
      id: "exchange",
      title: "Exchange currency",
      description: "Move funds between supported currencies.",
      action: "exchange",
    },
    {
      id: "pay",
      title: "Make a payment",
      description: "Pay a merchant using NOLERA PAY.",
      action: "pay",
    },
    {
      id: "market",
      title: "Open marketplace",
      description: "Explore products and digital services.",
      action: "market",
    },
  ];
}

export function detectRisk(
  transactions: CoreTransaction[],
): AIInsight[] {
  const failed = transactions.filter(
    (tx) => tx.status === "failed",
  );

  if (failed.length < 3) return [];

  return [
    {
      id: crypto.randomUUID(),
      title: "Security attention",
      message:
        "Multiple failed transactions were detected. Review your account activity and security settings.",
      type: "risk",
      createdAt: new Date().toISOString(),
    },
  ];
}
