import type { TrackOrderDeliveryMethod } from "@/features/forms/hooks/use-track-order-payment"

const PAYMENT_SESSION_KEY = "hala-payment-session"
const PAYMENT_SESSION_EVENT = "hala-payment-session-change"

export type PaymentSession = {
  invoiceId: string
  requestNumber: string
  phone: string
  deliveryMethod: TrackOrderDeliveryMethod
  provider: string
  checkoutUrl?: string
  createdAt: number
}

function sessionKeyForRequest(requestNumber: string) {
  return `${PAYMENT_SESSION_KEY}:${requestNumber}`
}

export function savePaymentSession(session: PaymentSession) {
  if (typeof window === "undefined") return
  const raw = JSON.stringify(session)
  // localStorage survives the Moyasar redirect better than sessionStorage
  window.localStorage.setItem(PAYMENT_SESSION_KEY, raw)
  window.localStorage.setItem(sessionKeyForRequest(session.requestNumber), raw)
  window.dispatchEvent(new Event(PAYMENT_SESSION_EVENT))
}

export function readPaymentSession(
  requestNumber?: string | null,
): PaymentSession | null {
  if (typeof window === "undefined") return null

  try {
    const raw = requestNumber
      ? window.localStorage.getItem(sessionKeyForRequest(requestNumber)) ||
        window.localStorage.getItem(PAYMENT_SESSION_KEY)
      : window.localStorage.getItem(PAYMENT_SESSION_KEY)

    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return null

    const data = parsed as Partial<PaymentSession>
    if (
      typeof data.invoiceId !== "string" ||
      typeof data.requestNumber !== "string" ||
      typeof data.phone !== "string" ||
      (data.deliveryMethod !== "electronic" &&
        data.deliveryMethod !== "paper") ||
      typeof data.provider !== "string"
    ) {
      return null
    }

    return {
      invoiceId: data.invoiceId,
      requestNumber: data.requestNumber,
      phone: data.phone,
      deliveryMethod: data.deliveryMethod,
      provider: data.provider,
      checkoutUrl:
        typeof data.checkoutUrl === "string" ? data.checkoutUrl : undefined,
      createdAt:
        typeof data.createdAt === "number" ? data.createdAt : Date.now(),
    }
  } catch {
    return null
  }
}

export function clearPaymentSession(requestNumber?: string) {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(PAYMENT_SESSION_KEY)
  if (requestNumber) {
    window.localStorage.removeItem(sessionKeyForRequest(requestNumber))
  }
  window.dispatchEvent(new Event(PAYMENT_SESSION_EVENT))
}

export function subscribePaymentSession(onStoreChange: () => void) {
  window.addEventListener(PAYMENT_SESSION_EVENT, onStoreChange)
  window.addEventListener("storage", onStoreChange)
  return () => {
    window.removeEventListener(PAYMENT_SESSION_EVENT, onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}
