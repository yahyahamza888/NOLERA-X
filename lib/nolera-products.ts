"use client"

export type DigitalProduct = {
  id: string
  name: string
  description: string
  price: number
  category: string
  icon: string
  createdAt: string
  owner: string
}

const KEY = "nolera_x_digital_products"

export function getDigitalProducts(): DigitalProduct[] {
  if (typeof window === "undefined") return []

  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "[]")
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function saveDigitalProduct(
  product: Omit<DigitalProduct, "id" | "createdAt">
) {
  if (typeof window === "undefined") return

  const newProduct: DigitalProduct = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: new Date().toLocaleString("ar-SD"),
  }

  const products = getDigitalProducts()
  localStorage.setItem(KEY, JSON.stringify([newProduct, ...products]))

  window.dispatchEvent(new Event("nolera-products-updated"))

  return newProduct
}
