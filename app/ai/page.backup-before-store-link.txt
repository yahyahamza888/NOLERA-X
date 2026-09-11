"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Sparkles,
  Wand2,
  Globe,
  Package,
  Brain,
  Search,
  Plus,
  Trash2,
  Power,
  Wallet,
  ArrowLeft,
  Copy,
  Check,
  FileText,
  Layout,
  Store,
  Bot,
  Code2,
  Megaphone,
  Building2,
  BarChart3,
  ShieldCheck,
  Languages,
  GraduationCap,
} from "lucide-react"

import { getBalance } from "@/lib/nolera-state"

type ToolType = "Native" | "API" | "External" | "Hybrid"

type AITool = {
  id: string
  name: string
  description: string
  category: string
  icon: string
  type: ToolType
  price: number
  enabled: boolean
}

type DigitalProduct = {
  id: string
  name: string
  description: string
  content: string
  price: number
  createdAt: string
}

type WebsiteProject = {
  id: string
  name: string
  business: string
  description: string
  pages: string[]
  content: Record<string, string>
  createdAt: string
}

const STORAGE_TOOLS = "nolera_ai_tools"
const STORAGE_PRODUCTS = "nolera_ai_products"
const STORAGE_WEBSITES = "nolera_ai_websites"

const defaultTools: AITool[] = [
  ["assistant", "AI Assistant", "مساعد ذكي عام", "Productivity", "bot", "Native", 0],
  ["financial", "AI Financial Advisor", "تحليل مالي وإدارة مالية", "Finance", "finance", "Hybrid", 1000],
  ["business", "AI Business Advisor", "دراسة وخطة عمل", "Business", "business", "Hybrid", 1500],
  ["product", "AI Digital Product Creator", "صناعة المنتجات الرقمية", "Creation", "product", "Native", 2500],
  ["website", "AI Website Creator", "إنشاء مواقع كاملة", "Creation", "website", "Hybrid", 5000],
  ["content", "AI Content Creator", "كتابة المحتوى", "Creation", "content", "Native", 500],
  ["design", "AI Design & Branding", "هوية وتصميم العلامة", "Creation", "design", "External", 1500],
  ["ads", "AI Ads Creator", "إنشاء الإعلانات", "Marketing", "ads", "Native", 750],
  ["company", "AI Company Search", "البحث عن الشركات", "Business", "company", "Hybrid", 0],
  ["document", "AI Document Assistant", "المستندات والملفات", "Productivity", "document", "Native", 500],
  ["translation", "AI Translation", "الترجمة الذكية", "Language", "language", "API", 250],
  ["research", "AI Research", "البحث والتحليل", "Research", "research", "API", 1000],
  ["code", "AI Code Assistant", "مساعد البرمجة", "Technology", "code", "API", 1000],
  ["fraud", "AI Fraud & Security", "كشف الاحتيال والمخاطر", "Security", "security", "Hybrid", 2000],
  ["kyc", "AI KYC Assistant", "مساعد التحقق والامتثال", "Security", "kyc", "Hybrid", 1000],
  ["support", "AI Customer Support", "دعم العملاء", "Business", "support", "API", 750],
  ["market", "AI Market Analysis", "تحليل الأسواق", "Finance", "market", "API", 1500],
  ["invoice", "AI Invoice Generator", "إنشاء الفواتير", "Business", "invoice", "Native", 500],
  ["cv", "AI CV Builder", "إنشاء السيرة الذاتية", "Productivity", "cv", "Native", 500],
  ["automation", "AI Automation", "الأتمتة", "Technology", "automation", "Hybrid", 2000],
  ["news", "AI News & Fact Checking", "الأخبار والتحقق", "Research", "news", "API", 750],
  ["image", "AI Image Generation", "توليد الصور", "Creation", "image", "API", 1500],
  ["video", "AI Video Creation", "إنشاء الفيديو", "Creation", "video", "API", 3000],
  ["social", "AI Social Media Manager", "إدارة الشبكات الاجتماعية", "Marketing", "social", "Hybrid", 1000],
  ["seo", "AI SEO Assistant", "تحسين محركات البحث", "Marketing", "seo", "Native", 750],
  ["tutor", "AI Tutor", "المعلم الذكي", "Education", "tutor", "API", 500],
].map(([id, name, description, category, icon, type, price]) => ({
  id: id as string,
  name: name as string,
  description: description as string,
  category: category as string,
  icon: icon as string,
  type: type as ToolType,
  price: price as number,
  enabled: true,
}))

