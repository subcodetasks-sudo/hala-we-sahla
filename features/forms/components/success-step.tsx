"use client"

import { ArrowLeft, ArrowUpLeft } from "lucide-react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import CopyButton from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type SuccessStepProps = {
  requestNumber: string
  className?: string
}

export default function SuccessStep({
  requestNumber,
  className,
}: SuccessStepProps) {
  const t = useTranslations("Forms.renewal.wizard.success")

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-3xl flex-col items-center px-1 py-4 text-center sm:py-6",
        className,
      )}
    >
      <div className="relative mb-6">
        <div
          aria-hidden="true"
          className="success-check-glow absolute inset-0 rounded-full bg-emerald-400/35 blur-2xl"
        />
        <div className="success-check-pop relative flex size-24 items-center justify-center rounded-tl-[30px]
rounded-tr-[13px]
rounded-br-[30px]
rounded-bl-[13px] bg-[#1B8354] shadow-[0_12px_40px_rgba(34,197,94,0.45)] sm:size-24">
          <svg
            viewBox="0 0 52 52"
            className="size-16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M14 27.5 L22.5 36 L38 18"
              className="success-check-draw"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-[#1a6b63] sm:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[#989898] sm:text-base">
        {t("subtitle")}
      </p>

      <div className="mt-8 w-full rounded-[1.75rem] bg-background px-5 py-6 text-start sm:rounded-[2rem] sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-[#989898] ">
            {t("statusLabel")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary p-2 text-xs font-semibold text-white sm:text-sm">
            <span
              className="size-1.5 rounded-full bg-white"
              aria-hidden="true"
            />
            {t("statusValue")}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[#989898]">
              {t("requestNumberLabel")}
            </p>
            <p className="mt-1 font-clash text-xl  tracking-wide text-black font-medium ">
              {requestNumber}
            </p>
          </div>

          <CopyButton
            value={requestNumber}
            label={t("copyNumber")}
            className="h-10 gap-2 rounded-full border border-transparent bg-white px-4 text-sm font-semibold text-black shadow-none transition-colors hover:bg-white/90"
          >
            {t("copyNumber")}
            <CustomIcon
              src="/icons/copy.svg"
              size={16}
              className="size-4 shrink-0 text-black"
            />
          </CopyButton>
        </div>

        <p className="mt-6 text-center text-sm leading-6 text-[#989898]">
          {t("smsHint")}
        </p>
      </div>

      <p className="mt-6 text-sm text-[#989898] sm:text-base">
        {t("followUp")}
      </p>

      <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <Button
          type="button"
          asChild
          className="h-14!  gap-2 rounded-full  text-base text-white pe-2"
        >
          <Link href="/">
            {t("goHome")}
            <ArrowLeft className="size-4  ltr:rotate-180" aria-hidden="true" />
          </Link>
        </Button>

        <Button
          type="button"
          variant="ghost"
          asChild
          className="h-11 gap-2 rounded-full px-4 text-base font-semibold text-foreground hover:bg-transparent hover:text-primary"
        >
          <Link href="/track-orders">
            <CustomIcon
              src="/icons/box-time.svg"
              size={22}
              className="size-4.5 shrink-0"
            />
            {t("trackOrder")}
            <ArrowUpLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
