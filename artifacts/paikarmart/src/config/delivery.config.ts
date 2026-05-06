export type DeliveryProviderId =
  | "self_pickup"
  | "paikarmart_courier"
  | "pathao"
  | "redx"
  | "steadfast"
  | "dhl"
  | "fedex";

export interface DeliveryProvider {
  id: DeliveryProviderId;
  name: string;
  logoUrl?: string;
  baseChargeBDT: number;
  perKgBDT: number;
  estimatedDays: string;
  availableZones: "nationwide" | "dhaka" | "international";
  enabled: boolean;
  mock: boolean;
}

export const DELIVERY_PROVIDERS: DeliveryProvider[] = [
  {
    id: "self_pickup",
    name: "Self Pickup",
    baseChargeBDT: 0,
    perKgBDT: 0,
    estimatedDays: "Same day",
    availableZones: "dhaka",
    enabled: true,
    mock: false,
  },
  {
    id: "paikarmart_courier",
    name: "PaikarMart Courier",
    baseChargeBDT: 60,
    perKgBDT: 10,
    estimatedDays: "1–2 days",
    availableZones: "nationwide",
    enabled: true,
    mock: true,
  },
  {
    id: "pathao",
    name: "Pathao",
    logoUrl: "https://pathao.com/favicon.ico",
    baseChargeBDT: 70,
    perKgBDT: 12,
    estimatedDays: "1–3 days",
    availableZones: "nationwide",
    enabled: true,
    mock: true,
  },
  {
    id: "redx",
    name: "RedX",
    logoUrl: "https://redx.com.bd/favicon.ico",
    baseChargeBDT: 65,
    perKgBDT: 10,
    estimatedDays: "2–4 days",
    availableZones: "nationwide",
    enabled: true,
    mock: true,
  },
  {
    id: "steadfast",
    name: "Steadfast",
    baseChargeBDT: 60,
    perKgBDT: 8,
    estimatedDays: "2–4 days",
    availableZones: "nationwide",
    enabled: true,
    mock: true,
  },
  {
    id: "dhl",
    name: "DHL Express",
    baseChargeBDT: 1200,
    perKgBDT: 300,
    estimatedDays: "3–5 days",
    availableZones: "international",
    enabled: true,
    mock: true,
  },
  {
    id: "fedex",
    name: "FedEx",
    baseChargeBDT: 1500,
    perKgBDT: 350,
    estimatedDays: "3–7 days",
    availableZones: "international",
    enabled: false,
    mock: true,
  },
];

export function getEnabledProviders(): DeliveryProvider[] {
  return DELIVERY_PROVIDERS.filter((p) => p.enabled);
}

export function getProvider(id: DeliveryProviderId): DeliveryProvider | undefined {
  return DELIVERY_PROVIDERS.find((p) => p.id === id);
}

export function calcDeliveryCharge(
  providerId: DeliveryProviderId,
  weightKg = 0
): number {
  const provider = getProvider(providerId);
  if (!provider) return 0;
  return provider.baseChargeBDT + Math.ceil(weightKg) * provider.perKgBDT;
}
