"use client"

import { useEffect, useEffectEvent, useState } from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp"
import OtpPillSlot from "@/features/forms/components/otp-pill-slot"
import { useSendForgotRequestOtp } from "@/features/forms/hooks/use-send-forgot-request-otp"
import { useVerifyForgotRequestOtp } from "@/features/forms/hooks/use-verify-forgot-request-otp"
import {
  clearForgotOtpSession,
  getForgotOtpSecondsLeft,
  readForgotOtpSession,
  saveForgotOtpSession,
  type ForgotOtpSession,
} from "@/features/forms/lib/forgot-request-storage"
import { savePreviousRequestsSession } from "@/features/forms/lib/previous-requests-session"
import { useRouter } from "@/i18n/navigation"
import { getApiErrorMessages } from "@/lib/api"
import { cn } from "@/lib/utils"

const OTP_LENGTH = 4
const DEFAULT_RESEND_SECONDS = 300

const cardClassName =
  "mx-auto max-w-lg gap-0 rounded-[28px] border-none bg-card px-6 py-10 shadow-[0_12px_40px_rgba(40,130,150,0.1)] ring-0 sm:rounded-[32px] sm:px-10 sm:py-12"

function formatTimer(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

export default function ForgotVerifyOtpForm() {
  const t = useTranslations("Forms.trackOrders.forgot.verify")
  const tForgot = useTranslations("Forms.trackOrders.forgot")
  const tCommon = useTranslations("Common.errors")
  const router = useRouter()
  const sendOtpMutation = useSendForgotRequestOtp()
  const verifyOtpMutation = useVerifyForgotRequestOtp()
  const [otp, setOtp] = useState("")
  const [session, setSession] = useState<ForgotOtpSession | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_RESEND_SECONDS)
  const [error, setError] = useState<string | null>(null)

  const isBusy = sendOtpMutation.isPending || verifyOtpMutation.isPending
  const canResend = secondsLeft <= 0 && !isBusy
  const isComplete = otp.length === OTP_LENGTH

  const ensureSession = useEffectEvent(() => {
    const next = readForgotOtpSession()
    if (!next) {
      router.replace("/track-orders/forgot")
      return
    }
    setSession(next)
    setSecondsLeft(getForgotOtpSecondsLeft(next))
  })

  useEffect(() => {
    ensureSession()
  }, [])

  useEffect(() => {
    if (!session) return

    setSecondsLeft(getForgotOtpSecondsLeft(session))
    const id = window.setInterval(() => {
      setSecondsLeft(getForgotOtpSecondsLeft(session))
    }, 1000)

    return () => window.clearInterval(id)
  }, [session])

  function handleOtpChange(value: string) {
    setOtp(value)
    if (error) setError(null)
  }

  async function handleResend() {
    if (!canResend || !session) return

    try {
      const result = await sendOtpMutation.mutateAsync(session.phone)
      const nextSession: ForgotOtpSession = {
        phone: session.phone,
        expiresIn: result.data.expires_in || DEFAULT_RESEND_SECONDS,
        sentAt: Date.now(),
      }
      saveForgotOtpSession(nextSession)
      setSession(nextSession)
      setOtp("")
      setError(null)
      toast.success(result.message || t("resent"))
    } catch (err) {
      const message =
        getApiErrorMessages(err, {
          network: tCommon("network"),
          timeout: tCommon("timeout"),
          unknown: tForgot("errors.sendFailed"),
        })[0] ?? tForgot("errors.sendFailed")
      toast.error(message)
    }
  }

  async function handleConfirm() {
    if (!session) return

    if (!isComplete) {
      setError(t("errors.required"))
      return
    }

    try {
      const result = await verifyOtpMutation.mutateAsync({
        phone: session.phone,
        otp,
      })

      savePreviousRequestsSession({
        phone: session.phone,
        data: result.data,
        fetchedAt: Date.now(),
      })
      clearForgotOtpSession()

      toast.success(result.message || t("success"))
      router.push("/track-orders/requests")
    } catch (err) {
      const message =
        getApiErrorMessages(err, {
          network: tCommon("network"),
          timeout: tCommon("timeout"),
          unknown: t("errors.verifyFailed"),
        })[0] ?? t("errors.verifyFailed")
      setError(message)
    }
  }

  if (!session) {
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
              disabled={verifyOtpMutation.isPending}
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
            {error ? (
              <FieldError className="text-center">{error}</FieldError>
            ) : null}
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
              {sendOtpMutation.isPending ? (
                <Loader2 className="size-4.5 animate-spin shrink-0" aria-hidden />
              ) : (
                <CustomIcon
                  src="/icons/message.svg"
                  size={18}
                  className="size-4.5 shrink-0"
                />
              )}
              <span>{t("resend.action")}</span>
            </button>
          </div>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isComplete || isBusy}
            className={cn(
              "mx-auto h-12 w-full max-w-70 gap-3 rounded-full px-8 text-base font-bold text-white sm:w-fit",
              isComplete
                ? "bg-primary shadow-[0_8px_24px_rgba(40,130,150,0.35)]"
                : "bg-[#5b6b73] shadow-[0_8px_24px_rgba(91,107,115,0.35)] disabled:opacity-100",
            )}
          >
            {verifyOtpMutation.isPending ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : null}
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
