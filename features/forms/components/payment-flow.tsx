"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"

import { useRegisterFormsBackHandler } from "@/features/forms/components/forms-back-provider"
import OrderSummaryCard from "@/features/forms/components/order-summary-card"
import PaymentCheckoutSummary from "@/features/forms/components/payment-checkout-summary"
import PaymentDeliveryForm, {
  type DeliveryOption,
} from "@/features/forms/components/payment-delivery-form"
import PaymentDeliveryUnavailable from "@/features/forms/components/payment-delivery-unavailable"
import { useInitiatePayment } from "@/features/forms/hooks/use-initiate-payment"
import { usePaymentTotals } from "@/features/forms/hooks/use-order-pricing"
import { useSubmitDeliveryMethod } from "@/features/forms/hooks/use-submit-delivery-method"
import { useTrackOrderDetail } from "@/features/forms/hooks/use-track-order-detail"
import { savePaymentSession } from "@/features/forms/lib/payment-session"
import type { PaymentDeliveryAddressValues } from "@/features/forms/schemas/payment-delivery-address"
import {
  mapAddressToDeliveryPayload,
  mapElectronicDeliveryPayload,
} from "@/features/forms/services/delivery-method"
import {
  buildAppPaymentUrls,
  PAYMENT_CURRENCY,
  PAYMENT_PROVIDER,
} from "@/features/forms/services/payment"
import { useRouter } from "@/i18n/navigation"

type PaymentStep = "delivery" | "checkout"

type PaymentFlowProps = {
  requestNumber: string
}

/**
 * Static until payment/delivery availability comes from the API.
 * `true` → delivery-unavailable screen; `false` → normal delivery + checkout flow.
 */
const STATIC_DELIVERY_UNAVAILABLE = false

export default function PaymentFlow({ requestNumber }: PaymentFlowProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment")
  const locale = useLocale()
  const router = useRouter()
  const { phone, hasSession, data } = useTrackOrderDetail(requestNumber)
  const deliveryMutation = useSubmitDeliveryMethod()
  const paymentMutation = useInitiatePayment()
  const [step, setStep] = useState<PaymentStep>("delivery")
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryOption>("electronic")

  const deliveryUnavailable = STATIC_DELIVERY_UNAVAILABLE
  const totals = usePaymentTotals(
    deliveryUnavailable ? "electronic" : deliveryMethod,
  )

  useRegisterFormsBackHandler(() => {
    if (deliveryUnavailable || step !== "checkout") return false
    setStep("delivery")
    return true
  })

  async function handleDeliveryNext(
    method: DeliveryOption,
    address?: PaymentDeliveryAddressValues,
  ) {
    if (!hasSession || !phone) {
      toast.error(t("sessionMissing"))
      router.push("/track-orders")
      return
    }

    try {
      const payload =
        method === "electronic"
          ? mapElectronicDeliveryPayload(requestNumber, phone)
          : mapAddressToDeliveryPayload(
              requestNumber,
              phone,
              address!,
              t("address.defaultTitle"),
            )

      const result = await deliveryMutation.mutateAsync(payload)

      if (!result.success) {
        toast.error(result.message || t("deliveryError"))
        return
      }

      if (result.message) {
        toast.success(result.message)
      }

      setDeliveryMethod(method)
      setStep("checkout")
    } catch {
      toast.error(t("deliveryError"))
    }
  }

  async function handlePay(method: DeliveryOption = deliveryMethod) {
    if (!hasSession || !phone) {
      toast.error(t("sessionMissing"))
      router.push("/track-orders")
      return
    }

    try {
      const { success_url, back_url, callback_url } = buildAppPaymentUrls(
        window.location.origin,
        locale,
        { requestNumber },
      )

      const customerName =
        data?.employer_name?.trim() || t("checkout.customerNameFallback")
      const customerEmail = `${requestNumber.replace(/\D/g, "") || "customer"}@halawasahla.com`

      const result = await paymentMutation.mutateAsync({
        description: t("checkout.paymentDescription"),
        currency: PAYMENT_CURRENCY,
        provider: PAYMENT_PROVIDER,
        customer_name: customerName,
        customer_email: customerEmail,
        success_url,
        back_url,
        callback_url,
        request_number: requestNumber,
      })

      if (!result.success || !result.data?.url || !result.data?.invoice_id) {
        toast.error(result.message || t("initiateError"))
        return
      }

      savePaymentSession({
        invoiceId: result.data.invoice_id,
        requestNumber,
        phone,
        deliveryMethod: method,
        provider: result.data.provider || PAYMENT_PROVIDER,
        checkoutUrl: result.data.url,
        createdAt: Date.now(),
      })

      window.location.assign(result.data.url)
    } catch {
      toast.error(t("initiateError"))
    }
  }

  if (deliveryUnavailable) {
    return (
      <PaymentDeliveryUnavailable
        requestNumber={requestNumber}
        onPay={() => handlePay("electronic")}
        isPaying={paymentMutation.isPending}
      />
    )
  }

  if (step === "checkout") {
    return (
      <PaymentCheckoutSummary
        requestNumber={requestNumber}
        deliveryMethod={deliveryMethod}
        onPay={() => handlePay()}
        isPaying={paymentMutation.isPending}
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_370px]">
      <PaymentDeliveryForm
        deliveryMethod={deliveryMethod}
        onDeliveryMethodChange={setDeliveryMethod}
        onNext={handleDeliveryNext}
        isSubmitting={deliveryMutation.isPending}
      />
      <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
        <OrderSummaryCard
          serviceFee={totals.serviceFee}
          vatAmount={totals.vatAmount}
          total={totals.total}
          taxPercent={totals.taxPercent}
        />
      </aside>
    </div>
  )
}
