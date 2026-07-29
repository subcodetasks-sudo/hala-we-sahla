"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { submitRenewalRequestMutationOptions } from "@/features/forms/services/renewal-requests"

export function useSubmitRenewalRequest() {
  const locale = useLocale()

  return useMutation(submitRenewalRequestMutationOptions(locale))
}
