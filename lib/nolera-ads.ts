"use client";

import { getSupabaseClient } from "./nolera-auth";

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

async function currentUser() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) throw new Error("Authentication required");

  return data.user;
}

function mapAd(row: any): NoleraAd {
  return {
    id: row.id,
    advertiserId: row.advertiser_id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    targetUrl: row.target_url,
    objective: row.objective,
    currency: row.currency,
    budget: Number(row.budget || 0),
    spent: Number(row.spent || 0),
    dailyBudget:
      row.daily_budget == null ? undefined : Number(row.daily_budget),
    status: row.status,
    country: row.country,
    language: row.language,
    startDate: row.start_date,
    endDate: row.end_date,
    impressions: Number(row.impressions || 0),
    clicks: Number(row.clicks || 0),
    conversions: Number(row.conversions || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAds(advertiserId?: string) {
  const user = await currentUser();

  if (advertiserId && advertiserId !== user.id) {
    throw new Error("Unauthorized advertiser");
  }

  const { data, error } = await getSupabaseClient()
    .from("nolera_ads")
    .select("*")
    .eq("advertiser_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(mapAd);
}

export async function createAd(
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
  const user = await currentUser();

  if (!Number.isFinite(input.budget) || input.budget <= 0) {
    throw new Error("Invalid advertising budget");
  }

  const { data, error } = await getSupabaseClient()
    .from("nolera_ads")
    .insert({
      advertiser_id: user.id,
      title: input.title,
      description: input.description,
      image_url: input.imageUrl || null,
      target_url: input.targetUrl || null,
      objective: input.objective,
      currency: input.currency,
      budget: input.budget,
      daily_budget: input.dailyBudget ?? null,
      status: "pending",
      country: input.country || null,
      language: input.language || null,
      start_date: input.startDate || null,
      end_date: input.endDate || null,
    })
    .select("*")
    .single();

  if (error) throw error;

  return mapAd(data);
}

export async function updateAd(
  id: string,
  updates: Partial<Omit<NoleraAd, "id" | "advertiserId">>
) {
  await currentUser();

  const payload: Record<string, unknown> = {};

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined)
    payload.description = updates.description;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  if (updates.targetUrl !== undefined) payload.target_url = updates.targetUrl;
  if (updates.objective !== undefined) payload.objective = updates.objective;
  if (updates.budget !== undefined) payload.budget = updates.budget;
  if (updates.dailyBudget !== undefined)
    payload.daily_budget = updates.dailyBudget;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.country !== undefined) payload.country = updates.country;
  if (updates.language !== undefined) payload.language = updates.language;
  if (updates.startDate !== undefined) payload.start_date = updates.startDate;
  if (updates.endDate !== undefined) payload.end_date = updates.endDate;

  payload.updated_at = new Date().toISOString();

  const { data, error } = await getSupabaseClient()
    .from("nolera_ads")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;

  return mapAd(data);
}

export function pauseAd(id: string) {
  return updateAd(id, { status: "paused" });
}

export function activateAd(id: string) {
  return updateAd(id, { status: "active" });
}

export async function deleteAd(id: string) {
  await currentUser();

  const { error } = await getSupabaseClient()
    .from("nolera_ads")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function recordImpression(id: string) {
  await currentUser();

  throw new Error(
    "Ad analytics must be recorded through a secured backend/RPC. No local analytics mutation is allowed."
  );
}

export async function recordClick(id: string) {
  await currentUser();

  throw new Error(
    "Ad analytics must be recorded through a secured backend/RPC. No local analytics mutation is allowed."
  );
}

export async function recordConversion(id: string) {
  await currentUser();

  throw new Error(
    "Ad analytics must be recorded through a secured backend/RPC. No local analytics mutation is allowed."
  );
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

export async function getAdAnalytics(advertiserId?: string) {
  const ads = await getAds(advertiserId);

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

export async function resetAdsDemo() {
  throw new Error("Demo reset is disabled. NOLERA ADS uses backend data only.");
}

export async function getAdminAds(): Promise<NoleraAd[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc("nolera_admin_list_ads");

  if (error) throw error;

  return ((data || []) as any[]).map((row) => ({
    id: row.id,
    advertiserId: row.advertiser_id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    targetUrl: row.target_url,
    objective: row.objective,
    currency: row.currency,
    budget: Number(row.budget || 0),
    spent: Number(row.spent || 0),
    dailyBudget: Number(row.daily_budget || 0),
    status: row.status,
    country: row.country,
    language: row.language,
    startDate: row.start_date,
    endDate: row.end_date,
    impressions: Number(row.impressions || 0),
    clicks: Number(row.clicks || 0),
    conversions: Number(row.conversions || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function adminSetAdStatus(
  id: string,
  status: NoleraAd["status"]
) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc(
    "nolera_admin_set_ad_status",
    {
      p_ad_id: id,
      p_status: status,
    }
  );

  if (error) throw error;

  return Boolean(data);
}

export async function adminDeleteAd(id: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc(
    "nolera_admin_delete_ad",
    {
      p_ad_id: id,
    }
  );

  if (error) throw error;

  return Boolean(data);
}
