export interface FeatureFlags {
  otpLogin: boolean;
  wishlist: boolean;
  digitalContent: boolean;
  pkCoin: boolean;
  location: boolean;
  aiRecommendations: boolean;
  darkMode: boolean;
  reels: boolean;
  demandSystem: boolean;
  liveShop: boolean;
  affiliateProgram: boolean;
  sellerAnalytics: boolean;
  adminRegistry: boolean;
  multiCurrency: boolean;
  pushNotifications: boolean;
  devNotes: boolean;
}

const STORAGE_KEY = "pm.featureFlags.v1";

const DEFAULTS: FeatureFlags = {
  otpLogin: false,
  wishlist: true,
  digitalContent: true,
  pkCoin: true,
  location: true,
  aiRecommendations: false,
  darkMode: true,
  reels: true,
  demandSystem: true,
  liveShop: false,
  affiliateProgram: false,
  sellerAnalytics: true,
  adminRegistry: true,
  multiCurrency: false,
  pushNotifications: false,
  devNotes: true,
};

function readStored(): Partial<FeatureFlags> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getFlags(): FeatureFlags {
  return { ...DEFAULTS, ...readStored() };
}

export function setFlag(key: keyof FeatureFlags, value: boolean): void {
  if (typeof window === "undefined") return;
  const stored = readStored();
  stored[key] = value;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  window.dispatchEvent(new CustomEvent("pm:flags:changed"));
}

export function resetFlags(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("pm:flags:changed"));
}
