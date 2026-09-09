"use client";

import {
  addBalance,
  subtractBalance,
  createCoreTransaction,
  type NoleraCurrency,
  type NoleraMoney,
} from "./nolera-core-v2";

export interface PaymentLink {
  id: string;
  reference: string;
  amount?: number;
  currency?: NoleraCurrency;
  description?: string;
  createdAt: string;
  status: "active" | "paid" | "cancelled";
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  currency: NoleraCurrency;
  description: string;
  status: "draft" | "pending" | "paid" | "cancelled";
  createdAt: string;
}

const LINKS_KEY = "nolera-pay-links";
const INVOICES_KEY = "nolera-pay-invoices";

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function createPaymentLink(
  amount?: number,
  currency?: NoleraCurrency,
  description?: string,
): PaymentLink {
  const links = load<PaymentLink[]>(LINKS_KEY, []);

  const link: PaymentLink = {
    id: crypto.randomUUID(),
    reference: `PAY-${Date.now().toString(36).toUpperCase()}`,
    amount,
    currency,
    description,
    createdAt: new Date().toISOString(),
    status: "active",
  };

  links.unshift(link);
  save(LINKS_KEY, links);

  return link;
}

export function getPaymentLinks(): PaymentLink[] {
  return load<PaymentLink[]>(LINKS_KEY, []);
}

export function cancelPaymentLink(id: string) {
  const links = getPaymentLinks().map((link) =>
    link.id === id ? { ...link, status: "cancelled" as const } : link,
  );

  save(LINKS_KEY, links);
}

export function createInvoice(
  customer: string,
  amount: number,
  currency: NoleraCurrency,
  description: string,
): Invoice {
  if (amount <= 0) throw new Error("Invalid invoice amount");

  const invoices = load<Invoice[]>(INVOICES_KEY, []);

  const invoice: Invoice = {
    id: crypto.randomUUID(),
    invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
    customer,
    amount,
    currency,
    description,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  invoices.unshift(invoice);
  save(INVOICES_KEY, invoices);

  return invoice;
}

export function getInvoices(): Invoice[] {
  return load<Invoice[]>(INVOICES_KEY, []);
}

export function payMerchant(
  merchant: string,
  amount: number,
  currency: NoleraCurrency,
  description = "NOLERA PAY",
): NoleraMoney {
  if (amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  subtractBalance(currency, amount);

  createCoreTransaction({
    userId: "current-user",
    operation: "payment",
    amount,
    currency,
    status: "completed",
    recipient: merchant,
    description,
  });

  return {
    amount,
    currency,
  };
}
