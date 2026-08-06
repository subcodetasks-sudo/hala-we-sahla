"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import PaymentResultView from "@/features/forms/components/payment-result-view"
import { readPaymentSession } from "@/features/forms/lib/payment-session"
import { PAYMENT_PROVIDER } from "@/features/forms/services/payment"
import { useRouter } from "@/i18n/navigation"

type PaymentStatusResolverProps = {
  invoiceId?: string | null
  requestNumber?: string | null
  provider?: string | null
}

/**
 * Resolves invoice id from query or local payment session, then replaces to
 * `/payment/status/[invoiceId]` so GET /payment/status/{id}?provider=moyasar runs.
 */
export default function PaymentStatusResolver({
  invoiceId: invoiceIdProp,
  requestNumber: requestNumberProp,
  provider: providerProp,
}: PaymentStatusResolverProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment.result")
  const router = useRouter()
  const [missingInvoice, setMissingInvoice] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestNumber =
      requestNumberProp ||
      params.get("request_number") ||
      params.get("requestNumber")
    const session = readPaymentSession(requestNumber)
    const invoiceId =
      invoiceIdProp ||
      params.get("invoice_id") ||
      params.get("id") ||
      session?.invoiceId ||
      null

    if (!invoiceId) {
      setMissingInvoice(true)
      return
    }

    const provider =
      providerProp ||
      params.get("provider") ||
      session?.provider ||
      PAYMENT_PROVIDER
    const resolvedRequest =
      requestNumber || session?.requestNumber || undefined

    const query = new URLSearchParams({ provider })
    if (resolvedRequest) query.set("request_number", resolvedRequest)

    router.replace(
      `/payment/status/${encodeURIComponent(invoiceId)}?${query.toString()}`,
    )
  }, [invoiceIdProp, providerProp, requestNumberProp, router])

  if (missingInvoice) {
    return (
      <PaymentResultView
        mode="status"
        invoiceId={null}
        requestNumber={requestNumberProp}
        provider={providerProp || PAYMENT_PROVIDER}
      />
    )
  }

  return (
    <p className="py-20 text-center text-sm text-muted-foreground">
      {t("redirecting")}
    </p>
  )
}
