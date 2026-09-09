"use client"

import { createSupabaseBrowserClient } from "./supabase-browser"

export type NoleraUser = {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

const supabase = createSupabaseBrowserClient()

function mapUser(user: any, profile?: any): NoleraUser | null {
  if (!user) return null

  return {
    id: user.id,
    name:
      profile?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "مستخدم NOLERA X",
    email: user.email || "",
    phone: profile?.phone || user.user_metadata?.phone || "",
    createdAt: profile?.created_at || user.created_at || new Date().toISOString(),
  }
}

export async function registerUser(
  name: string,
  email: string,
  phone: string,
  password: string
) {
  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error("أكمل بيانات الحساب.")
  }

  if (password.length < 6) {
    throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل.")
  }

  const cleanEmail = email.trim().toLowerCase()
  const cleanName = name.trim()
  const cleanPhone = phone.trim()

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        full_name: cleanName,
        phone: cleanPhone,
      },
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      throw new Error("هذا البريد مستخدم بالفعل.")
    }
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error("تعذر إنشاء الحساب.")
  }

  window.dispatchEvent(new Event("nolera-auth-updated"))

  return mapUser(data.user)
}

export async function loginUser(email: string, password: string) {
  if (!email.trim() || !password) {
    throw new Error("أدخل البريد الإلكتروني وكلمة المرور.")
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error || !data.user) {
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.")
  }

  window.dispatchEvent(new Event("nolera-auth-updated"))

  return await getCurrentUser()
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  window.dispatchEvent(new Event("nolera-auth-updated"))
}

export async function getCurrentUser(): Promise<NoleraUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone, created_at")
    .eq("id", user.id)
    .maybeSingle()

  return mapUser(user, profile)
}

export async function updateCurrentUser(data: {
  name?: string
  phone?: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("يجب تسجيل الدخول.")
  }

  const name = data.name?.trim()
  const phone = data.phone?.trim()

  if (name !== undefined && !name) {
    throw new Error("الاسم لا يمكن أن يكون فارغًا.")
  }

  const profileUpdate: Record<string, string> = {
    updated_at: new Date().toISOString(),
  }

  if (name !== undefined) profileUpdate.name = name
  if (phone !== undefined) profileUpdate.phone = phone

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id)
    .select("name, phone, created_at")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (name !== undefined || phone !== undefined) {
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        ...(name !== undefined ? { full_name: name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      },
    })

    if (authError) {
      throw new Error(authError.message)
    }
  }

  window.dispatchEvent(new Event("nolera-auth-updated"))

  return mapUser(user, profile)
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
) {
  if (!oldPassword || !newPassword) {
    throw new Error("أدخل كلمة المرور الحالية والجديدة.")
  }

  if (newPassword.length < 6) {
    throw new Error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    throw new Error("يجب تسجيل الدخول.")
  }

  const { error: verifyError } =
    await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })

  if (verifyError) {
    throw new Error("كلمة المرور الحالية غير صحيحة.")
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export function getSupabaseClient() {
  return supabase
}
