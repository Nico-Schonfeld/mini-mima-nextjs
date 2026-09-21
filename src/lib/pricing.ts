import type { SitePricing } from "@/lib/site-content";

export const COUPON_DISCOUNT_PERCENT = 10;

export function formatArs(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function basePrice(pricing: SitePricing) {
  if (pricing.offerEnabled && pricing.offerAmount > 0) {
    return pricing.offerAmount;
  }
  return pricing.amount;
}

export function couponCodeFromEnv() {
  return (process.env.INSCRIPTION_COUPON_CODE ?? "").trim();
}

export function isCouponConfigured() {
  return Boolean(couponCodeFromEnv());
}

export function isValidCoupon(code: string) {
  const expected = couponCodeFromEnv();
  if (!expected) return false;
  return code.trim().toLowerCase() === expected.toLowerCase();
}

export function payableAmount(pricing: SitePricing, couponValid: boolean) {
  const base = basePrice(pricing);
  if (!couponValid) return base;
  return Math.round(base * (1 - COUPON_DISCOUNT_PERCENT / 100));
}
