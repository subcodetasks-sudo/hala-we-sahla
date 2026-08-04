import { queryOptions } from "@tanstack/react-query"

import { formsKeys } from "@/features/forms/query-keys"
import {
  toTrackOrderApiPhone,
  type TrackOrderData,
  type TrackOrderTimelineStage,
} from "@/features/forms/services/track-order"
import { api } from "@/lib/api"

export type CancelStatusItem = {
  id: number
  text_ar: string
  text_en: string
  text: string
}

type CancelStatusApiResponse = {
  success: boolean
  message: string
  data: CancelStatusItem[]
}

export type CancelRequestPayload = {
  request_number: string
  phone: string
  cancel_status_id: number
  cancellation_notes?: string
}

export type CancelRequestData = TrackOrderData & {
  cancelled_at?: string | null
  stage_badge_label?: string | null
}

type CancelRequestApiResponse = {
  success: boolean
  message: string
  data: CancelRequestData & {
    timeline?: TrackOrderTimelineStage[]
  }
}

export type CancelRequestResult = {
  success: boolean
  message: string
  data: CancelRequestData
}

export function isOtherCancelStatus(item: CancelStatusItem) {
  const texts = [item.text, item.text_ar, item.text_en]
    .filter(Boolean)
    .map((value) => value.trim().toLowerCase())

  return texts.some(
    (value) =>
      value.includes("سبب آخر") ||
      value.includes("another reason") ||
      value.includes("anthor reason") ||
      value === "other" ||
      value === "أخرى",
  )
}

/** Keep API order, but always put "other reason" last. */
export function sortCancelStatuses(items: CancelStatusItem[]) {
  const others: CancelStatusItem[] = []
  const rest: CancelStatusItem[] = []

  for (const item of items) {
    if (isOtherCancelStatus(item)) {
      others.push(item)
    } else {
      rest.push(item)
    }
  }

  return [...rest, ...others]
}

export function getCancelStatusLabel(item: CancelStatusItem, locale: string) {
  if (locale === "en") return item.text_en || item.text || item.text_ar
  return item.text_ar || item.text || item.text_en
}

export async function fetchCancelStatuses(
  locale: string,
): Promise<CancelStatusItem[]> {
  const response = await api.get<CancelStatusApiResponse>(
    "/website/cancel-statuses",
    {
      language: locale,
    },
  )

  return sortCancelStatuses(response.data ?? [])
}

export function cancelStatusQueryOptions(locale: string) {
  return queryOptions({
    queryKey: formsKeys.cancelStatusesList(locale),
    queryFn: () => fetchCancelStatuses(locale),
    staleTime: 1000 * 60 * 30,
  })
}

function toTrackOrderDataFromCancel(
  data: CancelRequestApiResponse["data"],
): CancelRequestData {
  const timeline = Array.isArray(data.timeline) ? data.timeline : []

  return {
    ...data,
    id: data.id,
    request_number: data.request_number,
    phone: data.phone,
    employer_name: data.employer_name,
    worker_name: data.worker_name,
    status: data.status || "cancelled",
    status_label: data.status_label || "",
    timeline_title: data.timeline_title || "",
    timeline,
    current_stage:
      data.current_stage ??
      timeline.find((stage) => stage.state === "current") ??
      null,
    previous_stages: data.previous_stages ?? [],
    upcoming_stages: data.upcoming_stages ?? [],
    submitted_at: data.submitted_at ?? null,
    cancelled_at: data.cancelled_at ?? null,
  }
}

export async function cancelTrackOrderRequest(
  locale: string,
  payload: CancelRequestPayload,
): Promise<CancelRequestResult> {
  const response = await api.post<CancelRequestApiResponse>(
    "/website/renewal-requests/track/cancel",
    {
      language: locale,
      body: {
        request_number: payload.request_number.trim(),
        phone: toTrackOrderApiPhone(payload.phone),
        cancel_status_id: payload.cancel_status_id,
        cancellation_notes: payload.cancellation_notes || undefined,
      },
    },
  )

  return {
    success: response.success,
    message: response.message,
    data: toTrackOrderDataFromCancel(response.data),
  }
}
