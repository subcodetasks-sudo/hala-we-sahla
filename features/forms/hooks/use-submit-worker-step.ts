"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { submitWorkerStepMutationOptions } from "@/features/forms/services/renewal-requests"

export function useSubmitWorkerStep() {
  const locale = useLocale()

  return useMutation(submitWorkerStepMutationOptions(locale))
}
