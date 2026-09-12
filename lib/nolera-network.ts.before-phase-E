"use client";

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

const API_KEY_STORAGE = "nolera-api-keys";
const WEBHOOK_STORAGE = "nolera-webhooks";

export function getAPIKeys(): NoleraAPIKey[] {
  try {
    return JSON.parse(
      localStorage.getItem(API_KEY_STORAGE) ?? "[]",
    );
  } catch {
    return [];
  }
}

export function createAPIKey(name: string): NoleraAPIKey {
  const keys = getAPIKeys();

  const secret =
    "nx_live_" +
    crypto.randomUUID().replaceAll("-", "");

  const apiKey: NoleraAPIKey = {
    id: crypto.randomUUID(),
    name,
    keyPreview: secret.slice(0, 12) + "...",
    createdAt: new Date().toISOString(),
    active: true,
  };

  keys.unshift(apiKey);

  localStorage.setItem(
    API_KEY_STORAGE,
    JSON.stringify(keys),
  );

  return apiKey;
}

export function revokeAPIKey(id: string) {
  const keys = getAPIKeys().map((key) =>
    key.id === id
      ? { ...key, active: false }
      : key,
  );

  localStorage.setItem(
    API_KEY_STORAGE,
    JSON.stringify(keys),
  );
}

export function getWebhooks(): NoleraWebhook[] {
  try {
    return JSON.parse(
      localStorage.getItem(WEBHOOK_STORAGE) ?? "[]",
    );
  } catch {
    return [];
  }
}

export function createWebhook(
  url: string,
  events: string[],
): NoleraWebhook {
  if (!url.startsWith("https://")) {
    throw new Error("Webhook URL must use HTTPS");
  }

  const webhooks = getWebhooks();

  const webhook: NoleraWebhook = {
    id: crypto.randomUUID(),
    url,
    events,
    active: true,
    createdAt: new Date().toISOString(),
  };

  webhooks.unshift(webhook);

  localStorage.setItem(
    WEBHOOK_STORAGE,
    JSON.stringify(webhooks),
  );

  return webhook;
}

export function disableWebhook(id: string) {
  const webhooks = getWebhooks().map((item) =>
    item.id === id
      ? { ...item, active: false }
      : item,
  );

  localStorage.setItem(
    WEBHOOK_STORAGE,
    JSON.stringify(webhooks),
  );
}
