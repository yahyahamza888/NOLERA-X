"use client";

export type AdStatus =
  | "draft"
  | "pending"
  | "active"
  | "paused"
  | "completed"
  | "rejected";

export type AdObjective =
  | "awareness"
  | "traffic"
  | "sales"
  | "app"
  | "followers";

export interface NoleraAd {
  id: string;
  advertiserId: string;
  title: string;
  description: string;
  imageUrl?: string;
  targetUrl?: string;
  objective: AdObjective;
  currency: string;
  budget: number;
  spent: number;
  dailyBudget?: number;
  status: AdStatus;
  country?: string;
  language?: string;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "nolera-ads-v1";

function readAds(): NoleraAd[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAds(ads: NoleraAd[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
}

function generateId() {
  return `ADS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function getAds(advertiserId?: string) {
  const ads = readAds();
  return advertiserId
    ? ads.filter((ad) => ad.advertiserId === advertiserId)
    : ads;
}

export function createAd(
  input: Omit<
    NoleraAd,
    | "id"
    | "spent"
    | "impressions"
    | "clicks"
    | "conversions"
    | "createdAt"
    | "updatedAt"
  >
) {
  const now = new Date().toISOString();

  const ad: NoleraAd = {
    ...input,
    id: generateId(),
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    createdAt: now,
    updatedAt: now,
  };

  const ads = readAds();
  ads.unshift(ad);
  writeAds(ads);

  return ad;
}

export function updateAd(
  id: string,
  updates: Partial<Omit<NoleraAd, "id" | "advertiserId">>
) {
  const ads = readAds();
  const index = ads.findIndex((ad) => ad.id === id);

  if (index === -1) return null;

  ads[index] = {
    ...ads[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeAds(ads);
  return ads[index];
}

export function pauseAd(id: string) {
  return updateAd(id, { status: "paused" });
}

export function activateAd(id: string) {
  return updateAd(id, { status: "active" });
}

export function deleteAd(id: string) {
  writeAds(readAds().filter((ad) => ad.id !== id));
}

export function recordImpression(id: string) {
  const ads = readAds();
  const ad = ads.find((item) => item.id === id);

  if (!ad || ad.status !== "active") return null;

  ad.impressions += 1;
  ad.updatedAt = new Date().toISOString();
  writeAds(ads);

  return ad;
}

export function recordClick(id: string) {
  const ads = readAds();
  const ad = ads.find((item) => item.id === id);

  if (!ad || ad.status !== "active") return null;

  ad.clicks += 1;
  ad.updatedAt = new Date().toISOString();
  writeAds(ads);

  return ad;
}

export function recordConversion(id: string) {
  const ads = readAds();
  const ad = ads.find((item) => item.id === id);

  if (!ad || ad.status !== "active") return null;

  ad.conversions += 1;
  ad.updatedAt = new Date().toISOString();
  writeAds(ads);

  return ad;
}

export function calculateCTR(ad: NoleraAd) {
  return ad.impressions ? (ad.clicks / ad.impressions) * 100 : 0;
}

export function calculateConversionRate(ad: NoleraAd) {
  return ad.clicks ? (ad.conversions / ad.clicks) * 100 : 0;
}

export function calculateRemainingBudget(ad: NoleraAd) {
  return Math.max(0, ad.budget - ad.spent);
}

export function getAdAnalytics(advertiserId?: string) {
  const ads = getAds(advertiserId);

  const impressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const clicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const conversions = ads.reduce((sum, ad) => sum + ad.conversions, 0);
  const spent = ads.reduce((sum, ad) => sum + ad.spent, 0);
  const budget = ads.reduce((sum, ad) => sum + ad.budget, 0);

  return {
    campaigns: ads.length,
    impressions,
    clicks,
    conversions,
    spent,
    budget,
    remainingBudget: Math.max(0, budget - spent),
    ctr: impressions ? (clicks / impressions) * 100 : 0,
    conversionRate: clicks ? (conversions / clicks) * 100 : 0,
  };
}

export function resetAdsDemo() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
