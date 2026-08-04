import type { TrackOrderData } from "@/features/forms/services/track-order"

const TRACK_ORDER_RESULT_EVENT = "track-order-result-change"

export type TrackOrderSession = {
  request_number: string
  phone: string
  data: TrackOrderData
  fetchedAt: number
}

export function getTrackOrderResultStorageKey(requestNumber: string) {
  return `hala-track-order-result:${requestNumber}`
}

export function saveTrackOrderSession(session: TrackOrderSession) {
  if (typeof window === "undefined") return

  window.sessionStorage.setItem(
    getTrackOrderResultStorageKey(session.request_number),
    JSON.stringify(session),
  )
  window.dispatchEvent(new Event(TRACK_ORDER_RESULT_EVENT))
}

export function readTrackOrderSession(
  requestNumber: string,
): TrackOrderSession | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.sessionStorage.getItem(
      getTrackOrderResultStorageKey(requestNumber),
    )
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return null

    const data = parsed as Partial<TrackOrderSession>
    if (
      typeof data.request_number !== "string" ||
      typeof data.phone !== "string" ||
      !data.data ||
      typeof data.data !== "object"
    ) {
      return null
    }

    return {
      request_number: data.request_number,
      phone: data.phone,
      data: data.data as TrackOrderData,
      fetchedAt:
        typeof data.fetchedAt === "number" ? data.fetchedAt : Date.now(),
    }
  } catch {
    return null
  }
}

export function subscribeTrackOrderSession(onStoreChange: () => void) {
  window.addEventListener(TRACK_ORDER_RESULT_EVENT, onStoreChange)
  return () => {
    window.removeEventListener(TRACK_ORDER_RESULT_EVENT, onStoreChange)
  }
}
