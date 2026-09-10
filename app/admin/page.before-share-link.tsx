"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getSupabaseClient } from "../../lib/nolera-auth"
import { useMemo } from "react"
import { activateAd, deleteAd, getAds, pauseAd, type NoleraAd } from "../../lib/nolera-ads"

const supabase = getSupabaseClient()
const ADS_ADVERTISER = "NXR-DEMO-ADVERTISER"

type Command = {
  id: string
  command: string
  category: string
  status: string
  requires_approval: boolean
  created_at: string
}

const quickCommands = [
  {
    label: "صناعة منتج رقمي",
    command: "أنشئ منتجًا رقميًا جديدًا واقترح الاسم والوصف والسعر والفئة.",
    category: "digital_product",
    approval: false,
  },
  {
    label: "تحليل المتجر",
    command: "حلل NOLERA STORE وأعطني تقريرًا عن المنتجات والمبيعات والفرص.",
    category: "store",
    approval: false,
  },
  {
    label: "إنشاء حملة إعلانية",
    command: "أنشئ تصورًا لحملة إعلانية جديدة في NOLERA ADS.",
    category: "ads",
    approval: true,
  },
  {
    label: "تقرير الإدارة",
    command: "أنشئ تقريرًا إداريًا عن حالة NOLERA X والأنشطة المهمة.",
    category: "analytics",
    approval: false,
  },
]

function categoryName(category: string) {
  const names: Record<string, string> = {
    digital_product: "منتجات رقمية",
    store: "المتجر",
    ads: "الإعلانات",
    analytics: "تحليلات",
    moderation: "إشراف",
    general: "عام",
  }

  return names[category] || "عام"
}

