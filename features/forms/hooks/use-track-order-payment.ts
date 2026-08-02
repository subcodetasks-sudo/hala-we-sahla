"use client"

import { useEffect, useState } from "react"

const PAYMENT_CHANGE_EVENT = "track-order-payment-change"

export function getTrackOrderPaymentStorageKey(requestNumber: string) {
  return `hala-track-order-paid:${requestNumber}`
}

function readPaidAt(storageKey: string) {
  if (typeof window === "undefined") return null
  const raw = window.sessionStorage.getItem(storageKey)
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return null
  return new Date(parsed)
}

export function useTrackOrderPayment(requestNumber?: string) {
  const storageKey = requestNumber
    ? getTrackOrderPaymentStorageKey(requestNumber)
    : null
  const [paidAt, setPaidAt] = useState<Date | null>(null)

  useEffect(() => {
    if (!storageKey) {
      setPaidAt(null)
      return
    }

    setPaidAt(readPaidAt(storageKey))

    const sync = () => setPaidAt(readPaidAt(storageKey))
    window.addEventListener(PAYMENT_CHANGE_EVENT, sync)
    return () => window.removeEventListener(PAYMENT_CHANGE_EVENT, sync)
  }, [storageKey])

  function markPaid() {
    if (!storageKey) return

    const at = Date.now()
    window.sessionStorage.setItem(storageKey, String(at))
    setPaidAt(new Date(at))
    window.dispatchEvent(new Event(PAYMENT_CHANGE_EVENT))
  }

  return {
    isPaid: paidAt != null,
    paidAt,
    markPaid,
  }
}
