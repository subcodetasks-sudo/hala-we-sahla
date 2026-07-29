"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { submitEmployerStepMutationOptions } from "@/features/forms/services/renewal-requests"

export function useSubmitEmployerStep() {
  const locale = useLocale()

  return useMutation(submitEmployerStepMutationOptions(locale))
}
