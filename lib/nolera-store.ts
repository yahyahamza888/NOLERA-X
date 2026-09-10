"use client"

import { getSupabaseClient } from "./nolera-auth"

const supabase = getSupabaseClient()

export type StoreProduct = {
  id: string
  owner_id: string
  name: string
  description: string
  price: number
  currency: string
  category: string
  icon: string | null
  status: string
  created_at: string
  updated_at: string
}

export async function getStoreProducts(): Promise<StoreProduct[]> {
  const { data, error } = await supabase.rpc("nolera_get_products")

  if (error) {
    throw new Error(error.message)
  }

  return (data || []) as StoreProduct[]
}

export async function createStoreProduct(input: {
  name: string
  description: string
  price: number
  currency: string
  category: string
  icon: string
}) {
  const { data, error } = await supabase.rpc(
    "nolera_create_product",
    {
      p_name: input.name.trim(),
      p_description: input.description.trim(),
      p_price: input.price,
      p_currency: input.currency.trim().toUpperCase(),
      p_category: input.category.trim(),
      p_icon: input.icon,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function purchaseStoreProduct(
  productId: string,
  quantity = 1
) {
  if (!productId) {
    throw new Error("المنتج غير صحيح.")
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("الكمية غير صحيحة.")
  }

  const { data, error } = await supabase.rpc(
    "nolera_purchase_product",
    {
      p_product_id: productId,
      p_quantity: quantity,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  window.dispatchEvent(new Event("nolera-data-updated"))

  return data
}

export async function getMyOrders() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("يجب تسجيل الدخول.")
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      buyer_id,
      total,
      currency,
      payment_method,
      status,
      reference,
      created_at,
      order_items (
        id,
        product_id,
        product_name,
        quantity,
        unit_price,
        total
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getMyProducts() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("يجب تسجيل الدخول.")
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export async function getStoreProduct(
  productId: string,
): Promise<StoreProduct | null> {
  if (!productId) throw new Error("المنتج غير صحيح.")

  const { data, error } = await supabase.rpc(
    "nolera_get_product",
    { p_product_id: productId },
  )

  if (error) throw new Error(error.message)

  return (data || null) as StoreProduct | null
}
