"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { renewalReviewQueryOptions } from "@/features/forms/services/renewal-review"

export function useRenewalReview(
  requestId: number | null,
  options?: { enabled?: boolean },
) {
  const locale = useLocale()
  const enabled = Boolean(requestId) && (options?.enabled ?? true)

  return useQuery({
    ...renewalReviewQueryOptions(locale, requestId ?? 0),
    enabled,
  })
}
