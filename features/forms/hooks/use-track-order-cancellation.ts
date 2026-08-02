"use client"

import { useEffect, useState } from "react"

const CANCELLATION_CHANGE_EVENT = "track-order-cancellation-change"

export function getTrackOrderCancellationStorageKey(requestNumber: string) {
  return `hala-track-order-cancelled:${requestNumber}`
}

function readCancelledAt(storageKey: string) {
  if (typeof window === "undefined") return null
  const raw = window.sessionStorage.getItem(storageKey)
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return null
  return new Date(parsed)
}

export function useTrackOrderCancellation(requestNumber?: string) {
  const storageKey = requestNumber
    ? getTrackOrderCancellationStorageKey(requestNumber)
    : null
  const [cancelledAt, setCancelledAt] = useState<Date | null>(null)

  useEffect(() => {
    if (!storageKey) {
      setCancelledAt(null)
      return
    }

    setCancelledAt(readCancelledAt(storageKey))

    const sync = () => setCancelledAt(readCancelledAt(storageKey))
    window.addEventListener(CANCELLATION_CHANGE_EVENT, sync)
    return () => window.removeEventListener(CANCELLATION_CHANGE_EVENT, sync)
  }, [storageKey])

  function cancelRequest() {
    if (!storageKey) return

    const at = Date.now()
    window.sessionStorage.setItem(storageKey, String(at))
    setCancelledAt(new Date(at))
    window.dispatchEvent(new Event(CANCELLATION_CHANGE_EVENT))
  }

  return {
    isCancelled: cancelledAt != null,
    cancelledAt,
    cancelRequest,
  }
}
