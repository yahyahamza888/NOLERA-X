"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  Plus,
  Target,
  Wallet,
  Pause,
  Play,
  Trash2,
  X,
} from "lucide-react";

import {
  activateAd,
  calculateCTR,
  calculateRemainingBudget,
  createAd,
  deleteAd,
  getAdAnalytics,
  getAds,
  pauseAd,
  type AdObjective,
  type NoleraAd,
} from "@/lib/nolera-ads";

const advertiserId = "NXR-DEMO-ADVERTISER";

const objectives: { value: AdObjective; label: string }[] = [
  { value: "awareness", label: "زيادة الوعي" },
  { value: "traffic", label: "زيارات" },
  { value: "sales", label: "مبيعات" },
  { value: "app", label: "تطبيق" },
  { value: "followers", label: "متابعين" },
];

export default function AdsPage() {
  const [ads, setAds] = useState<NoleraAd[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [objective, setObjective] = useState<AdObjective>("awareness");
  const [country, setCountry] = useState("Global");
  const [language, setLanguage] = useState("ar");
  const [budget, setBudget] = useState("100");
  const [dailyBudget, setDailyBudget] = useState("10");

  const [analytics, setAnalytics] = useState({
    campaigns: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spent: 0,
    budget: 0,
    remainingBudget: 0,
    ctr: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setAds(getAds(advertiserId));
    setAnalytics(getAdAnalytics(advertiserId));
  }

  function createCampaign() {
    if (!title.trim() || !description.trim()) return;

    createAd({
      advertiserId,
      title: title.trim(),
      description: description.trim(),
      targetUrl: targetUrl.trim() || undefined,
      objective,
      currency: "USD",
      budget: Math.max(1, Number(budget) || 100),
      dailyBudget: Math.max(1, Number(dailyBudget) || 10),
      status: "pending",
      country: country.trim() || "Global",
      language,
    });

    setTitle("");
    setDescription("");
    setTargetUrl("");
    setBudget("100");
    setDailyBudget("10");
    setShowCreate(false);
    refresh();
  }

  function toggleAd(ad: NoleraAd) {
    if (ad.status === "active") pauseAd(ad.id);
    else if (ad.status === "paused") activateAd(ad.id);
    else return;

    refresh();
  }

  function removeAd(ad: NoleraAd) {
    if (confirm("هل تريد حذف هذه الحملة؟")) {
      deleteAd(ad.id);
      refresh();
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-purple-600">NOLERA X</p>
            <h1 className="mt-1 text-3xl font-black">NOLERA ADS</h1>
            <p className="mt-2 text-sm text-slate-500">
              منصة إعلانية ذكية لإنشاء وإدارة الحملات.
            </p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 font-bold text-white shadow-lg shadow-purple-200"
          >
            <Plus size={18} />
            إنشاء حملة
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={<Target size={20} />} label="الحملات" value={analytics.campaigns} />
          <Metric icon={<Eye size={20} />} label="المشاهدات" value={analytics.impressions} />
          <Metric icon={<MousePointerClick size={20} />} label="النقرات" value={analytics.clicks} />
          <Metric icon={<BarChart3 size={20} />} label="CTR" value={`${analytics.ctr.toFixed(2)}%`} />
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard title="الميزانية" value={`$${analytics.budget.toFixed(2)}`} />
          <InfoCard title="المصروف" value={`$${analytics.spent.toFixed(2)}`} />
          <InfoCard title="المتبقي" value={`$${analytics.remainingBudget.toFixed(2)}`} />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">حملاتي الإعلانية</h2>
              <p className="text-sm text-slate-500">
                الحملات الجديدة تدخل المراجعة قبل التفعيل.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Wallet size={17} />
              ${analytics.remainingBudget.toFixed(2)}
            </div>
          </div>

          {ads.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-10 text-center">
              <Target className="mx-auto mb-3 text-slate-400" size={32} />
              <p className="font-bold">لا توجد حملات حتى الآن</p>
              <p className="mt-1 text-sm text-slate-500">
                أنشئ أول حملة إعلانية في NOLERA ADS.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-2 font-bold text-white"
              >
                إنشاء حملة
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {ads.map((ad) => (
                <div key={ad.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black">{ad.title}</h3>
                        <Status status={ad.status} />
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {ad.description}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {ad.country} · {ad.language} · {ad.objective}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-5 text-sm">
                      <Stat label="مشاهدات" value={ad.impressions} />
                      <Stat label="نقرات" value={ad.clicks} />
                      <Stat label="CTR" value={`${calculateCTR(ad).toFixed(2)}%`} />
                    </div>

                    <div className="text-sm">
                      <p className="text-slate-500">المتبقي</p>
                      <p className="font-black">
                        ${calculateRemainingBudget(ad).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {(ad.status === "active" || ad.status === "paused") && (
                        <button
                          onClick={() => toggleAd(ad)}
                          className="rounded-xl border border-slate-200 p-2"
                          title={ad.status === "active" ? "إيقاف" : "تشغيل"}
                        >
                          {ad.status === "active" ? (
                            <Pause size={17} />
                          ) : (
                            <Play size={17} />
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => removeAd(ad)}
                        className="rounded-xl border border-red-100 p-2 text-red-500"
                        title="حذف"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">إنشاء حملة إعلانية</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    سيتم إرسال الحملة للمراجعة.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <Field label="عنوان الإعلان">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: NOLERA X"
                    className="input"
                  />
                </Field>

                <Field label="وصف الإعلان">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب وصف الإعلان..."
                    rows={3}
                    className="input"
                  />
                </Field>

                <Field label="رابط الإعلان">
                  <input
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://..."
                    className="input"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="الهدف">
                    <select
                      value={objective}
                      onChange={(e) => setObjective(e.target.value as AdObjective)}
                      className="input"
                    >
                      {objectives.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="الدولة">
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="input"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="اللغة">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="input"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </Field>

                  <Field label="الميزانية">
                    <input
                      type="number"
                      min="1"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="input"
                    />
                  </Field>

                  <Field label="يومياً">
                    <input
                      type="number"
                      min="1"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(e.target.value)}
                      className="input"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  onClick={createCampaign}
                  disabled={!title.trim() || !description.trim()}
                  className="rounded-2xl bg-purple-600 px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  إرسال للمراجعة
                </button>

                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-black">{value}</p>
    </div>
  );
}

function Status({ status }: { status: NoleraAd["status"] }) {
  const labels: Record<NoleraAd["status"], string> = {
    draft: "مسودة",
    pending: "قيد المراجعة",
    active: "نشطة",
    paused: "متوقفة",
    completed: "مكتملة",
    rejected: "مرفوضة",
  };

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
      {labels[status]}
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      {children}
    </label>
  );
}
