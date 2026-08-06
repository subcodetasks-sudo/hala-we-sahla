import { api } from "@/lib/api"

export type TrackOrderStageState =
  | "current"
  | "upcoming"
  | "completed"
  | "cancelled"

export type TrackOrderTimelineAction = {
  type: string
  label: string
  url?: string | null
}

export type TrackOrderTimelineStage = {
  type: string
  key: string
  title: string
  description: string
  occurred_at: string | null
  state: TrackOrderStageState | string
  state_label: string
  actions: TrackOrderTimelineAction[]
}

export type TrackOrderDeliveryDetails = {
  method?: string | null
  method_label?: string | null
  delivery_method?: string | null
  address_title?: string | null
  address_info?: string | null
  national_address?: string | null
  building_number?: string | null
  floor_number?: string | null
  address_description?: string | null
  recipient_name?: string | null
  recipient_phone?: string | null
  contact_name?: string | null
  contact_phone?: string | null
  address?: string | null
  notes?: string | null
}

export type TrackOrderActions = {
  can_cancel?: boolean
  can_request_refund?: boolean
  can_pay?: boolean
  can_download_contract?: boolean
  can_download_invoice?: boolean
}

export type TrackOrderData = {
  id: number
  request_number: string
  phone: string
  title?: string
  service_type_label?: string
  employer_name: string
  worker_name: string
  status: string
  status_label: string
  stage_badge_label?: string | null
  delivery_required?: boolean
  delivery_status_label?: string | null
  delivery_method?: string | null
  delivery_method_label?: string | null
  delivery?: TrackOrderDeliveryDetails | null
  delivery_details?: TrackOrderDeliveryDetails | null
  actions?: TrackOrderActions | null
  payment_summary?: {
    service_label?: string
    total?: number
    currency?: string
    currency_label?: string
  } | null
  payment_page?: {
    enabled?: boolean
    title?: string
    description?: string
    submit_label?: string
  } | null
  final_contract_url?: string | null
  invoice_url?: string | null
  tracking_number?: string | null
  paid_at?: string | null
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

function normalizeDeliveryMethod(value?: string | null) {
  return (value || "").trim().toLowerCase()
}

/** Paper/home delivery vs electronic pickup from track API. */
export function isTrackOrderPaperDelivery(data: TrackOrderData) {
  const method = normalizeDeliveryMethod(
    data.delivery?.method ||
      data.delivery_details?.method ||
      data.delivery_method,
  )
  const apiValue = normalizeDeliveryMethod(
    data.delivery?.delivery_method ||
      data.delivery_details?.delivery_method ||
      data.delivery_method,
  )

  return (
    method === "delivery_to_address" ||
    method === "delivery" ||
    apiValue === "delivery"
  )
}

export function getTrackOrderContractUrl(data: TrackOrderData) {
  if (data.final_contract_url) return data.final_contract_url

  const completed = data.timeline.find((stage) => stage.key === "completed")
  const action = completed?.actions?.find(
    (item) => item.type === "download_contract" && item.url,
  )
  return action?.url || null
}

export function getTrackOrderInvoiceUrl(data: TrackOrderData) {
  if (data.invoice_url) return data.invoice_url

  const completed = data.timeline.find((stage) => stage.key === "completed")
  const action = completed?.actions?.find(
    (item) => item.type === "download_invoice" && item.url,
  )
  return action?.url || null
}

export function getTrackOrderServiceLabel(data: TrackOrderData) {
  return (
    data.payment_summary?.service_label ||
    data.title ||
    data.service_type_label ||
    null
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
