"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

import { useRegisterFormsBackHandler } from "@/features/forms/components/forms-back-provider"
import OrderSummaryCard from "@/features/forms/components/order-summary-card"
import PaymentCheckoutSummary, {
  getPaymentTotals,
  PAYMENT_SERVICE_FEE,
  PAYMENT_VAT_AMOUNT,
} from "@/features/forms/components/payment-checkout-summary"
import PaymentDeliveryForm from "@/features/forms/components/payment-delivery-form"
import { useTrackOrderPayment } from "@/features/forms/hooks/use-track-order-payment"
import { useRouter } from "@/i18n/navigation"

type DeliveryMethod = "electronic" | "paper"
type PaymentStep = "delivery" | "checkout"

type PaymentFlowProps = {
  requestNumber: string
}

export default function PaymentFlow({ requestNumber }: PaymentFlowProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment")
  const router = useRouter()
  const { markPaid } = useTrackOrderPayment(requestNumber)
  const [step, setStep] = useState<PaymentStep>("delivery")
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("electronic")

  const totals = getPaymentTotals(deliveryMethod)

  useRegisterFormsBackHandler(() => {
    if (step !== "checkout") return false
    setStep("delivery")
    return true
  })

  function handleDeliveryNext(method: DeliveryMethod) {
    setDeliveryMethod(method)
    setStep("checkout")
  }

  function handlePay() {
    markPaid(deliveryMethod)
    toast.success(t("success"))
    router.push(`/track-orders/${encodeURIComponent(requestNumber)}`)
  }

  if (step === "checkout") {
    return (
      <PaymentCheckoutSummary
        requestNumber={requestNumber}
        deliveryMethod={deliveryMethod}
        onPay={handlePay}
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
          serviceFee={PAYMENT_SERVICE_FEE}
          vatAmount={Math.round(PAYMENT_VAT_AMOUNT)}
          total={Math.round(totals.total)}
        />
      </aside>
    </div>
  )
}
