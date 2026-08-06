"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { formsKeys } from "@/features/forms/query-keys"
import {
  initiatePayment,
  type InitiatePaymentPayload,
} from "@/features/forms/services/payment"

export function useInitiatePayment() {
  const locale = useLocale()

  return useMutation({
    mutationKey: formsKeys.initiatePayment(),
    mutationFn: (payload: InitiatePaymentPayload) =>
      initiatePayment(locale, payload),
  })
}
