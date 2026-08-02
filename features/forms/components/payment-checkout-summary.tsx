"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowUpLeft,
  CircleAlert,
  Eye,
  Info,
  Lock,
  SaudiRiyal,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"
import { div } from "motion/react-client";

export const PAYMENT_SERVICE_FEE = 199
export const PAYMENT_VAT_AMOUNT = 29.85
export const PAYMENT_DELIVERY_FEE = 15.99

type DeliveryMethod = "electronic" | "paper"

type PaymentCheckoutSummaryProps = {
  requestNumber: string
  deliveryMethod: DeliveryMethod
  onPay: () => void
  className?: string
}

export function getPaymentTotals(deliveryMethod: DeliveryMethod) {
  const deliveryFee =
    deliveryMethod === "paper" ? PAYMENT_DELIVERY_FEE : 0
  const total = PAYMENT_SERVICE_FEE + PAYMENT_VAT_AMOUNT + deliveryFee

  return {
    serviceFee: PAYMENT_SERVICE_FEE,
    vatAmount: PAYMENT_VAT_AMOUNT,
    deliveryFee,
    total,
  }
}

export default function PaymentCheckoutSummary({
  requestNumber,
  deliveryMethod,
  onPay,
  className,
}: PaymentCheckoutSummaryProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment.checkout")
  const locale = useLocale()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const totals = getPaymentTotals(deliveryMethod)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(requestNumber)
      setCopied(true)
      toast.success(t("copied"))
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl p-px bg-linear-to-b from-primary to-transparent sm:rounded-[32px] rounded-[28px] ">
    <Card
      className={cn(
        " gap-0 rounded-[28px] border-none bg-white p-5 text-center shadow-none sm:rounded-[32px] sm:p-8",
        className,
      )}
    >
      <div className="mx-auto flex size-16 items-center justify-center  text-primary">
        <CustomIcon
          src="/forms/step-2/wallet.svg"
          size={45}
        />
      </div>

      <h2 className="mt-3 text-lg font-bold text-primary sm:text-xl">
        {t("heading")}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {t("description")}
      </p>

      <div className="mt-6 space-y-5 text-start">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#8a9aa3]">{t("requestNumber")}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm font-semibold text-black"
            aria-label={t("copyNumber")}
          >
            <span dir="ltr" className="font-clash tracking-wide">
              {requestNumber}
            </span>
            <CustomIcon
              src="/icons/copy.svg"
              size={14}
              className={cn("size-3.5 text-black", copied && "opacity-70")}
            />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#8a9aa3]">{t("service")}</span>
          <span className="text-sm font-bold text-black">
            {t("serviceValue")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#8a9aa3]">{t("deliveryMethod")}</span>
          <span className="text-sm font-bold text-black">
            {deliveryMethod === "paper"
              ? t("deliveryPaper")
              : t("deliveryElectronic")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#8a9aa3]">{t("status")}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f0d4f7] bg-[#fdf2ff] px-3 py-1.5 text-xs font-semibold text-[#a832d1]">
            <CircleAlert className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden="true" />
            {t("statusValue")}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-5 text-start">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 text-primary"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen((open) => !open)}
        >
          <span className="text-sm font-semibold">{t("details")}</span>
          <Eye className="size-5 shrink-0" aria-hidden="true" />
          <span className="sr-only">
            {detailsOpen ? t("hideDetails") : t("showDetails")}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {detailsOpen ? (
            <motion.div
              key="checkout-fee-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3 border-t border-[#e8eef0] pt-4">
                  <span className="text-sm text-[#6b7c85]">{t("serviceFee")}</span>
                  <span className="flex items-center gap-1 font-clash text-base font-medium text-[#3d4f57]">
                    {formatNumber(totals.serviceFee, locale)}
                    <SaudiRiyal
                      className="size-3.5 text-[#6b7c85]"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e8eef0] pt-4">
                  <span className="text-sm text-[#6b7c85]">{t("vat")}</span>
                  <span className="flex items-center gap-1 font-clash text-base font-medium text-[#3d4f57]">
                    {formatNumber(totals.vatAmount, locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    <SaudiRiyal
                      className="size-3.5 text-[#6b7c85]"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                {deliveryMethod === "paper" ? (
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#e8eef0] pt-4">
                    <span className="text-sm text-[#6b7c85]">
                      {t("deliveryFee")}
                    </span>
                    <span className="flex items-center gap-1 font-clash text-base font-medium text-[#3d4f57]">
                      {formatNumber(totals.deliveryFee, locale, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <SaudiRiyal
                        className="size-3.5 text-[#6b7c85]"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-4 border-t border-dashed border-[#d7e0e3] pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-primary">{t("total")}</span>
            <span className="flex items-center gap-1 font-clash text-xl font-bold text-primary">
              {formatNumber(totals.total, locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <SaudiRiyal className="size-5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2.5  bg-[#eef7f9] p-2 text-start">
        <Info
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p className=" leading-5 text-[#3d5a66] text-sm sm:leading-6">
          {t("info")}
        </p>
      </div>

      <Button
        type="button"
        onClick={onPay}
        className="mt-6 h-12 w-full gap-2 rounded-full text-sm font-semibold sm:text-base"
      >
        {t("pay")}
        <ArrowUpLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3.5" aria-hidden="true" />
        {t("secure")}
      </p>
    </Card>
    </div>
  )
}