function statusName(status: string) {
  const names: Record<string, string> = {
    pending: "بانتظار الموافقة",
    approved: "تمت الموافقة",
    running: "قيد التنفيذ",
    completed: "مكتمل",
    rejected: "مرفوض",
    failed: "فشل",
  }

  return names[status] || status
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState("user")
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("SDG")
  const [rate, setRate] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  const [command, setCommand] = useState("")
  const [commandLoading, setCommandLoading] = useState(false)
  const [commands, setCommands] = useState<Command[]>([])
  const [ads, setAds] = useState<NoleraAd[]>([])

  const isSuperAdmin = role === "super_admin"
  const isAdmin = role === "admin" || isSuperAdmin

  async function loadCommands() {
    const { data, error } = await supabase
      .from("ai_agent_commands")
      .select(
        "id, command, category, status, requires_approval, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(20)

    if (!error) {
      setCommands((data || []) as Command[])
    }
  }

  function loadAds() {
    setAds(getAds(ADS_ADVERTISER))
  }

  function approveAd(id: string) {
    const ad = ads.find((item) => item.id === id)
    if (!ad) return
    if (ad.status === "pending" || ad.status === "draft") {
      const updated = { ...ad, status: "active" as const, updatedAt: new Date().toISOString() }
      localStorage.setItem(
        "nolera-ads-v1",
        JSON.stringify(getAds().map((item) => item.id === id ? updated : item))
      )
      setMessage("تمت الموافقة على الحملة وتفعيلها.")
      loadAds()
    }
  }

  function rejectAd(id: string) {
    const ad = ads.find((item) => item.id === id)
    if (!ad) return
    const updated = { ...ad, status: "rejected" as const, updatedAt: new Date().toISOString() }
    localStorage.setItem(
      "nolera-ads-v1",
      JSON.stringify(getAds().map((item) => item.id === id ? updated : item))
    )
    setMessage("تم رفض الحملة.")
    loadAds()
  }

  function toggleAdminAd(ad: NoleraAd) {
    if (ad.status === "active") pauseAd(ad.id)
    else if (ad.status === "paused") activateAd(ad.id)
    loadAds()
  }

  function removeAdminAd(id: string) {
    deleteAd(id)
    setMessage("تم حذف الحملة.")
    loadAds()
  }

  useEffect(() => {
    loadAds()
    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUser(user)

        if (!user) return

        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle()

        if (error) throw error

        setRole(data?.role || "user")

        if (data?.role === "admin" || data?.role === "super_admin") {
          await loadCommands()
        }
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "تعذر تحميل لوحة الإدارة.",
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function classifyCommand(text: string) {
    const value = text.toLowerCase()

    if (
      value.includes("منتج") ||
      value.includes("منتجات") ||
      value.includes("رقمي")
    ) {
      return "digital_product"
    }

    if (
      value.includes("متجر") ||
      value.includes("store") ||
      value.includes("مبيعات")
    ) {
      return "store"
    }

    if (
      value.includes("إعلان") ||
      value.includes("اعلان") ||
      value.includes("ads") ||
      value.includes("حملة")
    ) {
      return "ads"
    }

    if (
      value.includes("تقرير") ||
      value.includes("تحليل") ||
      value.includes("analytics")
    ) {
      return "analytics"
    }

    if (
      value.includes("حذف") ||
      value.includes("إيقاف") ||
      value.includes("ايقاف") ||
      value.includes("رصيد") ||
      value.includes("تحويل") ||
      value.includes("مال")
    ) {
      return "moderation"
    }

    return "general"
  }

  function requiresApproval(text: string, category: string) {
    const value = text.toLowerCase()

    if (
      category === "ads" ||
      category === "moderation"
    ) {
      return true
    }

    return (
      value.includes("احذف") ||
      value.includes("حذف") ||
      value.includes("إيقاف") ||
      value.includes("ايقاف") ||
      value.includes("تحويل أموال") ||
      value.includes("رصيد")
    )
  }

  async function sendCommand() {
    const text = command.trim()

    if (!text) {
      setMessage("اكتب أمرًا للوكيل أولاً.")
      return
    }

    if (!isAdmin) {
      setMessage("ليس لديك صلاحية استخدام وكيل الإدارة.")
      return
    }

    setCommandLoading(true)
    setMessage("جاري إرسال الأمر إلى NOLERA AI Agent...")

    try {
      const category = classifyCommand(text)
      const approval = requiresApproval(text, category)

      const { data, error } = await supabase.rpc(
        "nolera_create_ai_command",
        {
          p_command: text,
          p_category: category,
          p_requires_approval: approval,
        },
      )

      if (error) throw error

      setCommand("")

      const status =
        data?.status === "pending"
          ? "تم إرسال الأمر، وهو بانتظار موافقة Super Admin."
          : "تم تسجيل الأمر بنجاح وهو جاهز لطبقة التنفيذ."

      setMessage(status)

      await loadCommands()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر إرسال الأمر.",
      )
    } finally {
      setCommandLoading(false)
    }
  }

  async function approveCommand(id: string) {
    try {
      const { error } = await supabase.rpc(
        "nolera_approve_ai_command",
        {
          p_command_id: id,
        },
      )

      if (error) throw error

      setMessage("تمت الموافقة على الأمر.")
      await loadCommands()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر الموافقة على الأمر.",
      )
    }
  }

  async function rejectCommand(id: string) {
    try {
      const { error } = await supabase.rpc(
        "nolera_reject_ai_command",
        {
          p_command_id: id,
        },
      )

      if (error) throw error

      setMessage("تم رفض الأمر.")
      await loadCommands()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر رفض الأمر.",
      )
    }
  }

  async function saveRate() {
    const value = Number(rate)

    if (!value || value <= 0) {
      setMessage("أدخل سعرًا صحيحًا.")
      return
    }

    try {
      const { error } = await supabase.rpc(
        "nolera_set_exchange_rate",
        {
          p_from_currency: from,
          p_to_currency: to,
          p_rate: value,
        },
      )

      if (error) throw error

      setMessage(`تم حفظ سعر ${from} → ${to} بنجاح.`)
      setRate("")
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "تعذر حفظ السعر.",
      )
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        جاري التحميل...
      </main>
    )
  }

  if (!user) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-slate-950 p-8 text-white"
      >
        <div className="mx-auto max-w-lg rounded-3xl bg-white/10 p-8 text-center">
          <h1 className="text-2xl font-black">
            يجب تسجيل الدخول
          </h1>

          <Link
            href="/login"
            className="mt-5 inline-block rounded-2xl bg-white px-6 py-3 font-black text-slate-950"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-slate-950 p-8 text-white"
      >
        <div className="mx-auto max-w-lg rounded-3xl bg-white/10 p-8 text-center">
          <div className="text-5xl">🛡️</div>

          <h1 className="mt-4 text-2xl font-black">
            لا توجد صلاحية
          </h1>

          <p className="mt-3 text-white/60">
            هذه الصفحة مخصصة لإدارة NOLERA X.
          </p>

          <Link
            href="/account"
            className="mt-5 inline-block rounded-2xl bg-white px-6 py-3 font-black text-slate-950"
          >
            العودة للحساب
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#35154d] via-[#512d68] to-[#e86f32] p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-white/60">
                NOLERA X CONTROL CENTER
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Super Admin 🛡️
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/75">
                مركز التحكم الذكي لإدارة NOLERA X والوكيل الذكي
                والمنتجات والمتجر والإعلانات والتحليلات.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs text-white/50">
                الصلاحية الحالية
              </p>

              <p className="mt-1 font-black">
                {isSuperAdmin ? "SUPER ADMIN" : "ADMIN"}
              </p>
            </div>
          </div>
        </header>

        {/* AI AGENT */}
        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-purple-600">
                NOLERA AI
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                AI Agent Command Center 🤖
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                اكتب أمرًا إداريًا، وسيتم تصنيفه وحفظه في النظام
                مع تطبيق طبقة الصلاحيات والموافقة.
              </p>
            </div>

            <div className="hidden rounded-2xl bg-purple-50 px-4 py-3 text-xs font-bold text-purple-700 sm:block">
              Secure Agent
            </div>
          </div>

          <div className="mt-5">
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="مثال: أنشئ منتجًا رقميًا عن التسويق بالذكاء الاصطناعي بسعر 9.99 دولار..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />

            <button
              onClick={sendCommand}
              disabled={commandLoading}
              className="mt-3 w-full rounded-2xl bg-gradient-to-r from-[#512d68] to-[#e86f32] py-4 font-black text-white shadow-lg disabled:opacity-50"
            >
              {commandLoading
                ? "جاري الإرسال..."
                : "إرسال الأمر إلى NOLERA AI Agent →"}
            </button>
          </div>

          {/* QUICK COMMANDS */}
          <div className="mt-5">
            <p className="mb-3 text-sm font-black text-slate-700">
              أوامر سريعة
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickCommands.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setCommand(item.command)}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-sm"
                >
                  <p className="font-black text-slate-900">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.approval
                      ? "يتطلب موافقة"
                      : "جاهز للمعالجة"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            🔐 العمليات الحساسة لا تُنفذ تلقائيًا؛ يتم وضعها
            في حالة <b>Pending</b> وتحتاج موافقة Super Admin.
          </div>
        </section>

        {/* COMMAND HISTORY */}
        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-purple-600">
                COMMAND LOG
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                أوامر الوكيل الأخيرة
              </h2>
            </div>

            <button
              onClick={loadCommands}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
            >
              تحديث
            </button>
          </div>

          {commands.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
              لا توجد أوامر حتى الآن.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {commands.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-bold leading-7 text-slate-900">
                        {item.command}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-purple-100 px-3 py-1 font-bold text-purple-700">
                          {categoryName(item.category)}
                        </span>

                        <span className="rounded-full bg-slate-200 px-3 py-1 font-bold text-slate-700">
                          {statusName(item.status)}
                        </span>

                        {item.requires_approval && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-700">
                            يحتاج موافقة
                          </span>
                        )}
                      </div>
                    </div>

                    {isSuperAdmin &&
                      item.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveCommand(item.id)}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                          >
                            موافقة
                          </button>

                          <button
                            onClick={() => rejectCommand(item.id)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white"
                          >
                            رفض
                          </button>
                        </div>
                      )}
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleString("ar")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NOLERA ADS MANAGEMENT */}
        <section className="mt-5 rounded-[30px] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-purple-600">NOLERA ADS</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">
                إدارة الحملات الإعلانية 📣
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                مراجعة الحملات والموافقة عليها أو رفضها وإدارة حالتها.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center">
                <p className="text-xs text-amber-600">قيد المراجعة</p>
                <p className="text-xl font-black text-amber-700">
                  {ads.filter((ad) => ad.status === "pending").length}
                </p>
              </div>

              <div className="rounded-2xl bg-purple-50 px-4 py-3 text-center">
                <p className="text-xs text-purple-600">كل الحملات</p>
                <p className="text-xl font-black text-purple-700">{ads.length}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={loadAds}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
            >
              تحديث الحملات
            </button>
          </div>

          {ads.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
              لا توجد حملات إعلانية حالياً.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black">{ad.title}</h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
                          {ad.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {ad.description}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {ad.country || "Global"} · {ad.language || "ar"} · ${ad.budget}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {ad.status === "pending" && (
                        <>
                          <button
                            onClick={() => approveAd(ad.id)}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white"
                          >
                            ✓ موافقة
                          </button>

                          <button
                            onClick={() => rejectAd(ad.id)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white"
                          >
                            ✕ رفض
                          </button>
                        </>
                      )}

                      {(ad.status === "active" || ad.status === "paused") && (
                        <button
                          onClick={() => toggleAdminAd(ad)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white"
                        >
                          {ad.status === "active" ? "إيقاف" : "تشغيل"}
                        </button>
                      )}

                      <button
                        onClick={() => removeAdminAd(ad.id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-xs font-black text-red-600"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CAPABILITIES */}
        <section className="mt-5">
          <h2 className="mb-3 text-xl font-black text-slate-900">
            قدرات NOLERA AI Agent
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/create-product"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <div className="text-3xl">✨</div>
              <h3 className="mt-3 font-black">صناعة المنتجات الرقمية</h3>
              <p className="mt-2 text-sm text-slate-500">
                إنشاء أفكار ومنتجات رقمية جديدة.
              </p>
            </Link>

            <Link
              href="/store"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <div className="text-3xl">🛍️</div>
              <h3 className="mt-3 font-black">NOLERA STORE</h3>
              <p className="mt-2 text-sm text-slate-500">
                إدارة المنتجات والمبيعات.
              </p>
            </Link>

            <Link
              href="/ads"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <div className="text-3xl">📣</div>
              <h3 className="mt-3 font-black">NOLERA ADS</h3>
              <p className="mt-2 text-sm text-slate-500">
                الحملات والإعلانات.
              </p>
            </Link>

            <Link
              href="/paradise"
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <div className="text-3xl">🌴</div>
              <h3 className="mt-3 font-black">NOLERA PARADISE</h3>
              <p className="mt-2 text-sm text-slate-500">
                المجتمع والمحتوى والمنتجات.
              </p>
            </Link>
          </div>
        </section>

        {/* EXCHANGE */}
        <section className="mt-5 rounded-[28px] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            أسعار Exchange 💱
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            السعر يحفظ في قاعدة البيانات ويستخدمه نظام Exchange.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-2xl bg-slate-100 p-4"
            >
              {["SDG", "USD", "Pi", "BTC", "ETH", "USDT"].map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>

            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-2xl bg-slate-100 p-4"
            >
              {["SDG", "USD", "Pi", "BTC", "ETH", "USDT"].map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>

            <input
              type="number"
              min="0"
              step="any"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="السعر"
              className="rounded-2xl bg-slate-100 p-4"
            />
          </div>

          <button
            onClick={saveRate}
            className="mt-4 w-full rounded-2xl bg-slate-950 py-4 font-black text-white"
          >
            حفظ سعر الصرف
          </button>
        </section>

        {/* ADMIN LINKS */}
        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/store"
            className="rounded-3xl bg-white p-6 font-black shadow-sm"
          >
            🛍️ المتجر
          </Link>

          <Link
            href="/orders"
            className="rounded-3xl bg-white p-6 font-black shadow-sm"
          >
            📦 الطلبات
          </Link>

          <Link
            href="/notifications"
            className="rounded-3xl bg-white p-6 font-black shadow-sm"
          >
            🔔 الإشعارات
          </Link>

          <Link
            href="/verification"
            className="rounded-3xl bg-white p-6 font-black shadow-sm"
          >
            🪪 التحقق
          </Link>
        </section>

        {message && (
          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-center font-bold text-white">
            {message}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-center text-xs leading-6 text-slate-500">
          NOLERA X Security Layer • Permission controlled • Audit logged
        </div>
      </div>
    </main>
  )
}
