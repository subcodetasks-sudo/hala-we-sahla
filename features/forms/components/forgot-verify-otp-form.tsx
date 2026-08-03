"use client"

import { useEffect, useEffectEvent, useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp"
import OtpPillSlot from "@/features/forms/components/otp-pill-slot"
import { FORGOT_PHONE_STORAGE_KEY } from "@/features/forms/lib/forgot-request-storage"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const OTP_LENGTH = 4
const RESEND_SECONDS = 59

const cardClassName =
  "mx-auto max-w-lg gap-0 rounded-[28px] border-none bg-card px-6 py-10 shadow-[0_12px_40px_rgba(40,130,150,0.1)] ring-0 sm:rounded-[32px] sm:px-10 sm:py-12"

function formatTimer(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

export default function ForgotVerifyOtpForm() {
  const t = useTranslations("Forms.trackOrders.forgot.verify")
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [timerKey, setTimerKey] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [error, setError] = useState<string | null>(null)
  const [phoneReady, setPhoneReady] = useState(false)

  const canResend = secondsLeft <= 0
  const isComplete = otp.length === OTP_LENGTH

  const ensurePhone = useEffectEvent(() => {
    if (typeof window === "undefined") return
    const phone = window.sessionStorage.getItem(FORGOT_PHONE_STORAGE_KEY)
    if (!phone) {
      router.replace("/track-orders/forgot")
      return
    }
    setPhoneReady(true)
  })

  useEffect(() => {
    ensurePhone()
  }, [])

  useEffect(() => {
    if (!phoneReady) return

    setSecondsLeft(RESEND_SECONDS)
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    return () => window.clearInterval(id)
  }, [phoneReady, timerKey])

  function handleOtpChange(value: string) {
    setOtp(value)
    if (error) setError(null)
  }

  function handleResend() {
    if (!canResend) return
    setTimerKey((key) => key + 1)
    setOtp("")
    setError(null)
    toast.success(t("resent"))
  }

  function handleConfirm() {
    if (!isComplete) {
      setError(t("errors.required"))
      return
    }

    toast.success(t("success"))
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(FORGOT_PHONE_STORAGE_KEY)
    }
    router.push("/track-orders/requests")
  }

  if (!phoneReady) {
    return null
  }

  return (
    <Card className={cardClassName}>
      <div className="flex flex-col items-center text-center">
        <CustomIcon
          src="/icons/smart-phone.svg"
          size={52}
          className="size-12 text-primary"
        />
        <h2 className="mt-8 text-xl font-bold text-primary sm:mt-9 sm:text-2xl">
          {t("title")}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {t("description")}
        </p>
      </div>

      <div className="mt-10">
        <FieldGroup className="gap-6">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel className="text-primary">
              {t("fields.code.label")}
              <span className="text-accent">*</span>
            </FieldLabel>
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={handleOtpChange}
              containerClassName="w-full justify-center gap-3 sm:gap-4"
              aria-invalid={error ? true : undefined}
            >
              <InputOTPGroup
                dir="ltr"
                className="gap-3 rounded-none border-0 sm:gap-4"
              >
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                  <OtpPillSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>

          <div className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex min-w-16 items-center justify-center rounded-lg bg-[#5b6b73] px-3 py-1.5 font-clash text-sm font-semibold tabular-nums text-white">
              {formatTimer(secondsLeft)}
            </span>
            <p className="text-sm text-muted-foreground">{t("resend.prompt")}</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium transition-opacity",
                canResend
                  ? "text-primary hover:opacity-80"
                  : "cursor-not-allowed text-muted-foreground/70",
              )}
            >
              <CustomIcon
                src="/icons/message.svg"
                size={18}
                className="size-4.5 shrink-0"
              />
              <span>{t("resend.action")}</span>
            </button>
          </div>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isComplete}
            className={cn(
              "mx-auto h-12 w-full max-w-70 gap-3 rounded-full px-8 text-base font-bold text-white sm:w-fit",
              isComplete
                ? "bg-primary shadow-[0_8px_24px_rgba(40,130,150,0.35)]"
                : "bg-[#5b6b73] shadow-[0_8px_24px_rgba(91,107,115,0.35)] disabled:opacity-100",
            )}
          >
            <span>{t("submit")}</span>
            <CustomIcon
              src="/icons/arrows.svg"
              width={28}
              height={16}
              className="shrink-0 text-white ltr:rotate-180"
            />
          </Button>
        </FieldGroup>
      </div>
    </Card>
  )
}
