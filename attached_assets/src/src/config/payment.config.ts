/**
 * Payment gateway configuration.
 * Each gateway is "ready to activate" — flip `enabled: true` in admin to turn on.
 * Actual provider SDK wiring happens in /features/payment/providers/* (stubbed).
 */
export type PaymentGatewayId =
  | "stripe"
  | "paypal"
  | "bkash"
  | "nagad"
  | "rocket"
  | "cod"
  | "pk_coin";

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  label: string;
  region: "global" | "local";
  currencies: string[];
  enabled: boolean;
  /** If true, the UI shows the option but checkout is mocked. */
  mock: boolean;
  iconHint?: string;
}

export const PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  { id: "cod",     label: "Cash on Delivery", region: "local",  currencies: ["BDT", "USD"], enabled: true,  mock: true },
  { id: "bkash",   label: "bKash",            region: "local",  currencies: ["BDT"],        enabled: false, mock: true },
  { id: "nagad",   label: "Nagad",            region: "local",  currencies: ["BDT"],        enabled: false, mock: true },
  { id: "rocket",  label: "Rocket",           region: "local",  currencies: ["BDT"],        enabled: false, mock: true },
  { id: "stripe",  label: "Stripe",           region: "global", currencies: ["USD", "EUR"], enabled: false, mock: true },
  { id: "paypal",  label: "PayPal",           region: "global", currencies: ["USD"],        enabled: false, mock: true },
  { id: "pk_coin", label: "Pay with PK Coin", region: "global", currencies: ["PKC"],        enabled: true,  mock: true },
];

export function getEnabledGateways() {
  return PAYMENT_GATEWAYS.filter((g) => g.enabled);
}
