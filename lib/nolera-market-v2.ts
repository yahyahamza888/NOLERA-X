"use client";

import type { NoleraCurrency } from "./nolera-core-v2";

export type ProductType =
  | "digital"
  | "physical"
  | "service"
  | "subscription";

export interface MarketProduct {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  currency: NoleraCurrency;
  category: string;
  type: ProductType;
  image?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
}

export interface MarketCartItem {
  productId: string;
  quantity: number;
}

const PRODUCTS_KEY = "nolera-market-products";
const CART_KEY = "nolera-market-cart";

export function getMarketProducts(): MarketProduct[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function createMarketProduct(
  product: Omit<MarketProduct, "id" | "createdAt">,
): MarketProduct {
  const products = getMarketProducts();

  const created: MarketProduct = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  products.unshift(created);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

  return created;
}

export function updateMarketProduct(
  id: string,
  updates: Partial<MarketProduct>,
) {
  const products = getMarketProducts().map((product) =>
    product.id === id
      ? { ...product, ...updates }
      : product,
  );

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

  return products.find((product) => product.id === id);
}

export function deleteMarketProduct(id: string) {
  const products = getMarketProducts().filter(
    (product) => product.id !== id,
  );

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getCart(): MarketCartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCart(
  productId: string,
  quantity = 1,
) {
  if (quantity <= 0) throw new Error("Invalid quantity");

  const cart = getCart();
  const existing = cart.find(
    (item) => item.productId === productId,
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  return cart;
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter(
    (item) => item.productId !== productId,
  );

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
