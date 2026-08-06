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
  callback_url?: string
  metadata?: {
    phone?: string
    request_number?: string
    total?: number
    service_fee?: number
    tax_fee?: number
    delivery_fee?: number
    plan_id?: number
    renewal_request_id?: number
  }
}

export type PaymentRenewalRequestSummary = {
  id?: number
  request_number?: string
  status?: string
  status_label?: string
  phone?: string
  final_contract_url?: string | null
  invoice_url?: string | null
  paid_at?: string | null
  actions?: {
    can_download_contract?: boolean
    can_download_invoice?: boolean
    can_pay?: boolean
  }
}

export type PaymentStatusResult = {
  payment: PaymentStatusData
  renewalRequest?: PaymentRenewalRequestSummary | null
}

type PaymentStatusApiEnvelope = {
  success: boolean
  message: string
  data:
    | PaymentStatusData
    | {
        payment: PaymentStatusData
        renewal_request?: PaymentRenewalRequestSummary | null
      }
}

export type PaymentOutcome = "paid" | "failed" | "pending"

export function resolvePaymentOutcome(
  status: string | null | undefined,
): PaymentOutcome {
  if (!status || typeof status !== "string") return "pending"

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

function isNestedPaymentStatusPayload(
  data: PaymentStatusApiEnvelope["data"],
): data is {
  payment: PaymentStatusData
  renewal_request?: PaymentRenewalRequestSummary | null
} {
  return Boolean(
    data &&
      typeof data === "object" &&
      "payment" in data &&
      data.payment &&
      typeof data.payment === "object",
  )
}

/** Supports both flat `data` and nested `data.payment` API shapes. */
export function normalizePaymentStatusResponse(
  envelope: PaymentStatusApiEnvelope,
): {
  success: boolean
  message: string
  data: PaymentStatusResult
} {
  const nested = isNestedPaymentStatusPayload(envelope.data)
  const payment = nested ? envelope.data.payment : envelope.data
  const renewalRequest = nested ? envelope.data.renewal_request : null

  const requestNumber =
    payment.metadata?.request_number || renewalRequest?.request_number

  return {
    success: envelope.success,
    message: envelope.message,
    data: {
      payment: {
        ...payment,
        metadata: {
          ...payment.metadata,
          ...(requestNumber ? { request_number: requestNumber } : null),
          ...(renewalRequest?.phone && !payment.metadata?.phone
            ? { phone: renewalRequest.phone }
            : null),
        },
      },
      renewalRequest: renewalRequest ?? null,
    },
  }
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

  const success_url = `${root}${localePrefix}/payment/success${suffix}`
  const back_url = `${root}${localePrefix}/payment/back${suffix}`

  return {
    success_url,
    back_url,
    callback_url: success_url,
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
): Promise<{
  success: boolean
  message: string
  data: PaymentStatusResult
}> {
  const response = await api.get<PaymentStatusApiEnvelope>(
    `/payment/status/${encodeURIComponent(invoiceId)}`,
    {
      language: locale,
      query: { provider },
    },
  )

  return normalizePaymentStatusResponse(response)
}
