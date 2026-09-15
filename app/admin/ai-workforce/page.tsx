"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CirclePause,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  assignAIAgent,
  getAIAgents,
  setAIAgentStatus,
  updateAIAgent,
  type NoleraAIAgent,
} from "@/lib/nolera-ai-workforce";

const supabase = createSupabaseBrowserClient();

const MODULES = [
  { id: "ai", label: "NOLERA AI" },
  { id: "store", label: "Store" },
  { id: "ads", label: "NOLERA ADS" },
  { id: "paradise", label: "NOLERA PARADISE" },
  { id: "logistics", label: "Logistics" },
  { id: "directory", label: "Company Directory" },
  { id: "content", label: "Content / Creation" },
  { id: "create-product", label: "Digital Products" },
  { id: "business", label: "Business Intelligence" },
  { id: "automation", label: "Automation" },
  { id: "research", label: "Research" },
  { id: "security", label: "Security" },
];

const CATEGORIES = [
  "general",
  "commerce",
  "marketing",
  "creation",
  "operations",
  "business",
  "automation",
  "research",
  "security",
];

const TYPES = ["native", "api", "hybrid", "external"] as const;

function emptyAgent(): Partial<NoleraAIAgent> {
  return {
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    category: "general",
    module: "ai",
    icon: "bot",
    status: "active",
    agent_type: "hybrid",
    capabilities: [],
    commands: [],
    settings: {},
    priority: 100,
  };
}

