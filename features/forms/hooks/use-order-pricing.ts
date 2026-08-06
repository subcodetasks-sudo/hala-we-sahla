"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import {
  calculatePaymentTotals,
  calculateRenewalOrderTotals,
  type OrderTotals,
  type PaymentTotals,
} from "@/features/forms/lib/order-pricing"
import { plansQueryOptions } from "@/features/landing/services/plans"
import { settingsQueryOptions } from "@/features/landing/services/settings"

export function useRenewalOrderTotals(): OrderTotals {
  const locale = useLocale()
  const plansQuery = useQuery(plansQueryOptions(locale))
  const settingsQuery = useQuery(settingsQueryOptions(locale))

  return useMemo(
    () => calculateRenewalOrderTotals(plansQuery.data, settingsQuery.data),
    [plansQuery.data, settingsQuery.data],
  )
}

export function usePaymentTotals(
  deliveryMethod: "electronic" | "paper",
): PaymentTotals {
  const orderTotals = useRenewalOrderTotals()

  return useMemo(
    () => calculatePaymentTotals(orderTotals, deliveryMethod),
    [deliveryMethod, orderTotals],
  )
}
