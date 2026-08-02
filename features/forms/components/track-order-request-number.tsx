"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
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
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(requestNumber)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

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
      <div className="flex items-center gap-2" >
      <p className="text-sm font-bold leading-6 tracking-wide text-[#1a3d4d]">
          {requestNumber}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? t("copied") : t("copyNumber")}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e8f4f6] text-[#1a3d4d] transition-colors hover:bg-[#dceef1]"
        >
          <CustomIcon size={16} className="text-black" src="/icons/copy.svg" aria-hidden="true" />
        </button>

      </div>
    </div>
  )
}
