"use client"

import { ArrowUpLeft, Clock3, Info, Lock, SaudiRiyal } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import CopyButton from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PaymentDeliveryUnavailableNotice from "@/features/forms/components/payment-delivery-unavailable-notice"
import { usePaymentTotals } from "@/features/forms/hooks/use-order-pricing"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

type PaymentDeliveryUnavailableProps = {
  requestNumber: string
  onPay: () => void
  className?: string
}

export default function PaymentDeliveryUnavailable({
  requestNumber,
  onPay,
  className,
}: PaymentDeliveryUnavailableProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment.deliveryUnavailable")
  const tCheckout = useTranslations("Forms.trackOrders.detail.payment.checkout")
  const locale = useLocale()
  const totals = usePaymentTotals("electronic")

  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] bg-linear-to-b from-primary to-transparent p-px sm:rounded-[32px]">
      <Card
        className={cn(
          "gap-0 rounded-[28px] border-none bg-white px-5 py-8 shadow-none ring-0 sm:rounded-[32px] sm:px-8 sm:py-10",
          className,
        )}
      >
        <PaymentDeliveryUnavailableNotice />

        <div className="mt-6 space-y-4 text-start">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#8a9aa3]">
              {tCheckout("requestNumber")}
            </span>
            <CopyButton
              value={requestNumber}
              label={tCheckout("copyNumber")}
              className="flex items-center gap-1.5 text-sm font-semibold text-black"
            >
              <span dir="ltr" className="font-clash tracking-wide">
                {requestNumber}
              </span>
              <CustomIcon
                src="/icons/copy.svg"
                size={14}
                className="size-3.5 text-black"
              />
            </CopyButton>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#8a9aa3]">{tCheckout("service")}</span>
            <span className="text-sm font-bold text-black">
              {tCheckout("serviceValue")}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#8a9aa3]">
              {tCheckout("deliveryMethod")}
            </span>
            <span className="text-sm font-bold text-black">{t("toMethod")}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#8a9aa3]">{tCheckout("status")}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe5e8] bg-[#eef7f9] px-3 py-1.5 text-xs font-semibold text-primary">
              <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
              {tCheckout("statusValue")}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-3 border-t border-[#e8eef0] pt-4 text-start">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#6b7c85]">
              {tCheckout("serviceFee")}
            </span>
            <span className="flex items-center gap-1 font-clash text-base font-medium text-[#3d4f57]">
              {formatNumber(totals.serviceFee, locale)}
              <SaudiRiyal className="size-3.5 text-[#6b7c85]" aria-hidden />
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#6b7c85]">
              {tCheckout("vat", { percent: totals.taxPercent })}
            </span>
            <span className="flex items-center gap-1 font-clash text-base font-medium text-[#3d4f57]">
              {formatNumber(totals.vatAmount, locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <SaudiRiyal className="size-3.5 text-[#6b7c85]" aria-hidden />
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-dashed border-[#d7e0e3] pt-3">
            <span className="text-sm font-bold text-primary">
              {tCheckout("total")}
            </span>
            <span className="flex items-center gap-1 font-clash text-xl font-bold text-primary">
              {formatNumber(totals.total, locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <SaudiRiyal className="size-5" aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#eef7f9] p-3 text-start">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <p className="text-sm leading-6 text-[#3d5a66]">{t("branchInfo")}</p>
        </div>

        <Button
          type="button"
          onClick={onPay}
          className="mt-6 h-12 w-full gap-2 rounded-full text-sm font-semibold sm:text-base"
        >
          {tCheckout("pay")}
          <ArrowUpLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
        </Button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden="true" />
          {tCheckout("secure")}
        </p>
      </Card>
    </div>
  )
}
