"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { submitDocumentsStepMutationOptions } from "@/features/forms/services/renewal-requests"

export function useSubmitDocumentsStep() {
  const locale = useLocale()

  return useMutation(submitDocumentsStepMutationOptions(locale))
}
