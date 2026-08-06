import { resolveRenewalPlanPrice, type PlanApiItem } from "@/features/landing/services/plans"
import type { SettingsApiData } from "@/features/landing/services/settings"

export const DEFAULT_TAX_PERCENT = 15
export const DEFAULT_RENEWAL_PLAN_PRICE = 500

export type OrderTotals = {
  serviceFee: number
  vatAmount: number
  total: number
  taxPercent: number
}

export function resolveTaxPercent(
  settings: Pick<SettingsApiData, "tax_amount"> | undefined,
  fallbackPercent = DEFAULT_TAX_PERCENT,
) {
  const taxPercent = Number(settings?.tax_amount)

  return taxPercent > 0 ? taxPercent : fallbackPercent
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100
}

export function calculateOrderTotals(
  serviceFee: number,
  taxPercent: number,
): OrderTotals {
  const normalizedFee = roundMoney(serviceFee)
  const vatAmount = roundMoney((normalizedFee * taxPercent) / 100)
  const total = roundMoney(normalizedFee + vatAmount)

  return {
    serviceFee: normalizedFee,
    vatAmount,
    total,
    taxPercent,
  }
}

export function calculateRenewalOrderTotals(
  plans: PlanApiItem[] | undefined,
  settings: Pick<SettingsApiData, "tax_amount"> | undefined,
  options?: {
    fallbackPlanPrice?: number
    fallbackTaxPercent?: number
  },
): OrderTotals {
  const serviceFee = resolveRenewalPlanPrice(
    plans,
    options?.fallbackPlanPrice ?? DEFAULT_RENEWAL_PLAN_PRICE,
  )
  const taxPercent = resolveTaxPercent(
    settings,
    options?.fallbackTaxPercent ?? DEFAULT_TAX_PERCENT,
  )

  return calculateOrderTotals(serviceFee, taxPercent)
}

export type PaymentTotals = OrderTotals

export function calculatePaymentTotals(
  orderTotals: OrderTotals,
  _deliveryMethod?: "electronic" | "paper",
): PaymentTotals {
  return orderTotals
}
