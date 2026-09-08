"use client"

export type NoleraNotification = {
  id: string
  title: string
  message: string
  type: "success" | "info" | "warning"
  read: boolean
  date: string
}

const KEY = "nolera_x_notifications"

export function getNotifications(): NoleraNotification[] {
  if (typeof window === "undefined") return []

  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "[]")
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function addNotification(
  title: string,
  message: string,
  type: NoleraNotification["type"] = "info"
) {
  if (typeof window === "undefined") return

  const item: NoleraNotification = {
    id: crypto.randomUUID(),
    title,
    message,
    type,
    read: false,
    date: new Date().toLocaleString("ar-SD"),
  }

  localStorage.setItem(KEY, JSON.stringify([item, ...getNotifications()]))
  window.dispatchEvent(new Event("nolera-notifications-updated"))
}

export function markNotificationRead(id: string) {
  if (typeof window === "undefined") return

  const data = getNotifications().map((item) =>
    item.id === id ? { ...item, read: true } : item
  )

  localStorage.setItem(KEY, JSON.stringify(data))
  window.dispatchEvent(new Event("nolera-notifications-updated"))
}

export function markAllNotificationsRead() {
  if (typeof window === "undefined") return

  const data = getNotifications().map((item) => ({
    ...item,
    read: true,
  }))

  localStorage.setItem(KEY, JSON.stringify(data))
  window.dispatchEvent(new Event("nolera-notifications-updated"))
}
