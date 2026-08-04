"use client"

import { motion } from "motion/react"
import { Check, Info, RefreshCw } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

type PaymentDeliveryUnavailableNoticeProps = {
  className?: string
}

export default function PaymentDeliveryUnavailableNotice({
  className,
}: PaymentDeliveryUnavailableNoticeProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment.deliveryUnavailable")
  const locale = useLocale()
  const isRtl = locale === "ar"

  return (
    <div className={cn("mx-auto w-full max-w-xl text-center", className)}>
      <img
        src="/icons/truck.svg"
        alt=""
        width={56}
        height={56}
        className="mx-auto size-14"
        aria-hidden="true"
      />

      <h2 className="mt-4 text-xl font-bold leading-8 text-[#EF4550] sm:text-[22px]">
        {t("title")}
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#6b7c85] sm:text-[15px]">
        {t("description")}
      </p>

      <div className="mt-6 rounded-[24px] bg-[#eff8f9] px-4 py-5 sm:rounded-[28px] sm:px-5 sm:py-6">
        <div className="mb-5 flex items-center justify-start gap-2 text-start text-black">
          <RefreshCw className="size-5 shrink-0" strokeWidth={2.25} aria-hidden />
          <span className="text-sm font-bold sm:text-[15px]">{t("updateTitle")}</span>
        </div>

        <div className="flex justify-between items-center gap-3 sm:gap-4">
          <div className="flex flex-col w-1/3 items-center gap-3 rounded-2xl border border-[#EF4550] bg-white px-3 py-4 shadow-[0_2px_12px_rgba(40,130,150,0.08)]">
            <span className="relative inline-flex size-12 items-center justify-center">
              <img
                src="/icons/truck-red.svg"
                alt=""
                width={48}
                height={48}
                className="size-12"
                aria-hidden="true"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <span className="h-[2.5px] w-10 rotate-[-38deg] rounded-full bg-[#EF4550]" />
              </span>
            </span>
            <p className="text-sm font-bold text-[#EF4550]">{t("fromMethod")}</p>
            <span className="rounded-lg bg-[#EF4550] px-3 py-2 text-[11px] font-semibold text-white sm:text-xs">
              {t("unavailableBadge")}
            </span>
          </div>

          <div
            className="relative flex h-12 w-12 items-center justify-center overflow-visible sm:w-16"
            aria-hidden="true"
          >
            <motion.div
              className="flex items-center justify-center"
              animate={{
                x: isRtl ? [10, -10] : [-10, 10],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.45,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src="/icons/truck-arrow.svg"
                alt=""
                width={96}
                height={18}
                className={cn(
                  "h-[18px] w-20 max-w-none sm:w-24",
                  !isRtl && "scale-x-[-1]",
                )}
              />
            </motion.div>
          </div>

          <div className="flex flex-col w-1/3 items-center gap-3 rounded-2xl border border-[#1B8354] bg-white px-3 py-4 shadow-[0_2px_12px_rgba(40,130,150,0.08)]">
            <img
              src="/icons/truck-green.svg"
              alt=""
              width={48}
              height={48}
              className="size-12"
              aria-hidden="true"
            />
            <p className="text-sm font-bold text-[#1a3a44]">{t("toMethod")}</p>
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#1B8354] px-3 py-2 text-[11px] font-semibold text-white sm:text-xs">
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              {t("availableBadge")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-[#eef7f9] px-4 py-3 text-start">
        <Info
          className="size-[18px] shrink-0 text-[#3d5a66]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <p className="text-sm leading-6 text-[#3d5a66]">{t("payInfo")}</p>
      </div>
    </div>
  )
}
