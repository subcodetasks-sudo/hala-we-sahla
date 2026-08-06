import { api } from "@/lib/api"

export const PAYMENT_PROVIDER = "moyasar"
export const PAYMENT_CURRENCY = "SAR"

export type InitiatePaymentPayload = {
  description: string
  currency: string
  provider: string
  customer_name: string
  customer_email: string
  success_url: string
  back_url: string
  callback_url: string
  request_number: string
}

export type PaymentFees = {
  service_fee: number
  delivery_fee: number
  subtotal: number
  tax_amount: number
  tax_fee: number
  total: number
}

export type InitiatePaymentData = {
  invoice_id: string
  url: string
  status: string
  amount: number
  currency: string
  provider: string
  request_number: string
  mobile?: string
  tracking_url?: string
  plan_id?: number
  fees?: PaymentFees
}

type InitiatePaymentApiResponse = {
  success: boolean
  message: string
  data: InitiatePaymentData
}

export type PaymentStatusData = {
  id: string
  status: string
  amount: number
  currency: string
  description?: string
  amount_format?: string
  url?: string
  success_url?: string
  back_url?: string
  metadata?: {
    request_number?: string
    total?: number
    service_fee?: number
    tax_fee?: number
    delivery_fee?: number
  }
}

type PaymentStatusApiResponse = {
  success: boolean
  message: string
  data: PaymentStatusData
}

export type PaymentOutcome = "paid" | "failed" | "pending"

export function resolvePaymentOutcome(status: string): PaymentOutcome {
  const normalized = status.trim().toLowerCase()

  if (
    normalized === "paid" ||
    normalized === "paid_out" ||
    normalized === "captured" ||
    normalized === "completed" ||
    normalized === "success"
  ) {
    return "paid"
  }

  if (
    normalized === "failed" ||
    normalized === "expired" ||
    normalized === "canceled" ||
    normalized === "cancelled" ||
    normalized === "voided"
  ) {
    return "failed"
  }

  return "pending"
}

export function buildPaymentCallbackUrl() {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    process.env.API_URL?.replace(/\/$/, "") ||
    ""

  return `${base}/payment/moyasar/callback`
}

export function buildAppPaymentUrls(
  origin: string,
  locale: string,
  options?: {
    requestNumber?: string
    invoiceId?: string
  },
) {
  const localePrefix = locale === "ar" ? "" : `/${locale}`
  const root = origin.replace(/\/$/, "")
  const params = new URLSearchParams()

  if (options?.requestNumber) {
    params.set("request_number", options.requestNumber)
  }
  if (options?.invoiceId) {
    params.set("invoice_id", options.invoiceId)
  }
  params.set("provider", PAYMENT_PROVIDER)

  const query = params.toString()
  const suffix = query ? `?${query}` : ""

  return {
    success_url: `${root}${localePrefix}/payment/success${suffix}`,
    back_url: `${root}${localePrefix}/payment/failed${suffix}`,
  }
}

export async function initiatePayment(
  locale: string,
  payload: InitiatePaymentPayload,
): Promise<{ success: boolean; message: string; data: InitiatePaymentData }> {
  const response = await api.post<InitiatePaymentApiResponse>(
    "/payment/initiate",
    {
      language: locale,
      body: payload,
    },
  )

  return {
    success: response.success,
    message: response.message,
    data: response.data,
  }
}

export async function fetchPaymentStatus(
  locale: string,
  invoiceId: string,
  provider = PAYMENT_PROVIDER,
): Promise<{ success: boolean; message: string; data: PaymentStatusData }> {
  const response = await api.get<PaymentStatusApiResponse>(
    `/payment/status/${encodeURIComponent(invoiceId)}`,
    {
      language: locale,
      query: { provider },
    },
  )

  return {
    success: response.success,
    message: response.message,
    data: response.data,
  }
}
