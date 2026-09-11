"use client"

import { getCurrentUser, getSupabaseClient } from "./nolera-auth"

export interface NoleraIdentity {
  id: string
  noleraId: string
  name: string
  email?: string
  phone?: string
  verified: boolean
  createdAt: string
}

function buildNoleraId(userId: string) {
  return "NX-" + userId.replace(/-/g, "").slice(0, 12).toUpperCase()
}

export async function getNoleraIdentity(): Promise<NoleraIdentity | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = getSupabaseClient()

  const { data: verification } = await supabase
    .from("verifications")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle()

  return {
    id: user.id,
    noleraId: buildNoleraId(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    verified: verification?.status === "approved" || verification?.status === "verified",
    createdAt: user.createdAt,
  }
}

export async function createNoleraIdentity(
  name: string,
  email?: string,
  phone?: string,
): Promise<NoleraIdentity> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("يجب تسجيل الدخول لإنشاء NOLERA ID.")
  }

  const supabase = getSupabaseClient()

  const updates: Record<string, string> = {
    updated_at: new Date().toISOString(),
  }

  if (name.trim()) updates.name = name.trim()
  if (phone?.trim()) updates.phone = phone.trim()

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("name, phone, created_at")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return {
    id: user.id,
    noleraId: buildNoleraId(user.id),
    name: profile?.name || user.name,
    email: email || user.email,
    phone: profile?.phone || phone || user.phone,
    verified: false,
    createdAt: profile?.created_at || user.createdAt,
  }
}

export async function updateNoleraIdentity(
  updates: Partial<Omit<NoleraIdentity, "id" | "noleraId">>,
): Promise<NoleraIdentity> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("يجب تسجيل الدخول.")
  }

  const supabase = getSupabaseClient()

  const profileUpdate: Record<string, string> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.name !== undefined) profileUpdate.name = updates.name.trim()
  if (updates.phone !== undefined) profileUpdate.phone = updates.phone.trim()

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id)
    .select("name, phone, created_at")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const { data: verification } = await supabase
    .from("verifications")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle()

  return {
    id: user.id,
    noleraId: buildNoleraId(user.id),
    name: profile?.name || user.name,
    email: updates.email || user.email,
    phone: profile?.phone || updates.phone || user.phone,
    verified:
      verification?.status === "approved" ||
      verification?.status === "verified",
    createdAt: profile?.created_at || user.createdAt,
  }
}

export async function verifyNoleraIdentity() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("يجب تسجيل الدخول.")
  }

  const supabase = getSupabaseClient()

  const { data: verification } = await supabase
    .from("verifications")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle()

  if (
    verification?.status !== "approved" &&
    verification?.status !== "verified"
  ) {
    throw new Error("لا يمكن اعتماد NOLERA ID قبل اعتماد التحقق.")
  }

  return getNoleraIdentity()
}

export function clearNoleraIdentity() {
  return
}
