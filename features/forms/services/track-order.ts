import { api } from "@/lib/api"

export type TrackOrderStageState =
  | "current"
  | "upcoming"
  | "completed"
  | "cancelled"

export type TrackOrderTimelineStage = {
  type: string
  key: string
  title: string
  description: string
  occurred_at: string | null
  state: TrackOrderStageState | string
  state_label: string
  actions: unknown[]
}

export type TrackOrderData = {
  id: number
  request_number: string
  phone: string
  employer_name: string
  worker_name: string
  status: string
  status_label: string
  current_stage?: TrackOrderTimelineStage | null
  previous_stages?: TrackOrderTimelineStage[]
  upcoming_stages?: TrackOrderTimelineStage[]
  timeline_title: string
  timeline: TrackOrderTimelineStage[]
  submitted_at: string | null
  cancelled_at?: string | null
}

type TrackOrderApiResponse = {
  success: boolean
  message: string
  data: TrackOrderData
}

export type TrackOrderPayload = {
  request_number: string
  phone: string
}

/** Convert local `05XXXXXXXX` input to API E.164 (`+9665XXXXXXXX`). */
export function toTrackOrderApiPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("966")) return `+${digits}`
  if (digits.startsWith("0")) return `+966${digits.slice(1)}`
  return `+966${digits}`
}

export function parseTrackOrderDateTime(value: string | null | undefined) {
  if (!value) return null
  const normalized = value.includes("T") ? value : value.replace(" ", "T")
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

export function isTrackOrderCompleted(data: TrackOrderData) {
  if (data.status === "completed" || data.status === "done") return true

  const completedStage = data.timeline.find((stage) => stage.key === "completed")
  if (!completedStage) return false

  return (
    completedStage.state === "completed" ||
    completedStage.state === "current"
  )
}

export async function trackOrderRequest(
  locale: string,
  payload: TrackOrderPayload,
): Promise<TrackOrderData> {
  const response = await api.post<TrackOrderApiResponse>(
    "/website/forgot-request/track",
    {
      language: locale,
      body: {
        request_number: payload.request_number.trim(),
        phone: toTrackOrderApiPhone(payload.phone),
      },
    },
  )

  return response.data
}
