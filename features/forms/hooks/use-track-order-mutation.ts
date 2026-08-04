"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { formsKeys } from "@/features/forms/query-keys"
import {
  trackOrderRequest,
  type TrackOrderPayload,
} from "@/features/forms/services/track-order"

export function useTrackOrderMutation() {
  const locale = useLocale()

  return useMutation({
    mutationKey: formsKeys.trackOrder(),
    mutationFn: (payload: TrackOrderPayload) =>
      trackOrderRequest(locale, payload),
  })
}
