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
  type NoleraAd,
} from "@/lib/nolera-ads";

const advertiserId = "NXR-DEMO-ADVERTISER";

export default function AdsPage() {
  const [ads, setAds] = useState<NoleraAd[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [analytics, setAnalytics] = useState({
    campaigns: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    budget: 0,
  });

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setAds(getAds(advertiserId));
    setAnalytics(getAdAnalytics(advertiserId));
  }

  function createDemoAd() {
    createAd({
      advertiserId,
      title: "NOLERA X Campaign",
      description: "Discover the future of digital finance.",
      objective: "awareness",
      currency: "USD",
      budget: 100,
      dailyBudget: 10,
      status: "draft",
      country: "Global",
      language: "en",
    });

    setShowCreate(false);
    refresh();
  }

  function toggleAd(ad: NoleraAd) {
    if (ad.status === "active") {
      pauseAd(ad.id);
    } else {
      activateAd(ad.id);
    }

    refresh();
  }

  function removeAd(ad: NoleraAd) {
    deleteAd(ad.id);
    refresh();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-600">
              NOLERA X
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              NOLERA ADS
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create, manage and measure advertising campaigns.
            </p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white"
          >
            <Plus size={18} />
            Create Ad
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={<Target size={20} />}
            label="Campaigns"
            value={analytics.campaigns}
          />

          <Metric
            icon={<Eye size={20} />}
            label="Impressions"
            value={analytics.impressions}
          />

          <Metric
            icon={<MousePointerClick size={20} />}
            label="Clicks"
            value={analytics.clicks}
          />

          <Metric
            icon={<BarChart3 size={20} />}
            label="CTR"
            value={`${analytics.ctr.toFixed(2)}%`}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Campaigns
              </h2>

              <p className="text-sm text-slate-500">
                Manage your NOLERA advertising campaigns.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Wallet size={17} />
              Budget ${analytics.budget.toFixed(2)}
            </div>
          </div>

          {ads.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-10 text-center">

              <Target
                className="mx-auto mb-3 text-slate-400"
                size={32}
              />

              <p className="font-semibold">
                No campaigns yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first NOLERA ADS campaign.
              </p>

              <button
                onClick={createDemoAd}
                className="mt-5 rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white"
              >
                Create Campaign
              </button>

            </div>
          ) : (
            <div className="space-y-3">

              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold">
                          {ad.title}
                        </h3>

                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">
                          {ad.status}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {ad.description}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {ad.country} · {ad.language} · {ad.objective}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-5 text-sm">

                      <Stat
                        label="Views"
                        value={ad.impressions}
                      />

                      <Stat
                        label="Clicks"
                        value={ad.clicks}
                      />

                      <Stat
                        label="CTR"
                        value={`${calculateCTR(ad).toFixed(2)}%`}
                      />

                    </div>

                    <div className="text-sm">
                      <p className="text-slate-500">
                        Remaining
                      </p>

                      <p className="font-bold">
                        ${calculateRemainingBudget(ad).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => toggleAd(ad)}
                        className="rounded-xl border border-slate-200 p-2"
                        title={
                          ad.status === "active"
                            ? "Pause"
                            : "Activate"
                        }
                      >
                        {ad.status === "active" ? (
                          <Pause size={17} />
                        ) : (
                          <Play size={17} />
                        )}
                      </button>

                      <button
                        onClick={() => removeAd(ad)}
                        className="rounded-xl border border-red-100 p-2 text-red-500"
                        title="Delete"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

              <h2 className="text-xl font-bold">
                Create Campaign
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Start a new NOLERA ADS campaign.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm">
                Demo campaign:
                <br />
                <strong>NOLERA X Campaign</strong>
                <br />
                Budget: $100 · Daily: $10
              </div>

              <div className="mt-6 grid gap-3">

                <button
                  onClick={createDemoAd}
                  className="rounded-2xl bg-purple-600 px-4 py-3 font-semibold text-white"
                >
                  Create Campaign
                </button>

                <button
                  onClick={() => setShowCreate(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold"
                >
                  Cancel
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

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="font-bold">
        {value}
      </p>
    </div>
  );
}
