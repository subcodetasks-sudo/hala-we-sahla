"use client"

import { useEffect, useState } from "react"

const PAYMENT_CHANGE_EVENT = "track-order-payment-change"

export type TrackOrderDeliveryMethod = "electronic" | "paper"

export function getTrackOrderPaymentStorageKey(requestNumber: string) {
  return `hala-track-order-paid:${requestNumber}`
}

export function getTrackOrderDeliveryStorageKey(requestNumber: string) {
  return `hala-track-order-delivery:${requestNumber}`
}

function readPaidAt(storageKey: string) {
  if (typeof window === "undefined") return null
  const raw = window.sessionStorage.getItem(storageKey)
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return null
  return new Date(parsed)
}

function readDeliveryMethod(
  requestNumber: string,
): TrackOrderDeliveryMethod | null {
  if (typeof window === "undefined") return null
  const raw = window.sessionStorage.getItem(
    getTrackOrderDeliveryStorageKey(requestNumber),
  )
  if (raw === "electronic" || raw === "paper") return raw
  return null
}

export function useTrackOrderPayment(requestNumber?: string) {
  const storageKey = requestNumber
    ? getTrackOrderPaymentStorageKey(requestNumber)
    : null
  const [paidAt, setPaidAt] = useState<Date | null>(null)
  const [deliveryMethod, setDeliveryMethod] =
    useState<TrackOrderDeliveryMethod | null>(null)

  useEffect(() => {
    if (!storageKey || !requestNumber) {
      setPaidAt(null)
      setDeliveryMethod(null)
      return
    }

    setPaidAt(readPaidAt(storageKey))
    setDeliveryMethod(readDeliveryMethod(requestNumber))

    const sync = () => {
      setPaidAt(readPaidAt(storageKey))
      setDeliveryMethod(readDeliveryMethod(requestNumber))
    }
    window.addEventListener(PAYMENT_CHANGE_EVENT, sync)
    return () => window.removeEventListener(PAYMENT_CHANGE_EVENT, sync)
  }, [storageKey, requestNumber])

  function markPaid(method: TrackOrderDeliveryMethod = "electronic") {
    if (!storageKey || !requestNumber) return

    const at = Date.now()
    window.sessionStorage.setItem(storageKey, String(at))
    window.sessionStorage.setItem(
      getTrackOrderDeliveryStorageKey(requestNumber),
      method,
    )
    setPaidAt(new Date(at))
    setDeliveryMethod(method)
    window.dispatchEvent(new Event(PAYMENT_CHANGE_EVENT))
  }

  return {
    isPaid: paidAt != null,
    paidAt,
    deliveryMethod,
    markPaid,
  }
}
