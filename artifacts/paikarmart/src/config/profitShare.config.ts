export interface ProfitShareConfig {
  enabled: boolean;
  platformPercent: number;
  sellerPercent: number;
  affiliatePercent: number;
  pkCoinRewardPercent: number;
  pkCoinOnlyOnOwnProducts: boolean;
}

const STORAGE_KEY = "pm.profitShare.v1";

const DEFAULTS: ProfitShareConfig = {
  enabled: true,
  platformPercent: 8,
  sellerPercent: 90,
  affiliatePercent: 2,
  pkCoinRewardPercent: 3,
  pkCoinOnlyOnOwnProducts: false,
};

export function getProfitShare(): ProfitShareConfig {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function setProfitShare(patch: Partial<ProfitShareConfig>): void {
  if (typeof window === "undefined") return;
  const current = getProfitShare();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  window.dispatchEvent(new CustomEvent("pm:profitShare:changed"));
}

export interface OrderSplit {
  sellerEarning: number;
  platformEarning: number;
  affiliateEarning: number;
  pkCoinReward: number;
}

export function splitOrderProfit(orderTotal: number, hasAffiliate = false): OrderSplit {
  const cfg = getProfitShare();
  const platform = Math.round((orderTotal * cfg.platformPercent) / 100);
  const affiliate = hasAffiliate ? Math.round((orderTotal * cfg.affiliatePercent) / 100) : 0;
  const seller = orderTotal - platform - affiliate;
  const pkCoin = cfg.enabled ? Math.round((orderTotal * cfg.pkCoinRewardPercent) / 100) : 0;
  return {
    sellerEarning: seller,
    platformEarning: platform,
    affiliateEarning: affiliate,
    pkCoinReward: pkCoin,
  };
}
