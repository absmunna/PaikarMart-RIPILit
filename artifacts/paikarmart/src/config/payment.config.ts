export type PaymentGatewayId =
  | "bkash"
  | "nagad"
  | "rocket"
  | "stripe"
  | "paypal"
  | "cod"
  | "pkcoin";

export interface PaymentGateway {
  id: PaymentGatewayId;
  name: string;
  logoUrl?: string;
  currency: string;
  minAmountBDT: number;
  maxAmountBDT: number;
  feePercent: number;
  enabled: boolean;
  mock: boolean;
}

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: "bkash",
    name: "bKash",
    logoUrl: "https://www.bkash.com/favicon.ico",
    currency: "BDT",
    minAmountBDT: 10,
    maxAmountBDT: 30000,
    feePercent: 1.5,
    enabled: true,
    mock: true,
  },
  {
    id: "nagad",
    name: "Nagad",
    currency: "BDT",
    minAmountBDT: 10,
    maxAmountBDT: 25000,
    feePercent: 1.0,
    enabled: true,
    mock: true,
  },
  {
    id: "rocket",
    name: "Rocket",
    currency: "BDT",
    minAmountBDT: 10,
    maxAmountBDT: 20000,
    feePercent: 1.2,
    enabled: true,
    mock: true,
  },
  {
    id: "stripe",
    name: "Stripe (Card)",
    currency: "USD",
    minAmountBDT: 100,
    maxAmountBDT: 500000,
    feePercent: 2.9,
    enabled: false,
    mock: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    currency: "USD",
    minAmountBDT: 100,
    maxAmountBDT: 500000,
    feePercent: 3.4,
    enabled: false,
    mock: true,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    currency: "BDT",
    minAmountBDT: 0,
    maxAmountBDT: 10000,
    feePercent: 0,
    enabled: true,
    mock: false,
  },
  {
    id: "pkcoin",
    name: "PK Coin",
    currency: "PKC",
    minAmountBDT: 10,
    maxAmountBDT: 5000,
    feePercent: 0,
    enabled: true,
    mock: true,
  },
];

export function getEnabledGateways(): PaymentGateway[] {
  return PAYMENT_GATEWAYS.filter((g) => g.enabled);
}

export function getGateway(id: PaymentGatewayId): PaymentGateway | undefined {
  return PAYMENT_GATEWAYS.find((g) => g.id === id);
}
