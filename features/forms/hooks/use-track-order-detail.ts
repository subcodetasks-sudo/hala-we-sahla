"use client"

import { useCallback, useSyncExternalStore } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import {
  readTrackOrderSession,
  saveTrackOrderSession,
  subscribeTrackOrderSession,
} from "@/features/forms/lib/track-order-session"
import { formsKeys } from "@/features/forms/query-keys"
import {
  trackOrderRequest,
  type TrackOrderData,
} from "@/features/forms/services/track-order"

function getSessionSnapshot(requestNumber: string) {
  const session = readTrackOrderSession(requestNumber)
  return session ? JSON.stringify(session) : null
}

export function useTrackOrderDetail(requestNumber: string) {
  const locale = useLocale()
  const sessionJson = useSyncExternalStore(
    subscribeTrackOrderSession,
    () => getSessionSnapshot(requestNumber),
    () => null,
  )

  const session = sessionJson
    ? (JSON.parse(sessionJson) as ReturnType<typeof readTrackOrderSession>)
    : null

  const query = useQuery({
    queryKey: formsKeys.trackOrderDetail(
      requestNumber,
      session?.phone ?? "",
      locale,
    ),
    enabled: Boolean(session?.phone),
    queryFn: async () => {
      if (!session?.phone) {
        throw new Error("Missing track order phone")
      }

      const data = await trackOrderRequest(locale, {
        request_number: requestNumber,
        phone: session.phone,
      })

      saveTrackOrderSession({
        request_number: requestNumber,
        phone: session.phone,
        data,
        fetchedAt: Date.now(),
      })

      return data
    },
    initialData: session?.data,
    staleTime: 30_000,
  })

  const refresh = useCallback(async () => {
    await query.refetch()
  }, [query])

  return {
    data: (query.data ?? session?.data ?? null) as TrackOrderData | null,
    phone: session?.phone ?? null,
    hasSession: session != null,
    isLoading: query.isLoading && !session?.data,
    isFetching: query.isFetching,
    isError: query.isError && !session?.data,
    error: query.error,
    refresh,
  }
}
