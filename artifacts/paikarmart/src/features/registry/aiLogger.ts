const STORAGE_KEY = "pm.aiLog.v1";
const MAX_ENTRIES = 100;

export interface AIChange {
  id: string;
  scope: string;
  actor: "admin" | "ai" | "system";
  summary: string;
  details?: unknown;
  at: string;
}

function readLog(): AIChange[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AIChange[]) : [];
  } catch {
    return [];
  }
}

function writeLog(entries: AIChange[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export { readLog };

export function logChange(entry: Omit<AIChange, "id" | "at">) {
  const log = readLog();
  const newEntry: AIChange = {
    ...entry,
    id: `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
  };
  const updated = [newEntry, ...log].slice(0, MAX_ENTRIES);
  writeLog(updated);
  window.dispatchEvent(new CustomEvent("pm:ai:logged"));
}

export function clearLog() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