export default function AIWorkforcePage() {
  const [agents, setAgents] = useState<NoleraAIAgent[]>([]);
  const [selected, setSelected] = useState<NoleraAIAgent | null>(null);
  const [draft, setDraft] = useState<Partial<NoleraAIAgent>>(emptyAgent());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [authorized, setAuthorized] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  const [filterModule, setFilterModule] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [showEditor, setShowEditor] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assignModule, setAssignModule] = useState("store");

  async function checkAccess() {
    setCheckingRole(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAuthorized(false);
      setCheckingRole(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isSuperAdmin = profile?.role === "super_admin";

    setAuthorized(isSuperAdmin);
    setCheckingRole(false);
  }

  async function loadAgents() {
    setLoading(true);

    const data = await getAIAgents();

    setAgents(data);
    setLoading(false);
  }

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    if (authorized) {
      loadAgents();
    }
  }, [authorized]);

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return agents.filter((agent) => {
      const moduleMatch =
        filterModule === "all" || agent.module === filterModule;

      const statusMatch =
        filterStatus === "all" || agent.status === filterStatus;

      const searchMatch =
        !q ||
        [
          agent.name,
          agent.name_ar,
          agent.description,
          agent.description_ar,
          agent.category,
          agent.module,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      return moduleMatch && statusMatch && searchMatch;
    });
  }, [agents, filterModule, filterStatus, search]);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const pausedCount = agents.filter((a) => a.status === "paused").length;

  function openNewAgent() {
    setSelected(null);
    setDraft(emptyAgent());
    setShowEditor(true);
    setMessage("");
  }

  function openEditAgent(agent: NoleraAIAgent) {
    setSelected(agent);
    setDraft({
      ...agent,
      capabilities: [...(agent.capabilities ?? [])],
      commands: [...(agent.commands ?? [])],
    });
    setShowEditor(true);
    setMessage("");
  }

  async function saveAgent() {
    if (!draft.name?.trim()) {
      setMessage("اسم الـ Agent مطلوب.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (selected) {
        const updated = await updateAIAgent(selected.id, {
          name: draft.name.trim(),
          name_ar: draft.name_ar?.trim() || null,
          description: draft.description?.trim() || null,
          description_ar: draft.description_ar?.trim() || null,
          category: draft.category || "general",
          module: draft.module || "ai",
          icon: draft.icon || "bot",
          status: draft.status || "active",
          agent_type: draft.agent_type || "hybrid",
          priority: Number(draft.priority ?? 100),
        });

        setAgents((current) =>
          current.map((agent) =>
            agent.id === updated.id ? updated : agent,
          ),
        );

        setSelected(updated);
        setDraft(updated);
        setMessage("تم تحديث الـ AI Agent.");
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("يجب تسجيل الدخول أولاً.");
        }

        const { data, error } = await supabase
          .from("nolera_ai_agents")
          .insert({
            name: draft.name.trim(),
            name_ar: draft.name_ar?.trim() || null,
            description: draft.description?.trim() || null,
            description_ar: draft.description_ar?.trim() || null,
            category: draft.category || "general",
            module: draft.module || "ai",
            icon: draft.icon || "bot",
            status: draft.status || "active",
            agent_type: draft.agent_type || "hybrid",
            capabilities: [],
            commands: [],
            settings: {},
            priority: Number(draft.priority ?? 100),
            created_by: user.id,
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        const newAgent = data as NoleraAIAgent;

        setAgents((current) => [...current, newAgent]);
        setSelected(newAgent);
        setDraft(newAgent);
        setMessage("تم إنشاء الـ AI Agent.");
      }

      setShowEditor(false);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "حدث خطأ أثناء الحفظ.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(agent: NoleraAIAgent) {
    const nextStatus =
      agent.status === "active" ? "paused" : "active";

    try {
      const updated = await setAIAgentStatus(agent.id, nextStatus);

      setAgents((current) =>
        current.map((item) =>
          item.id === agent.id ? updated : item,
        ),
      );

      if (selected?.id === agent.id) {
        setSelected(updated);
        setDraft(updated);
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "تعذر تغيير حالة Agent.",
      );
    }
  }

  async function assignSelectedAgent() {
    if (!selected) return;

    try {
      await assignAIAgent(selected.id, assignModule, selected.capabilities ?? []);
      setShowAssign(false);
      setMessage(
        `تم توزيع ${selected.name} على ${assignModule}.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "تعذر توزيع الـ Agent.",
      );
    }
  }

  async function deleteAgent(agent: NoleraAIAgent) {
    const confirmed = window.confirm(
      `هل تريد حذف ${agent.name}؟`,
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("nolera_ai_agents")
      .delete()
      .eq("id", agent.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setAgents((current) =>
      current.filter((item) => item.id !== agent.id),
    );

    if (selected?.id === agent.id) {
      setSelected(null);
      setShowEditor(false);
    }

    setMessage("تم حذف الـ AI Agent.");
  }

  if (checkingRole) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--nolera-background,#f7f7fb)]">
        <Loader2 className="animate-spin" size={30} />
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[var(--nolera-background,#f7f7fb)] px-5 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-[var(--nolera-border,#e7e2ea)] bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-black">
            Super Admin Only
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            AI Workforce متاح لـ Super Admin فقط.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--nolera-background,#f7f7fb)] px-4 pb-28 pt-6 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="rounded-3xl border border-[var(--nolera-border,#e7e2ea)] bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-2xl bg-black p-3 text-white">
                  <Bot size={25} />
                </div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
                  SUPER ADMIN
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight">
                AI Workforce
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                الإدارة المركزية لوكلاء NOLERA AI وتوزيعهم على أقسام
                المنصة. الوكلاء ليسوا Admin أو Employee.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadAgents}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold"
              >
                <RefreshCw size={17} />
                تحديث
              </button>

              <button
                type="button"
                onClick={openNewAgent}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white"
              >
                <Plus size={18} />
                إضافة Agent
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-gray-50 p-4">
              <Users size={20} />
              <p className="mt-3 text-2xl font-black">
                {agents.length}
              </p>
              <p className="text-xs text-gray-500">إجمالي Agents</p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4">
              <Check size={20} />
              <p className="mt-3 text-2xl font-black">
                {activeCount}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <CirclePause size={20} />
              <p className="mt-3 text-2xl font-black">
                {pausedCount}
              </p>
              <p className="text-xs text-gray-500">Paused</p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <BriefcaseBusiness size={20} />
              <p className="mt-3 text-2xl font-black">
                {new Set(agents.map((a) => a.module)).size}
              </p>
              <p className="text-xs text-gray-500">أقسام مستخدمة</p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-5 rounded-3xl border border-[var(--nolera-border,#e7e2ea)] bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن Agent..."
              className="rounded-2xl border px-4 py-3 text-sm outline-none"
            />

            <select
              value={filterModule}
              onChange={(event) => setFilterModule(event.target.value)}
              className="rounded-2xl border px-4 py-3 text-sm"
            >
              <option value="all">كل الأقسام</option>
              {MODULES.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.label}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="rounded-2xl border px-4 py-3 text-sm"
            >
              <option value="all">كل الحالات</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </section>

        {message && (
          <div className="mt-4 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold">
            {message}
          </div>
        )}

        {/* Agents */}
        <section className="mt-5">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <Loader2 className="animate-spin" size={30} />
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="rounded-3xl border bg-white p-10 text-center">
              <Bot className="mx-auto mb-3" size={40} />
              <h2 className="font-black">لا توجد Agents</h2>
              <p className="mt-2 text-sm text-gray-500">
                غيّر الفلتر أو أضف AI Agent جديد.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredAgents.map((agent) => (
                <article
                  key={agent.id}
                  className="rounded-3xl border border-[var(--nolera-border,#e7e2ea)] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-2xl bg-gray-100 p-3">
                        <Bot size={22} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-black">
                          {agent.name}
                        </h2>
                        <p className="truncate text-xs text-gray-500">
                          {agent.name_ar || agent.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                        agent.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : agent.status === "paused"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <p className="mt-4 min-h-10 text-sm leading-5 text-gray-600">
                    {agent.description_ar ||
                      agent.description ||
                      "NOLERA AI Agent"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold">
                      {MODULES.find((m) => m.id === agent.module)?.label ||
                        agent.module}
                    </span>

                    <span className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold">
                      {agent.agent_type}
                    </span>

                    <span className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold">
                      {agent.category}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditAgent(agent)}
                      className="rounded-2xl border px-3 py-2.5 text-xs font-bold"
                    >
                      تعديل
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStatus(agent)}
                      className="rounded-2xl border px-3 py-2.5 text-xs font-bold"
                    >
                      {agent.status === "active"
                        ? "إيقاف مؤقت"
                        : "تفعيل"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelected(agent);
                        setAssignModule(agent.module || "store");
                        setShowAssign(true);
                      }}
                      className="rounded-2xl bg-black px-3 py-2.5 text-xs font-bold text-white"
                    >
                      توزيع
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteAgent(agent)}
                      className="inline-flex items-center justify-center gap-1 rounded-2xl border border-red-200 px-3 py-2.5 text-xs font-bold text-red-600"
                    >
                      <Trash2 size={14} />
                      حذف
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Editor */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-6">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 md:rounded-3xl md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  {selected ? "تعديل AI Agent" : "إضافة AI Agent"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  إدارة مركزية من Super Admin
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="rounded-full border p-2"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold">
                الاسم
                <input
                  value={draft.name ?? ""}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      name: event.target.value,
                    })
                  }
                  className="rounded-2xl border px-4 py-3 font-normal outline-none"
                  placeholder="Store AI Manager"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold">
                الاسم بالعربي
                <input
                  value={draft.name_ar ?? ""}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      name_ar: event.target.value,
                    })
                  }
                  className="rounded-2xl border px-4 py-3 font-normal outline-none"
                  placeholder="وكيل المتجر"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold">
                الوصف
                <textarea
                  value={draft.description_ar ?? draft.description ?? ""}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      description_ar: event.target.value,
                    })
                  }
                  className="min-h-24 rounded-2xl border px-4 py-3 font-normal outline-none"
                  placeholder="مهمة الـ Agent..."
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold">
                  القسم
                  <select
                    value={draft.module ?? "ai"}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        module: event.target.value,
                      })
                    }
                    className="rounded-2xl border px-4 py-3 font-normal"
                  >
                    {MODULES.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-bold">
                  التصنيف
                  <select
                    value={draft.category ?? "general"}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        category: event.target.value,
                      })
                    }
                    className="rounded-2xl border px-4 py-3 font-normal"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-bold">
                  النوع
                  <select
                    value={draft.agent_type ?? "hybrid"}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        agent_type: event.target.value as NoleraAIAgent["agent_type"],
                      })
                    }
                    className="rounded-2xl border px-4 py-3 font-normal"
                  >
                    {TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-bold">
                  الأولوية
                  <input
                    type="number"
                    value={draft.priority ?? 100}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        priority: Number(event.target.value),
                      })
                    }
                    className="rounded-2xl border px-4 py-3 font-normal"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-bold">
                الحالة
                <select
                  value={draft.status ?? "active"}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      status: event.target.value as NoleraAIAgent["status"],
                    })
                  }
                  className="rounded-2xl border px-4 py-3 font-normal"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="disabled">Disabled</option>
                </select>
              </label>

              <button
                type="button"
                disabled={saving}
                onClick={saveAgent}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 font-bold text-white disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                حفظ Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment */}
      {showAssign && selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-6">
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 md:rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  توزيع AI Agent
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selected.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAssign(false)}
                className="rounded-full border p-2"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6">
              <label className="grid gap-2 text-sm font-bold">
                القسم المستهدف
                <select
                  value={assignModule}
                  onChange={(event) =>
                    setAssignModule(event.target.value)
                  }
                  className="rounded-2xl border px-4 py-3 font-normal"
                >
                  {MODULES.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={assignSelectedAgent}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 font-bold text-white"
              >
                <Sparkles size={18} />
                توزيع Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
