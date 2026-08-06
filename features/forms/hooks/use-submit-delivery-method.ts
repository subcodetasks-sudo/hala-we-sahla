"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { formsKeys } from "@/features/forms/query-keys"
import {
  submitDeliveryMethod,
  type DeliveryMethodPayload,
} from "@/features/forms/services/delivery-method"

export function useSubmitDeliveryMethod() {
  const locale = useLocale()

  return useMutation({
    mutationKey: formsKeys.deliveryMethod(),
    mutationFn: (payload: DeliveryMethodPayload) =>
      submitDeliveryMethod(locale, payload),
  })
}
