"use client";

export interface NoleraIdentity {
  id: string;
  noleraId: string;
  name: string;
  email?: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
}

const STORAGE_KEY = "nolera-identity-v2";

function generateId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);

  return (
    "NX-" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

export function getNoleraIdentity(): NoleraIdentity | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function createNoleraIdentity(
  name: string,
  email?: string,
  phone?: string,
): NoleraIdentity {
  const identity: NoleraIdentity = {
    id: crypto.randomUUID(),
    noleraId: generateId(),
    name: name.trim(),
    email,
    phone,
    verified: false,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));

  return identity;
}

export function updateNoleraIdentity(
  updates: Partial<Omit<NoleraIdentity, "id" | "noleraId">>,
) {
  const current = getNoleraIdentity();

  if (!current) {
    throw new Error("NOLERA ID does not exist");
  }

  const updated = {
    ...current,
    ...updates,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
}

export function verifyNoleraIdentity() {
  return updateNoleraIdentity({
    verified: true,
  });
}

export function clearNoleraIdentity() {
  localStorage.removeItem(STORAGE_KEY);
}
