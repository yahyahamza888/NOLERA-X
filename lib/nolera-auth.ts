"use client"

export type NoleraUser = {
  id: string
  name: string
  email: string
  phone: string
  password: string
  createdAt: string
}

const USERS_KEY = "nolera_x_users"
const SESSION_KEY = "nolera_x_session"

function users(): NoleraUser[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

export function registerUser(
  name: string,
  email: string,
  phone: string,
  password: string
) {
  const list = users()

  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error("أكمل بيانات الحساب.")
  }

  if (password.length < 6) {
    throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل.")
  }

  if (list.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("هذا البريد مستخدم بالفعل.")
  }

  const user: NoleraUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password,
    createdAt: new Date().toLocaleString("ar-SD"),
  }

  localStorage.setItem(USERS_KEY, JSON.stringify([user, ...list]))
  localStorage.setItem(SESSION_KEY, user.id)

  window.dispatchEvent(new Event("nolera-auth-updated"))

  return user
}

export function loginUser(email: string, password: string) {
  const user = users().find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  )

  if (!user) {
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.")
  }

  localStorage.setItem(SESSION_KEY, user.id)
  window.dispatchEvent(new Event("nolera-auth-updated"))

  return user
}

export function logoutUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event("nolera-auth-updated"))
}

export function getCurrentUser(): NoleraUser | null {
  if (typeof window === "undefined") return null

  const id = localStorage.getItem(SESSION_KEY)
  if (!id) return null

  return users().find((u) => u.id === id) || null
}

export function updateCurrentUser(data: {
  name?: string
  phone?: string
}) {
  const current = getCurrentUser()
  if (!current) throw new Error("يجب تسجيل الدخول.")

  const updated = {
    ...current,
    ...data,
    name: data.name?.trim() || current.name,
    phone: data.phone?.trim() || current.phone,
  }

  const list = users().map((u) =>
    u.id === current.id ? updated : u
  )

  localStorage.setItem(USERS_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event("nolera-auth-updated"))

  return updated
}

export function changePassword(oldPassword: string, newPassword: string) {
  const current = getCurrentUser()
  if (!current) throw new Error("يجب تسجيل الدخول.")

  if (current.password !== oldPassword) {
    throw new Error("كلمة المرور الحالية غير صحيحة.")
  }

  if (newPassword.length < 6) {
    throw new Error("كلمة المرور الجديدة قصيرة جدًا.")
  }

  const list = users().map((u) =>
    u.id === current.id
      ? { ...u, password: newPassword }
      : u
  )

  localStorage.setItem(USERS_KEY, JSON.stringify(list))

  return true
}
