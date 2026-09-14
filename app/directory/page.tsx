"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Building2,
  Search,
  MapPin,
  Globe2,
  CheckCircle2,
  Plus,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import {
  createCompany,
  getCompanies,
  type NoleraCompany,
} from "@/lib/nolera-directory"

const categories = [
  "all",
  "real-estate",
  "logistics",
  "construction",
  "maintenance",
  "cleaning",
  "security",
  "business",
  "services",
]

export default function DirectoryPage() {
  const [companies, setCompanies] = useState<NoleraCompany[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAdd, setShowAdd] = useState(false)

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "business",
    country: "",
    city: "",
    area: "",
    website: "",
    phone: "",
  })

  async function loadCompanies() {
    try {
      setLoading(true)
      setError("")

      const data = await getCompanies({
        search,
        category,
        country: country || undefined,
        city: city || undefined,
      })

      setCompanies(data)
    } catch (err) {
      console.error(err)
      setError("تعذر تحميل دليل الشركات حالياً")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCompanies()
    }, 250)

    return () => clearTimeout(timer)
  }, [search, category, country, city])

  const visibleCompanies = useMemo(() => companies, [companies])

  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name.trim()) {
      setError("اكتب اسم الشركة أولاً")
      return
    }

    try {
      setLoading(true)
      setError("")

      await createCompany(form)

      setForm({
        name: "",
        description: "",
        category: "business",
        country: "",
        city: "",
        area: "",
        website: "",
        phone: "",
      })

      setShowAdd(false)
      setError("تم إرسال الشركة للمراجعة. ستظهر بعد اعتمادها.")
    } catch (err) {
      console.error(err)
      setError("تعذر إرسال الشركة. تأكد من تسجيل الدخول.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-5 sm:px-6">
        <header className="mb-6 rounded-3xl bg-gradient-to-br from-[#512d68] to-[#3c2549] p-5 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
                aria-label="الرئيسية"
              >
                <ArrowLeft size={20} />
              </Link>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  NOLERA X
                </p>
                <h1 className="text-2xl font-black">Company Directory</h1>
              </div>
            </div>

            <Building2 size={34} className="text-white/80" />
          </div>

          <p className="mt-4 text-sm leading-6 text-white/80">
            دليل عالمي للشركات والخدمات والعقارات واللوجستيات والشراكات.
          </p>
        </header>

        <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن شركة أو خدمة أو مدينة..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 outline-none focus:border-purple-500"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
                  category === item
                    ? "bg-[#512d68] text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item === "all" ? "الكل" : item}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="الدولة"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="المدينة"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
          </div>
        </section>

        {error && (
          <div className="mb-4 rounded-2xl border border-purple-200 bg-purple-50 p-4 text-sm font-semibold text-purple-800">
            {error}
          </div>
        )}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              GLOBAL DIRECTORY
            </p>
            <h2 className="text-xl font-black">
              {visibleCompanies.length} شركة
            </h2>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#512d68] px-4 py-3 text-sm font-black text-white shadow"
          >
            <Plus size={18} />
            أضف شركة
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <Loader2 className="animate-spin text-[#512d68]" size={30} />
          </div>
        ) : visibleCompanies.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Building2
              size={42}
              className="mx-auto mb-3 text-slate-300"
            />
            <h3 className="text-lg font-black">لا توجد شركات حالياً</h3>
            <p className="mt-2 text-sm text-slate-500">
              أضف شركتك لتدخل قائمة المراجعة في NOLERA X.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCompanies.map((company) => (
              <article
                key={company.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#512d68]">
                    <Building2 size={25} />
                  </div>

                  {company.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={14} />
                      موثقة
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-black">{company.name}</h3>

                <p className="mt-1 text-sm text-slate-500">
                  {company.category}
                </p>

                {company.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {company.description}
                  </p>
                )}

                {(company.country || company.city) && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    {[company.city, company.country]
                      .filter(Boolean)
                      .join("، ")}
                  </div>
                )}

                {company.website && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Globe2 size={16} />
                    موقع الشركة
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-bold text-amber-600">
                    ★ {Number(company.rating || 0).toFixed(1)}
                  </span>

                  <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                    عرض التفاصيل
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleAddCompany}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black">إضافة شركة</h2>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="rounded-xl bg-slate-100 px-3 py-2 font-bold"
                >
                  إغلاق
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="اسم الشركة"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="وصف الشركة والخدمات"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                >
                  {categories
                    .filter((item) => item !== "all")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    placeholder="الدولة"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  />

                  <input
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    placeholder="المدينة"
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </div>

                <input
                  value={form.area}
                  onChange={(e) =>
                    setForm({ ...form, area: e.target.value })
                  }
                  placeholder="المنطقة"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />

                <input
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  placeholder="Website"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />

                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="رقم الهاتف"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#512d68] py-3 font-black text-white disabled:opacity-50"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                إرسال للمراجعة
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
