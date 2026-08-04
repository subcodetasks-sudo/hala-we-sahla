"use client"

import { useCallback, useSyncExternalStore } from "react"

const CANCELLATION_CHANGE_EVENT = "track-order-cancellation-change"

export function getTrackOrderCancellationStorageKey(requestNumber: string) {
  return `hala-track-order-cancelled:${requestNumber}`
}

function readCancelledAtMs(storageKey: string | null): number | null {
  if (!storageKey || typeof window === "undefined") return null
  const raw = window.sessionStorage.getItem(storageKey)
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return null
  return parsed
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CANCELLATION_CHANGE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener(CANCELLATION_CHANGE_EVENT, onStoreChange)
  }
}

export function useTrackOrderCancellation(requestNumber?: string) {
  const storageKey = requestNumber
    ? getTrackOrderCancellationStorageKey(requestNumber)
    : null

  const cancelledAtMs = useSyncExternalStore(
    subscribe,
    () => readCancelledAtMs(storageKey),
    () => null,
  )

  const cancelRequest = useCallback((cancelledAt?: Date | number | string) => {
    if (!storageKey) return

    const timestamp =
      cancelledAt instanceof Date
        ? cancelledAt.getTime()
        : typeof cancelledAt === "number"
          ? cancelledAt
          : typeof cancelledAt === "string"
            ? Date.parse(cancelledAt.includes("T") ? cancelledAt : cancelledAt.replace(" ", "T"))
            : Date.now()

    window.sessionStorage.setItem(
      storageKey,
      String(Number.isFinite(timestamp) ? timestamp : Date.now()),
    )
    window.dispatchEvent(new Event(CANCELLATION_CHANGE_EVENT))
  }, [storageKey])

  return {
    isCancelled: cancelledAtMs != null,
    cancelledAt: cancelledAtMs != null ? new Date(cancelledAtMs) : null,
    cancelRequest,
  }
}
