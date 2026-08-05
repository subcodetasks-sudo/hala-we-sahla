"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { submitSignaturesStepMutationOptions } from "@/features/forms/services/renewal-requests"

export function useSubmitSignaturesStep() {
  const locale = useLocale()

  return useMutation(submitSignaturesStepMutationOptions(locale))
}
