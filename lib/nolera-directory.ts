import { createSupabaseBrowserClient } from "./supabase-browser"

export type NoleraCompany = {
  id: string
  owner_id: string | null
  name: string
  description: string | null
  category: string
  country: string | null
  city: string | null
  area: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  logo: string | null
  verified: boolean
  status: "pending" | "approved" | "rejected" | "suspended"
  rating: number
  reviews_count: number
  created_at: string
  updated_at: string
}

export async function getCompanies(options?: {
  search?: string
  category?: string
  country?: string
  city?: string
}) {
  const supabase = createSupabaseBrowserClient()

  let query = supabase
    .from("companies")
    .select("*")
    .eq("status", "approved")
    .order("verified", { ascending: false })
    .order("rating", { ascending: false })
    .order("created_at", { ascending: false })

  if (options?.search?.trim()) {
    const value = options.search.trim().replace(/[%_]/g, "")
    query = query.or(
      `name.ilike.%${value}%,description.ilike.%${value}%,category.ilike.%${value}%,city.ilike.%${value}%,country.ilike.%${value}%`
    )
  }

  if (options?.category && options.category !== "all") {
    query = query.eq("category", options.category)
  }

  if (options?.country && options.country !== "all") {
    query = query.eq("country", options.country)
  }

  if (options?.city && options.city !== "all") {
    query = query.eq("city", options.city)
  }

  const { data, error } = await query

  if (error) throw error

  return (data || []) as NoleraCompany[]
}

export async function getCompany(id: string) {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error

  return data as NoleraCompany | null
}

export async function createCompany(input: {
  name: string
  description?: string
  category?: string
  country?: string
  city?: string
  area?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
}) {
  const supabase = createSupabaseBrowserClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("يجب تسجيل الدخول لإضافة شركة")
  }

  const { data, error } = await supabase
    .from("companies")
    .insert({
      ...input,
      owner_id: user.id,
      status: "pending",
      verified: false,
    })
    .select()
    .single()

  if (error) throw error

  return data as NoleraCompany
}

export async function updateCompany(
  id: string,
  input: Partial<Omit<NoleraCompany, "id" | "owner_id" | "created_at" | "updated_at">>
) {
  const supabase = createSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("companies")
    .update(input)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data as NoleraCompany
}
