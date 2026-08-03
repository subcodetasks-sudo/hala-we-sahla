"use client"

import { useContext } from "react"
import { OTPInputContext } from "input-otp"

import { cn } from "@/lib/utils"

type OtpPillSlotProps = {
  index: number
  className?: string
}

export default function OtpPillSlot({ index, className }: OtpPillSlotProps) {
  const inputOTPContext = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}
  const hasValue = Boolean(char)

  return (
    <div
      data-slot="otp-pill-slot"
      data-active={isActive || undefined}
      data-filled={hasValue || undefined}
      className={cn(
        "relative flex h-12 w-16 shrink-0 items-center justify-center rounded-full border border-[#d7e0e3] bg-[#f3f5f6] font-clash text-xl font-semibold text-muted-foreground transition-all outline-none sm:h-14 sm:w-20 sm:text-2xl",
        "data-[active=true]:z-10 data-[active=true]:border-custom-green data-[active=true]:bg-[#e8f5ef] data-[active=true]:text-custom-green data-[active=true]:ring-3 data-[active=true]:ring-custom-green/20",
        "data-[filled=true]:border-custom-green data-[filled=true]:bg-[#e8f5ef] data-[filled=true]:text-custom-green",
        className,
      )}
    >
      {hasValue ? (
        char
      ) : (
        <span className="text-muted-foreground/60" aria-hidden="true">
          -
        </span>
      )}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-custom-green duration-1000" />
        </div>
      ) : null}
    </div>
  )
}
