"use client"

import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import CopyButton from "@/components/shared/copy-button"
import { cn } from "@/lib/utils"

type TrackOrderRequestNumberProps = {
  requestNumber: string
  className?: string
}

export default function TrackOrderRequestNumber({
  requestNumber,
  className,
}: TrackOrderRequestNumberProps) {
  const t = useTranslations("Forms.trackOrders.detail")

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <CustomIcon
        src="/icons/tag-2.svg"
        size={16}
        className="size-4 text-muted-foreground"
      />
      <p className="text-xs font-normal leading-5 text-muted-foreground">
        {t("fields.requestNumber")}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold leading-6 tracking-wide text-[#1a3d4d]">
          {requestNumber}
        </p>
        <CopyButton
          value={requestNumber}
          label={t("copyNumber")}
          className="size-7 rounded-full bg-[#e8f4f6] text-[#1a3d4d] transition-colors hover:bg-[#dceef1]"
        >
          <CustomIcon
            src="/icons/copy.svg"
            size={16}
            className="size-4 text-black"
          />
        </CopyButton>
      </div>
    </div>
  )
}
