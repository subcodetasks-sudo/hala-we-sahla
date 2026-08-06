"use client"

import { useEffect, useMemo, useSyncExternalStore } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowUpLeft,
  CircleAlert,
  LoaderCircle,
  Lock,
  X,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTrackOrderPayment } from "@/features/forms/hooks/use-track-order-payment"
import {
  clearPaymentSession,
  readPaymentSession,
  subscribePaymentSession,
} from "@/features/forms/lib/payment-session"
import { formsKeys } from "@/features/forms/query-keys"
import {
  fetchPaymentStatus,
  PAYMENT_PROVIDER,
  resolvePaymentOutcome,
  type PaymentOutcome,
} from "@/features/forms/services/payment"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type PaymentResultViewProps = {
  mode: "success" | "failed"
  invoiceId?: string | null
  requestNumber?: string | null
  provider?: string
  className?: string
}

function getPaymentSessionSnapshot(requestNumber?: string | null) {
  const session = readPaymentSession(requestNumber)
  return session ? JSON.stringify(session) : null
}

export default function PaymentResultView({
  mode,
  invoiceId: invoiceIdProp,
  requestNumber: requestNumberProp,
  provider = PAYMENT_PROVIDER,
  className,
}: PaymentResultViewProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment.result")
  const locale = useLocale()

  const sessionJson = useSyncExternalStore(
    subscribePaymentSession,
    () => getPaymentSessionSnapshot(requestNumberProp),
    () => null,
  )
  const session = sessionJson
    ? (JSON.parse(sessionJson) as NonNullable<
        ReturnType<typeof readPaymentSession>
      >)
    : null

  const invoiceId = invoiceIdProp || session?.invoiceId || null
  const requestNumber =
    requestNumberProp || session?.requestNumber || null
  const resolvedProvider = provider || session?.provider || PAYMENT_PROVIDER

  const { markPaid } = useTrackOrderPayment(requestNumber ?? undefined)

  const statusQuery = useQuery({
    queryKey: formsKeys.paymentStatus(invoiceId || "unknown", resolvedProvider),
    queryFn: () => fetchPaymentStatus(locale, invoiceId!, resolvedProvider),
    enabled: Boolean(invoiceId),
    refetchInterval: (query) => {
      if (mode === "failed") return false
      const status = query.state.data?.data?.status
      if (!status) return 3000
      return resolvePaymentOutcome(status) === "pending" ? 3000 : false
    },
  })

  const payment = statusQuery.data?.data
  const outcome: PaymentOutcome = useMemo(() => {
    if (mode === "failed") return "failed"
    if (payment) return resolvePaymentOutcome(payment.status)
    if (statusQuery.isError) return "failed"
    if (!invoiceId) return mode === "success" ? "paid" : "failed"
    return "pending"
  }, [mode, payment, statusQuery.isError, invoiceId])

  const resolvedRequestNumber =
    payment?.metadata?.request_number || requestNumber || null

  useEffect(() => {
    if (outcome !== "paid" || !resolvedRequestNumber) return
    markPaid(session?.deliveryMethod ?? "electronic")
  }, [markPaid, outcome, resolvedRequestNumber, session?.deliveryMethod])

  useEffect(() => {
    if (outcome !== "paid") return
    if (resolvedRequestNumber) clearPaymentSession(resolvedRequestNumber)
    else clearPaymentSession()
  }, [outcome, resolvedRequestNumber])

  const trackHref = resolvedRequestNumber
    ? `/track-orders/${encodeURIComponent(resolvedRequestNumber)}`
    : "/track-orders"

  const retryHref = resolvedRequestNumber
    ? `/track-orders/${encodeURIComponent(resolvedRequestNumber)}/payment`
    : "/track-orders"

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-xl rounded-[28px] bg-linear-to-b p-px sm:rounded-[32px]",
        outcome === "paid"
          ? "from-custom-green to-transparent"
          : outcome === "failed"
            ? "from-destructive/70 to-transparent"
            : "from-primary to-transparent",
        className,
      )}
    >
      <Card className="gap-0 rounded-[28px] border-none bg-white p-6 text-center shadow-none sm:rounded-[32px] sm:p-10">
        {outcome === "pending" ? (
          <>
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LoaderCircle className="size-10 animate-spin" aria-hidden />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-primary sm:text-3xl">
              {t("pendingTitle")}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              {t("pendingDescription")}
            </p>
          </>
        ) : null}

        {outcome === "paid" ? (
          <>
            <div className="relative mx-auto">
              <div
                aria-hidden
                className="success-check-glow absolute inset-0 rounded-full bg-emerald-400/35 blur-2xl"
              />
              <div className="relative flex size-24 items-center justify-center rounded-tl-[30px] rounded-tr-[13px] rounded-br-[30px] rounded-bl-[13px] bg-custom-green shadow-[0_12px_40px_rgba(34,197,94,0.45)]">
                <svg
                  viewBox="0 0 52 52"
                  className="size-14"
                  fill="none"
                  aria-hidden
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
            <h1 className="mt-6 text-2xl font-bold text-[#1a6b63] sm:text-3xl">
              {t("successTitle")}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              {t("successDescription")}
            </p>
            {payment?.amount_format ? (
              <p className="mt-5 font-clash text-3xl font-bold text-primary">
                {payment.amount_format}
              </p>
            ) : null}
          </>
        ) : null}

        {outcome === "failed" ? (
          <>
            <div className="mx-auto flex size-24 items-center justify-center rounded-tl-[30px] rounded-tr-[13px] rounded-br-[30px] rounded-bl-[13px] bg-destructive shadow-[0_12px_40px_rgba(220,38,38,0.35)]">
              <X className="size-12 text-white" strokeWidth={3} aria-hidden />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-destructive sm:text-3xl">
              {mode === "failed" ? t("backTitle") : t("failedTitle")}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
              {mode === "failed"
                ? t("backDescription")
                : statusQuery.data?.message || t("failedDescription")}
            </p>
          </>
        ) : null}

        {resolvedRequestNumber ? (
          <div className="mt-8 rounded-2xl bg-background px-4 py-4">
            <p className="text-sm text-muted-foreground">{t("requestNumber")}</p>
            <p
              dir="ltr"
              className="mt-1 font-clash text-xl font-bold tracking-wide text-black"
            >
              {resolvedRequestNumber}
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          {outcome === "paid" ? (
            <Button asChild className="h-12 w-full gap-2 rounded-full text-base">
              <Link href={trackHref}>
                {t("trackOrder")}
                <ArrowUpLeft className="size-4 ltr:rotate-180" aria-hidden />
              </Link>
            </Button>
          ) : null}

          {outcome === "failed" ? (
            <>
              <Button asChild className="h-12 w-full gap-2 rounded-full text-base">
                <Link href={retryHref}>
                  {t("retry")}
                  <ArrowUpLeft className="size-4 ltr:rotate-180" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-full text-base"
              >
                <Link href={trackHref}>{t("backToTrack")}</Link>
              </Button>
            </>
          ) : null}

          {outcome === "pending" && payment?.url ? (
            <Button asChild className="h-12 w-full gap-2 rounded-full text-base">
              <a href={payment.url}>
                <CustomIcon
                  src="/forms/step-2/wallet.svg"
                  size={18}
                  className="size-4"
                />
                {t("continuePayment")}
              </a>
            </Button>
          ) : null}
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          {outcome === "failed" ? (
            <CircleAlert className="size-3.5" aria-hidden />
          ) : (
            <Lock className="size-3.5" aria-hidden />
          )}
          {t("secure")}
        </p>
      </Card>
    </div>
  )
}
