"use client"

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  CircleAlert,
  Eye,
  LoaderCircle,
  Lock,
  SaudiRiyal,
  X,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import CopyButton from "@/components/shared/copy-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ContractPreviewDialog from "@/features/forms/components/contract-preview-dialog"
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
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

type PaymentResultViewProps = {
  /** `status` follows the API only. `failed` forces the cancel/fail UI. */
  mode?: "status" | "failed"
  invoiceId?: string | null
  requestNumber?: string | null
  provider?: string
  className?: string
}

function getPaymentSessionSnapshot(requestNumber?: string | null) {
  const session = readPaymentSession(requestNumber)
  return session ? JSON.stringify(session) : null
}

const KNOWN_PAYMENT_STATUSES = new Set([
  "paid",
  "paid_out",
  "captured",
  "completed",
  "success",
  "failed",
  "expired",
  "canceled",
  "cancelled",
  "voided",
  "initiated",
  "pending",
])

function getStatusBadgeClass(outcome: PaymentOutcome) {
  if (outcome === "paid") {
    return "border-transparent bg-custom-green/15 text-custom-green"
  }
  if (outcome === "failed") {
    return "border-transparent bg-destructive/10 text-destructive"
  }
  return "border-transparent bg-primary/10 text-primary"
}

function getStatusTranslationKey(status: string) {
  return status.trim().toLowerCase().replace(/\s+/g, "_")
}

function translatePaymentStatus(
  status: string | null | undefined,
  t: ReturnType<typeof useTranslations>,
) {
  if (!status) return ""
  const key = getStatusTranslationKey(status)
  if (!KNOWN_PAYMENT_STATUSES.has(key)) return status

  switch (key) {
    case "paid":
    case "paid_out":
      return t("statuses.paid")
    case "captured":
    case "completed":
      return t("statuses.completed")
    case "success":
      return t("statuses.success")
    case "failed":
      return t("statuses.failed")
    case "expired":
      return t("statuses.expired")
    case "canceled":
    case "cancelled":
      return t("statuses.cancelled")
    case "voided":
      return t("statuses.voided")
    case "initiated":
      return t("statuses.initiated")
    case "pending":
      return t("statuses.pending")
    default:
      return status
  }
}

function resolveDisplayAmount(payment: {
  amount?: number
  amount_format?: string
  metadata?: { total?: number }
}) {
  if (typeof payment.metadata?.total === "number") {
    return payment.metadata.total
  }
  if (typeof payment.amount === "number") {
    // Moyasar amounts are in the smallest currency unit (halalas)
    return payment.amount / 100
  }
  return null
}

