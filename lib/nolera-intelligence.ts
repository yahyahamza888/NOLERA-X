"use client";

import type { CoreTransaction } from "./nolera-core-v2";

export interface FinancialAnalytics {
  totalTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  totalPayments: number;
  totalTransfers: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

export interface RiskScore {
  score: number;
  level: "low" | "medium" | "high";
  reasons: string[];
}

export function calculateAnalytics(
  transactions: CoreTransaction[],
): FinancialAnalytics {
  const completed = transactions.filter(
    (tx) => tx.status === "completed",
  );

  const sumOperation = (operation: string) =>
    completed
      .filter((tx) => tx.operation === operation)
      .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    totalTransactions: transactions.length,
    completedTransactions: completed.length,
    failedTransactions: transactions.filter(
      (tx) => tx.status === "failed",
    ).length,
    totalPayments: sumOperation("payment"),
    totalTransfers: sumOperation("transfer"),
    totalDeposits: sumOperation("deposit"),
    totalWithdrawals: sumOperation("withdraw"),
  };
}

export function calculateRiskScore(
  transactions: CoreTransaction[],
): RiskScore {
  let score = 0;
  const reasons: string[] = [];

  const failed = transactions.filter(
    (tx) => tx.status === "failed",
  ).length;

  if (failed >= 3) {
    score += 30;
    reasons.push("Multiple failed transactions");
  }

  const largeTransactions = transactions.filter(
    (tx) => tx.amount >= 10000,
  ).length;

  if (largeTransactions >= 3) {
    score += 25;
    reasons.push("Several high-value transactions");
  }

  const riskScore = Math.min(score, 100);

  return {
    score: riskScore,
    level:
      riskScore >= 70
        ? "high"
        : riskScore >= 35
          ? "medium"
          : "low",
    reasons,
  };
}

export function getBusinessMetrics(
  transactions: CoreTransaction[],
) {
  const analytics = calculateAnalytics(transactions);

  return {
    ...analytics,
    activityRate:
      analytics.totalTransactions === 0
        ? 0
        : Math.round(
            (analytics.completedTransactions /
              analytics.totalTransactions) *
              100,
          ),
  };
}
