"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

import { useRegisterFormsBackHandler } from "@/features/forms/components/forms-back-provider"
import OrderSummaryCard from "@/features/forms/components/order-summary-card"
import PaymentCheckoutSummary from "@/features/forms/components/payment-checkout-summary"
import PaymentDeliveryForm from "@/features/forms/components/payment-delivery-form"
import PaymentDeliveryUnavailable from "@/features/forms/components/payment-delivery-unavailable"
import { usePaymentTotals } from "@/features/forms/hooks/use-order-pricing"
import { useTrackOrderPayment } from "@/features/forms/hooks/use-track-order-payment"
import { useRouter } from "@/i18n/navigation"

type DeliveryMethod = "electronic" | "paper"
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
  const router = useRouter()
  const { markPaid } = useTrackOrderPayment(requestNumber)
  const [step, setStep] = useState<PaymentStep>("delivery")
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("electronic")

  const deliveryUnavailable = STATIC_DELIVERY_UNAVAILABLE
  const totals = usePaymentTotals(
    deliveryUnavailable ? "electronic" : deliveryMethod,
  )

  useRegisterFormsBackHandler(() => {
    if (deliveryUnavailable || step !== "checkout") return false
    setStep("delivery")
    return true
  })

  function handleDeliveryNext(method: DeliveryMethod) {
    setDeliveryMethod(method)
    setStep("checkout")
  }

  function handlePay(method: DeliveryMethod = deliveryMethod) {
    markPaid(method)
    toast.success(t("success"))
    router.push(`/track-orders/${encodeURIComponent(requestNumber)}`)
  }

  if (deliveryUnavailable) {
    return (
      <PaymentDeliveryUnavailable
        requestNumber={requestNumber}
        onPay={() => handlePay("electronic")}
      />
    )
  }

  if (step === "checkout") {
    return (
      <PaymentCheckoutSummary
        requestNumber={requestNumber}
        deliveryMethod={deliveryMethod}
        onPay={() => handlePay()}
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_370px]">
      <PaymentDeliveryForm
        deliveryMethod={deliveryMethod}
        onDeliveryMethodChange={setDeliveryMethod}
        onNext={handleDeliveryNext}
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
