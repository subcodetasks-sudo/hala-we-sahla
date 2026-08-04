import type { ForgotRequestVerifyOtpData } from "@/features/forms/services/forgot-request"

const PREVIOUS_REQUESTS_SESSION_KEY = "hala-previous-requests-session"
const PREVIOUS_REQUESTS_CHANGE_EVENT = "previous-requests-session-change"

export type PreviousRequestsSession = {
  phone: string
  data: ForgotRequestVerifyOtpData
  fetchedAt: number
}

export function savePreviousRequestsSession(session: PreviousRequestsSession) {
  if (typeof window === "undefined") return

  window.sessionStorage.setItem(
    PREVIOUS_REQUESTS_SESSION_KEY,
    JSON.stringify(session),
  )
  window.dispatchEvent(new Event(PREVIOUS_REQUESTS_CHANGE_EVENT))
}

export function getPreviousRequestsSessionSnapshot() {
  if (typeof window === "undefined") return null
  return window.sessionStorage.getItem(PREVIOUS_REQUESTS_SESSION_KEY)
}

function parsePreviousRequestsSession(
  raw: string | null,
): PreviousRequestsSession | null {
  if (!raw) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return null

    const data = parsed as Partial<PreviousRequestsSession>
    if (
      typeof data.phone !== "string" ||
      !data.phone ||
      !data.data ||
      typeof data.data !== "object" ||
      !Array.isArray(data.data.requests)
    ) {
      return null
    }

    return {
      phone: data.phone,
      data: data.data as ForgotRequestVerifyOtpData,
      fetchedAt:
        typeof data.fetchedAt === "number" ? data.fetchedAt : Date.now(),
    }
  } catch {
    return null
  }
}

export function readPreviousRequestsSession(): PreviousRequestsSession | null {
  return parsePreviousRequestsSession(getPreviousRequestsSessionSnapshot())
}

export function parsePreviousRequestsSessionJson(
  raw: string | null,
): PreviousRequestsSession | null {
  return parsePreviousRequestsSession(raw)
}

export function clearPreviousRequestsSession() {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(PREVIOUS_REQUESTS_SESSION_KEY)
  window.dispatchEvent(new Event(PREVIOUS_REQUESTS_CHANGE_EVENT))
}

export function subscribePreviousRequestsSession(onStoreChange: () => void) {
  window.addEventListener(PREVIOUS_REQUESTS_CHANGE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener(PREVIOUS_REQUESTS_CHANGE_EVENT, onStoreChange)
  }
}

export function isPreviousRequestCompleted(status: string) {
  return status === "completed" || status === "done"
}

export function isPreviousRequestCancelled(status: string) {
  return (
    status === "cancelled" ||
    status === "canceled" ||
    status.includes("refund")
  )
}

export function filterForgotRequests(
  requests: ForgotRequestVerifyOtpData["requests"],
  filter: string,
  query: string,
) {
  const normalized = query.trim().toLowerCase()

  return requests.filter((request) => {
    const matchesFilter =
      filter === "all" || !filter
        ? true
        : filter === "ongoing"
          ? !isPreviousRequestCompleted(request.status) &&
            !isPreviousRequestCancelled(request.status)
          : filter === "completed"
            ? isPreviousRequestCompleted(request.status)
            : filter === "cancelled"
              ? isPreviousRequestCancelled(request.status)
              : request.status === filter

    if (!matchesFilter) return false
    if (!normalized) return true

    return (
      request.request_number.toLowerCase().includes(normalized) ||
      request.worker_name.toLowerCase().includes(normalized) ||
      request.description.toLowerCase().includes(normalized)
    )
  })
}