const categories = [
  "All",
  "Productivity",
  "Finance",
  "Business",
  "Creation",
  "Marketing",
  "Research",
  "Technology",
  "Security",
  "Language",
  "Education",
]

function iconFor(icon: string) {
  const props = { size: 23 }
  const icons: Record<string, any> = {
    bot: Bot,
    finance: Wallet,
    business: Building2,
    product: Package,
    website: Globe,
    content: FileText,
    design: Wand2,
    ads: Megaphone,
    company: Search,
    document: FileText,
    language: Languages,
    research: Search,
    code: Code2,
    security: ShieldCheck,
    kyc: ShieldCheck,
    support: Bot,
    market: BarChart3,
    invoice: FileText,
    cv: FileText,
    automation: Sparkles,
    news: Search,
    image: Wand2,
    video: Sparkles,
    social: Megaphone,
    seo: Search,
    tutor: GraduationCap,
  }

  const I = icons[icon] || Sparkles
  return <I {...props} />
}

export default function AIPage() {
  const [tools, setTools] = useState<AITool[]>(defaultTools)
  const [category, setCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [balance, setBalance] = useState(0)
  const [selected, setSelected] = useState<AITool | null>(null)
  const [adminMode, setAdminMode] = useState(false)

  const [products, setProducts] = useState<DigitalProduct[]>([])
  const [websites, setWebsites] = useState<WebsiteProject[]>([])

  const [productName, setProductName] = useState("")
  const [productIdea, setProductIdea] = useState("")
  const [productAudience, setProductAudience] = useState("")
  const [productPrice, setProductPrice] = useState("")

  const [websiteName, setWebsiteName] = useState("")
  const [websiteBusiness, setWebsiteBusiness] = useState("")
  const [websiteDescription, setWebsiteDescription] = useState("")
  const [websitePages, setWebsitePages] = useState("الرئيسية, من نحن, الخدمات, المنتجات, تواصل معنا")

  const [answer, setAnswer] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setBalance(getBalance())

    try {
      const savedTools = localStorage.getItem(STORAGE_TOOLS)
      const savedProducts = localStorage.getItem(STORAGE_PRODUCTS)
      const savedWebsites = localStorage.getItem(STORAGE_WEBSITES)

      if (savedTools) setTools(JSON.parse(savedTools))
      if (savedProducts) setProducts(JSON.parse(savedProducts))
      if (savedWebsites) setWebsites(JSON.parse(savedWebsites))
    } catch {}
  }, [])

  function refreshBalance() {
    setBalance(getBalance())
  }

  const visibleTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchCategory = category === "All" || tool.category === category
      const matchSearch =
        !search ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.includes(search)

      return matchCategory && matchSearch && tool.enabled
    })
  }, [tools, category, search])

  function saveTools(next: AITool[]) {
    setTools(next)
    localStorage.setItem(STORAGE_TOOLS, JSON.stringify(next))
  }

  function useTool(tool: AITool) {
    setSelected(tool)
    setAnswer("")
  }

  function askAssistant() {
    if (!answer.trim()) return

    setAnswer(
      "تم استقبال طلبك داخل NOLERA AI. هذه طبقة تشغيل محلية حالياً. عند ربط مزود AI حقيقي من لوحة الإدارة سيتم إرسال الطلب إلى محرك الذكاء الاصطناعي الفعلي."
    )
  }

  function createDigitalProduct() {
    if (!productName.trim() || !productIdea.trim()) {
      setAnswer("أدخل اسم المنتج وفكرة المنتج أولاً.")
      return
    }

    const product: DigitalProduct = {
      id: crypto.randomUUID(),
      name: productName.trim(),
      description:
        `منتج رقمي موجه إلى ${productAudience || "العملاء المستهدفين"} مبني على فكرة: ${productIdea}`,
      content: `
# ${productName}

## الفكرة
${productIdea}

## الجمهور المستهدف
${productAudience || "الجمهور العام"}

## محتويات المنتج
1. مقدمة
2. المفاهيم الأساسية
3. خطوات التنفيذ
4. أدوات ونصائح عملية
5. أمثلة تطبيقية
6. قائمة مراجعة نهائية

## وصف تسويقي
${productName} هو منتج رقمي عملي يساعد المستخدم على تحويل الفكرة إلى خطوات واضحة وقابلة للتنفيذ.

## ملاحظة
يمكن تطوير هذا المحتوى لاحقاً بواسطة محرك AI خارجي حقيقي من إعدادات NOLERA AI.
      `.trim(),
      price: Number(productPrice) || 0,
      createdAt: new Date().toLocaleString("ar-SD"),
    }

    const next = [product, ...products]
    setProducts(next)
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(next))

    setAnswer(`تم إنشاء المنتج الرقمي "${product.name}" وحفظه داخل NOLERA AI.`)
    setProductName("")
    setProductIdea("")
    setProductAudience("")
    setProductPrice("")
  }

  function createWebsite() {
    if (!websiteName.trim() || !websiteBusiness.trim()) {
      setAnswer("أدخل اسم الموقع ونوع النشاط أولاً.")
      return
    }

    const pages = websitePages
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)

    const content: Record<string, string> = {}

    for (const page of pages) {
      content[page] =
        `# ${page}\n\n${websiteDescription || `محتوى احترافي لموقع ${websiteBusiness}.`}\n\nخدمات ${websiteBusiness}\n\nتواصل معنا لمعرفة المزيد.`
    }

    const project: WebsiteProject = {
      id: crypto.randomUUID(),
      name: websiteName.trim(),
      business: websiteBusiness.trim(),
      description: websiteDescription.trim(),
      pages,
      content,
      createdAt: new Date().toLocaleString("ar-SD"),
    }

    const next = [project, ...websites]
    setWebsites(next)
    localStorage.setItem(STORAGE_WEBSITES, JSON.stringify(next))

    setAnswer(
      `تم إنشاء هيكل موقع "${project.name}" مع ${pages.length} صفحات. المشروع محفوظ ويمكن ربطه لاحقاً بمحرك نشر حقيقي.`
    )
  }

  function deleteProduct(id: string) {
    const next = products.filter((p) => p.id !== id)
    setProducts(next)
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(next))
  }

  function deleteWebsite(id: string) {
    const next = websites.filter((w) => w.id !== id)
    setWebsites(next)
    localStorage.setItem(STORAGE_WEBSITES, JSON.stringify(next))
  }

  function toggleTool(id: string) {
    saveTools(
      tools.map((tool) =>
        tool.id === id ? { ...tool, enabled: !tool.enabled } : tool
      )
    )
  }

  function copyText(text: string) {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="min-h-screen bg-[#100c16] text-white px-4 py-6">
      <div className="mx-auto max-w-7xl">

        <header className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#251531] via-[#17111f] to-[#120e18] p-6 shadow-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-2xl bg-purple-600/20 p-3 text-purple-300">
                  <Sparkles size={30} />
                </div>
                <div>
                  <h1 className="text-2xl font-black md:text-4xl">
                    NOLERA Full AI Intelligence
                  </h1>
                  <p className="text-sm text-purple-200/70">
                    منصة الذكاء الاصطناعي الكاملة داخل NOLERA X
                  </p>
                </div>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-gray-300">
                أدوات لإنشاء المنتجات الرقمية والمواقع والمحتوى والتحليل
                والأعمال والأتمتة والبحث، مع قابلية ربط محركات AI حقيقية من
                لوحة الإدارة.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <Wallet className="text-green-400" size={22} />
              <div>
                <div className="text-xs text-gray-400">رصيد NOLERA</div>
                <div className="font-black text-green-400">
                  {balance.toLocaleString()} SDG
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-[#19131f] p-5">
            <Bot className="mb-3 text-purple-400" />
            <div className="text-3xl font-black">{tools.length}</div>
            <div className="text-sm text-gray-400">أداة AI</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#19131f] p-5">
            <Package className="mb-3 text-orange-400" />
            <div className="text-3xl font-black">{products.length}</div>
            <div className="text-sm text-gray-400">منتجات رقمية</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#19131f] p-5">
            <Globe className="mb-3 text-cyan-400" />
            <div className="text-3xl font-black">{websites.length}</div>
            <div className="text-sm text-gray-400">مشاريع مواقع</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#19131f] p-5">
            <ShieldCheck className="mb-3 text-green-400" />
            <div className="text-3xl font-black">4</div>
            <div className="text-sm text-gray-400">طرق تشغيل AI</div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-3.5 text-gray-500" size={20} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن أداة ذكاء اصطناعي..."
                className="w-full rounded-2xl border border-white/10 bg-[#19131f] py-3 pl-4 pr-12 outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={() => setAdminMode(!adminMode)}
              className="rounded-2xl border border-purple-500/30 bg-purple-600/15 px-5 py-3 font-bold"
            >
              {adminMode ? "إخفاء الإدارة" : "AI Admin"}
            </button>
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
                  category === item
                    ? "bg-purple-600 text-white"
                    : "bg-[#1b1522] text-gray-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => useTool(tool)}
                className="group rounded-3xl border border-white/10 bg-[#19131f] p-5 text-right transition hover:-translate-y-1 hover:border-purple-500/50 hover:bg-[#21172a]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-2xl bg-purple-600/15 p-3 text-purple-300">
                    {iconFor(tool.icon)}
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-gray-400">
                    {tool.type}
                  </span>
                </div>

                <h3 className="font-black">{tool.name}</h3>
                <p className="mt-2 min-h-10 text-xs leading-5 text-gray-400">
                  {tool.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-orange-300">
                    {tool.price === 0
                      ? "مجاني"
                      : `${tool.price.toLocaleString()} SDG`}
                  </span>
                  <span className="text-xs text-purple-300">فتح الأداة ←</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {adminMode && (
          <section className="mt-8 rounded-3xl border border-orange-500/20 bg-[#1a1319] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">AI Administration</h2>
                <p className="text-sm text-gray-400">
                  إدارة الأدوات وحالتها وطريقة تشغيلها
                </p>
              </div>
              <Plus className="text-orange-400" />
            </div>

            <div className="space-y-2">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex flex-col gap-3 rounded-2xl bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="font-bold">{tool.name}</div>
                    <div className="text-xs text-gray-500">
                      {tool.type} · {tool.price.toLocaleString()} SDG
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTool(tool.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm ${
                      tool.enabled
                        ? "bg-green-500/15 text-green-300"
                        : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    <Power size={16} />
                    {tool.enabled ? "مفعلة" : "متوقفة"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {selected && (
          <section className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
            <div className="mx-auto mt-5 max-w-4xl rounded-3xl border border-purple-500/30 bg-[#17111e] p-5 shadow-2xl md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-xl bg-white/5 p-2"
                  >
                    <ArrowLeft />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black">{selected.name}</h2>
                    <p className="text-sm text-gray-400">
                      {selected.description}
                    </p>
                  </div>
                </div>
              </div>

              {selected.id === "product" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-purple-500/10 p-4 text-sm text-purple-200">
                    صناعة المنتج الرقمي من الفكرة حتى المحتوى الأساسي.
                  </div>

                  <input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="اسم المنتج الرقمي"
                    className="w-full rounded-2xl bg-black/30 p-4 outline-none"
                  />

                  <textarea
                    value={productIdea}
                    onChange={(e) => setProductIdea(e.target.value)}
                    placeholder="اشرح فكرة المنتج بالتفصيل..."
                    className="min-h-32 w-full rounded-2xl bg-black/30 p-4 outline-none"
                  />

                  <input
                    value={productAudience}
                    onChange={(e) => setProductAudience(e.target.value)}
                    placeholder="الجمهور المستهدف"
                    className="w-full rounded-2xl bg-black/30 p-4 outline-none"
                  />

                  <input
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    type="number"
                    placeholder="سعر المنتج SDG"
                    className="w-full rounded-2xl bg-black/30 p-4 outline-none"
                  />

                  <button
                    onClick={createDigitalProduct}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-4 font-black"
                  >
                    <Wand2 size={20} />
                    إنشاء المنتج الرقمي
                  </button>
                </div>
              )}

              {selected.id === "website" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-200">
                    أنشئ هيكل موقع تجاري من وصف بسيط لنشاطك.
                  </div>

                  <input
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    placeholder="اسم الموقع"
                    className="w-full rounded-2xl bg-black/30 p-4 outline-none"
                  />

                  <input
                    value={websiteBusiness}
                    onChange={(e) => setWebsiteBusiness(e.target.value)}
                    placeholder="نوع النشاط — مثال: شركة صناعة وتركيب الكلادنج"
                    className="w-full rounded-2xl bg-black/30 p-4 outline-none"
                  />

                  <textarea
                    value={websiteDescription}
                    onChange={(e) => setWebsiteDescription(e.target.value)}
                    placeholder="صف الموقع والخدمات والشكل المطلوب..."
                    className="min-h-32 w-full rounded-2xl bg-black/30 p-4 outline-none"
                  />

                  <input
                    value={websitePages}
                    onChange={(e) => setWebsitePages(e.target.value)}
                    placeholder="الصفحات مفصولة بفواصل"
                    className="w-full rounded-2xl bg-black/30 p-4 outline-none"
                  />

                  <button
                    onClick={createWebsite}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-4 font-black"
                  >
                    <Globe size={20} />
                    إنشاء الموقع
                  </button>
                </div>
              )}

              {selected.id !== "product" && selected.id !== "website" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="mb-3 flex items-center gap-2 text-purple-300">
                      <Brain size={20} />
                      NOLERA AI Engine
                    </div>

                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={`اكتب طلبك إلى ${selected.name}...`}
                      className="min-h-40 w-full rounded-2xl bg-[#0e0a12] p-4 outline-none"
                    />

                    <button
                      onClick={askAssistant}
                      className="mt-4 w-full rounded-2xl bg-purple-600 py-4 font-black"
                    >
                      تشغيل الأداة
                    </button>
                  </div>
                </div>
              )}

              {answer && (
                <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-bold text-green-300">
                      نتيجة NOLERA AI
                    </span>
                    <button
                      onClick={() => copyText(answer)}
                      className="rounded-lg bg-white/5 p-2"
                    >
                      {copied ? <Check size={17} /> : <Copy size={17} />}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-200">
                    {answer}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-purple-500/20 bg-[#19131f] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">منتجاتي الرقمية</h2>
                <p className="text-xs text-gray-500">
                  المنتجات التي أنشأتها NOLERA AI
                </p>
              </div>
              <Package className="text-orange-400" />
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl bg-black/20 p-6 text-center text-sm text-gray-500">
                لم يتم إنشاء منتجات بعد.
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black">{product.name}</div>
                        <div className="mt-1 text-xs text-gray-400">
                          {product.description}
                        </div>
                        <div className="mt-2 text-xs text-orange-300">
                          {product.price.toLocaleString()} SDG
                        </div>
                      </div>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="rounded-lg p-2 text-red-400"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-[#19131f] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">مشاريع المواقع</h2>
                <p className="text-xs text-gray-500">
                  مواقع تم تصميم هيكلها بواسطة NOLERA AI
                </p>
              </div>
              <Globe className="text-cyan-400" />
            </div>

            {websites.length === 0 ? (
              <div className="rounded-2xl bg-black/20 p-6 text-center text-sm text-gray-500">
                لم يتم إنشاء مواقع بعد.
              </div>
            ) : (
              <div className="space-y-3">
                {websites.map((site) => (
                  <div key={site.id} className="rounded-2xl bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black">{site.name}</div>
                        <div className="mt-1 text-xs text-gray-400">
                          {site.business}
                        </div>
                        <div className="mt-2 text-xs text-cyan-300">
                          {site.pages.length} صفحات
                        </div>
                      </div>

                      <button
                        onClick={() => deleteWebsite(site.id)}
                        className="rounded-lg p-2 text-red-400"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#19131f] p-6">
          <h2 className="text-xl font-black">بنية NOLERA AI</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              ["Native", "أدوات تعمل داخل NOLERA"],
              ["API", "محركات AI خارجية عبر API"],
              ["External", "خدمات AI خارجية"],
              ["Hybrid", "NOLERA + AI خارجي"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-black/20 p-4">
                <div className="font-black text-purple-300">{title}</div>
                <div className="mt-2 text-xs leading-6 text-gray-400">
                  {text}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-6 text-gray-500">
            هذه المرحلة تبني طبقة التشغيل والمنتجات والمشاريع محلياً. عند ربط
            مزود AI حقيقي لاحقاً ستكون مفاتيح API على الخادم وليس داخل
            المتصفح.
          </p>
        </section>
      </div>
    </main>
  )
}
