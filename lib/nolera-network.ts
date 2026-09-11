import { getSupabaseClient } from "./nolera-auth";

export interface NoleraAPIKey {
  id: string;
  name: string;
  keyPreview: string;
  createdAt: string;
  active: boolean;
}

export interface NoleraWebhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
}

async function requireUser() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Authentication required");
  }

  return { supabase, user: data.user };
}

export async function getAPIKeys(): Promise<NoleraAPIKey[]> {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("api_keys")
    .select("id,name,key_preview,created_at,active")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    keyPreview: row.key_preview,
    createdAt: row.created_at,
    active: Boolean(row.active),
  }));
}

export async function createAPIKey(name: string): Promise<NoleraAPIKey> {
  if (!name.trim()) {
    throw new Error("API key name is required");
  }

  const { supabase } = await requireUser();

  throw new Error(
    "API key creation requires the secure backend API. No secret was generated in the browser."
  );
}

export async function revokeAPIKey(id: string) {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("api_keys")
    .update({ active: false })
    .eq("id", id);

  if (error) throw error;

  return true;
}

export async function getWebhooks(): Promise<NoleraWebhook[]> {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("webhooks")
    .select("id,url,events,active,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    url: row.url,
    events: Array.isArray(row.events) ? row.events : [],
    active: Boolean(row.active),
    createdAt: row.created_at,
  }));
}

export async function createWebhook(
  url: string,
  events: string[],
): Promise<NoleraWebhook> {
  if (!url.startsWith("https://")) {
    throw new Error("Webhook URL must use HTTPS");
  }

  if (!events.length) {
    throw new Error("At least one webhook event is required");
  }

  throw new Error(
    "Webhook creation requires the secure backend API. No webhook secret was generated in the browser."
  );
}

export async function disableWebhook(id: string) {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("webhooks")
    .update({ active: false })
    .eq("id", id);

  if (error) throw error;

  return true;
}
