export type MockProfile = {
  id: string;
  email?: string;
  llm_provider?: "weev" | "byok";
  api_key?: string; // stored locally for demo only
};

const STORAGE_KEY = "mock_profiles";

function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function readAll(): Record<string, MockProfile> {
  if (typeof window === "undefined") return {};
  return safeParse<Record<string, MockProfile>>(localStorage.getItem(STORAGE_KEY)) || {};
}

function writeAll(map: Record<string, MockProfile>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getProfile(userId: string): MockProfile | null {
  const all = readAll();
  return all[userId] || null;
}

export function upsertProfile(userId: string, patch: Partial<MockProfile>): MockProfile {
  const all = readAll();
  const existing = all[userId] || { id: userId };
  const next: MockProfile = { ...existing, ...patch, id: userId };
  all[userId] = next;
  writeAll(all);
  return next;
}

export function setProvider(userId: string, provider: "weev" | "byok"): MockProfile {
  return upsertProfile(userId, { llm_provider: provider });
}

export function setApiKey(userId: string, apiKey: string): MockProfile {
  return upsertProfile(userId, { api_key: apiKey });
}