export default function PaymentResultView({
  mode = "status",
  invoiceId: invoiceIdProp,
  requestNumber: requestNumberProp,
  provider = PAYMENT_PROVIDER,
  className,
}: PaymentResultViewProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment.result")
  const tCommon = useTranslations("Common")
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
  const requestNumber = requestNumberProp || session?.requestNumber || null
  const resolvedProvider = provider || session?.provider || PAYMENT_PROVIDER

  const { markPaid } = useTrackOrderPayment(requestNumber ?? undefined)

  const statusQuery = useQuery({
    queryKey: formsKeys.paymentStatus(invoiceId || "unknown", resolvedProvider),
    queryFn: () => fetchPaymentStatus(locale, invoiceId!, resolvedProvider),
    enabled: Boolean(invoiceId),
    refetchInterval: (query) => {
      if (mode === "failed") return false
      const status = query.state.data?.data?.payment?.status
      if (!status) return 3000
      return resolvePaymentOutcome(status) === "pending" ? 3000 : false
    },
  })

  const payment = statusQuery.data?.data?.payment
  const renewalRequest = statusQuery.data?.data?.renewalRequest
  const apiMessage = statusQuery.data?.message

  const outcome: PaymentOutcome = useMemo(() => {
    if (mode === "failed") return "failed"
    if (!invoiceId) return "failed"
    if (payment) return resolvePaymentOutcome(payment.status)
    if (statusQuery.isError) return "failed"
    return "pending"
  }, [mode, invoiceId, payment, statusQuery.isError])

  const resolvedRequestNumber =
    payment?.metadata?.request_number ||
    renewalRequest?.request_number ||
    requestNumber ||
    null

  const contractUrl = renewalRequest?.final_contract_url || null
  const canDownloadContract =
    Boolean(contractUrl) &&
    (renewalRequest?.actions?.can_download_contract ?? true)

  const displayAmount = payment ? resolveDisplayAmount(payment) : null

  const markedPaidRef = useRef(false)
  const [contractOpen, setContractOpen] = useState(false)

  useEffect(() => {
    markedPaidRef.current = false
  }, [invoiceId])

  useEffect(() => {
    if (outcome !== "paid" || !resolvedRequestNumber) return
    if (markedPaidRef.current) return
    markedPaidRef.current = true
    markPaid(session?.deliveryMethod ?? "electronic")
  }, [markPaid, outcome, resolvedRequestNumber, session?.deliveryMethod])

  useEffect(() => {
    if (outcome !== "paid") return
    if (resolvedRequestNumber) clearPaymentSession(resolvedRequestNumber)
    else clearPaymentSession()
  }, [outcome, resolvedRequestNumber])

  const retryHref = resolvedRequestNumber
    ? `/track-orders/${encodeURIComponent(resolvedRequestNumber)}/payment`
    : "/track-orders"

  if (!invoiceId) {
    return (
      <div
        className={cn(
          "mx-auto w-full max-w-xl rounded-[28px] bg-linear-to-b from-destructive/70 to-transparent p-px sm:rounded-[32px]",
          className,
        )}
      >
        <Card className="gap-0 rounded-[28px] border-none bg-white p-6 text-center shadow-none sm:rounded-[32px] sm:p-10">
          <div className="mx-auto flex size-24 items-center justify-center rounded-tl-[30px] rounded-tr-[13px] rounded-br-[30px] rounded-bl-[13px] bg-destructive shadow-[0_12px_40px_rgba(220,38,38,0.35)]">
            <X className="size-12 text-white" strokeWidth={3} aria-hidden />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-destructive sm:text-3xl">
            {t("missingInvoiceTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            {t("missingInvoiceDescription")}
          </p>
          <div className="mt-8">
            <Button asChild className="h-12 w-full rounded-full text-base">
              <Link href={retryHref}>{t("retry")}</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

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
              {apiMessage || t("pendingDescription")}
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
              {apiMessage || t("successDescription")}
            </p>
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
                : apiMessage || t("failedDescription")}
            </p>
          </>
        ) : null}

        {(displayAmount != null ||
          payment?.status ||
          resolvedRequestNumber ||
          payment?.description) && (
          <div className="mt-8 space-y-3 rounded-2xl bg-background px-4 py-4 text-start">
            {payment?.status ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{t("statusLabel")}</p>
                <Badge
                  className={cn(
                    "h-6 px-2.5 text-xs font-semibold",
                    getStatusBadgeClass(outcome),
                  )}
                >
                  {translatePaymentStatus(payment.status, t)}
                </Badge>
              </div>
            ) : null}
            {displayAmount != null ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{t("amountLabel")}</p>
                <p className="flex items-center gap-1 font-clash text-lg font-bold text-primary">
                  <span dir="ltr">
                    {formatNumber(displayAmount, locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <SaudiRiyal className="size-5" aria-hidden="true" />
                </p>
              </div>
            ) : null}
            {resolvedRequestNumber ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {t("requestNumber")}
                </p>
                <div className="flex items-center gap-2">
                  <p
                    dir="ltr"
                    className="font-clash text-base font-bold tracking-wide text-black"
                  >
                    {resolvedRequestNumber}
                  </p>
                  <CopyButton
                    value={resolvedRequestNumber}
                    label={t("copyNumber")}
                    className="size-7 rounded-full bg-[#e8f4f6] text-[#1a3d4d] transition-colors hover:bg-[#dceef1]"
                  >
                    <CustomIcon
                      src="/icons/copy.svg"
                      size={14}
                      className="size-3.5 text-black"
                    />
                  </CopyButton>
                </div>
              </div>
            ) : null}
            {payment?.description ? (
              <div className="border-t border-border/60 pt-3">
                <p className="text-sm text-muted-foreground">
                  {t("descriptionLabel")}
                </p>
                <p className="mt-1 text-sm text-black">{payment.description}</p>
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {outcome === "paid" ? (
            <>
              {canDownloadContract && contractUrl ? (
                <>
                  <Button
                    type="button"
                    onClick={() => setContractOpen(true)}
                    className="h-12 w-full gap-2 rounded-full text-base"
                  >
                    <CustomIcon
                      src="/icons/download.svg"
                      size={18}
                      className="size-4.5 text-current"
                    />
                    {t("downloadContract")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setContractOpen(true)}
                    className="h-12 w-full gap-2 rounded-full border-primary/30 bg-white text-base font-semibold text-primary hover:bg-white hover:text-primary"
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    {t("viewContract")}
                  </Button>
                </>
              ) : null}
              <Button
                asChild
                variant={canDownloadContract && contractUrl ? "outline" : "default"}
                className="h-12 w-full gap-2 rounded-full text-base"
              >
                <Link href="/">
                  <CustomIcon
                    src="/icons/home.svg"
                    size={18}
                    className="size-4.5 text-current"
                  />
                  {tCommon("home")}
                </Link>
              </Button>
            </>
          ) : null}

          {outcome === "failed" ? (
            <>
              <Button
                asChild
                className="h-12 w-full gap-2 rounded-full text-base"
              >
                <Link href={retryHref}>{t("retry")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full gap-2 rounded-full text-base"
              >
                <Link href="/">
                  <CustomIcon
                    src="/icons/home.svg"
                    size={18}
                    className="size-4.5 text-current"
                  />
                  {tCommon("home")}
                </Link>
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

      <ContractPreviewDialog
        open={contractOpen}
        onOpenChange={setContractOpen}
        pdfUrl={contractUrl}
      />
    </div>
  )
}
