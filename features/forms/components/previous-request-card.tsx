"use client"

import { useState } from "react"
import { Eye, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import CopyButton from "@/components/shared/copy-button"
import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import ContractPreviewDialog from "@/features/forms/components/contract-preview-dialog"
import { useTrackOrderMutation } from "@/features/forms/hooks/use-track-order-mutation"
import {
  isPreviousRequestCompleted,
} from "@/features/forms/lib/previous-requests-session"
import { saveTrackOrderSession } from "@/features/forms/lib/track-order-session"
import type { ForgotRequestItem } from "@/features/forms/services/forgot-request"
import { isTrackOrderCompleted } from "@/features/forms/services/track-order"
import { useRouter } from "@/i18n/navigation"
import { getApiErrorMessages } from "@/lib/api"
import { cn } from "@/lib/utils"

const AVATAR_TONES = [
  "bg-[#f9d5e5] text-[#c2185b]",
  "bg-[#d6e4ff] text-[#2f6fed]",
  "bg-[#dce4ff] text-[#3f51b5]",
] as const

const STATUS_COLOR_CLASSES: Record<string, string> = {
  green: "border border-[#00A63E33] bg-[#DEFFEA] text-[#00A63E]",
  purple: "border border-[#7C3AED33] bg-[#F3E8FF] text-[#7C3AED]",
  blue: "border border-[#155DFC33] bg-[#E2EBFF] text-[#155DFC]",
  orange: "border border-[#FFB39C] bg-[#FFDCD2] text-[#FF3C00]",
  red: "border border-[#FFB39C] bg-[#FFDCD2] text-[#FF3C00]",
  gray: "border border-[#d7e0e3] bg-[#f5f7f8] text-[#5b7380]",
}

type PreviousRequestCardProps = {
  request: ForgotRequestItem
  phone: string
}

function getStatusIcon(status: string, statusColor: string) {
  if (isPreviousRequestCompleted(status) || statusColor === "green") {
    return "/icons/tick-circle.svg"
  }
  if (status.includes("cancel") || status.includes("refund") || statusColor === "red") {
    return "/icons/information.svg"
  }
  if (status.includes("payment") || statusColor === "orange") {
    return "/icons/empty-wallet-time.svg"
  }
  if (status.includes("auth")) {
    return "/icons/frame.svg"
  }
  return "/icons/chart.svg"
}

function getPrimaryHref(request: ForgotRequestItem) {
  const type = request.actions.primary?.type
  if (type === "complete_payment" || type === "payment") {
    return `/track-orders/${request.request_number}/payment`
  }
  if (type === "view_contract" || isPreviousRequestCompleted(request.status)) {
    return `/track-orders/${request.request_number}/completed`
  }
  return `/track-orders/${request.request_number}`
}

function getPrimaryButtonClass(type: string | undefined, status: string) {
  if (type === "complete_payment" || type === "payment") {
    return "bg-black text-white hover:bg-black/90"
  }
  if (type === "view_contract" || isPreviousRequestCompleted(status)) {
    return "bg-custom-green text-white hover:bg-custom-green/90"
  }
  return "bg-primary text-white hover:bg-primary/90"
}

export default function PreviousRequestCard({
  request,
  phone,
}: PreviousRequestCardProps) {
  const t = useTranslations("Forms.trackOrders.previousRequests")
  const tCommon = useTranslations("Common.errors")
  const router = useRouter()
  const trackMutation = useTrackOrderMutation()
  const [contractOpen, setContractOpen] = useState(false)

  const isCompleted = isPreviousRequestCompleted(request.status)
  const avatarTone = AVATAR_TONES[request.id % AVATAR_TONES.length]
  const statusClass =
    STATUS_COLOR_CLASSES[request.status_color] ||
    STATUS_COLOR_CLASSES.purple
  const primaryLabel =
    request.actions.primary?.label || t("actions.trackRequest")
  const primaryType = request.actions.primary?.type
  const copyLabel = request.actions.copy_number_label || t("actions.copyNumber")
  const canCopy = request.actions.can_copy_number !== false

  async function openTrackedRequest(target: "auto" | "completed" | "detail" | "payment" = "auto") {
    try {
      const data = await trackMutation.mutateAsync({
        request_number: request.request_number,
        phone,
      })

      const requestNumber = data.request_number || request.request_number

      saveTrackOrderSession({
        request_number: requestNumber,
        phone,
        data,
        fetchedAt: Date.now(),
      })

      if (target === "payment") {
        router.push(`/track-orders/${requestNumber}/payment`)
        return
      }

      if (
        target === "completed" ||
        (target === "auto" && isTrackOrderCompleted(data))
      ) {
        router.push(`/track-orders/${requestNumber}/completed`)
        return
      }

      router.push(`/track-orders/${requestNumber}`)
    } catch (error) {
      const message =
        getApiErrorMessages(error, {
          network: tCommon("network"),
          timeout: tCommon("timeout"),
          unknown: t("trackFailed"),
        })[0] ?? t("trackFailed")
      toast.error(message)
    }
  }

  async function handlePrimaryAction() {
    if (
      primaryType === "follow_up" ||
      primaryType === "track" ||
      !primaryType
    ) {
      await openTrackedRequest("auto")
      return
    }

    if (primaryType === "complete_payment" || primaryType === "payment") {
      await openTrackedRequest("payment")
      return
    }

    if (primaryType === "view_contract" && request.final_contract_url) {
      window.open(request.final_contract_url, "_blank", "noopener,noreferrer")
      return
    }

    if (primaryType === "view_contract" || isCompleted) {
      await openTrackedRequest("completed")
      return
    }

    router.push(getPrimaryHref(request))
  }

  return (
    <article className="rounded-2xl border border-primary/10 bg-[#F9F9F9] p-4 sm:rounded-3xl sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="font-clash text-base font-bold tabular-nums text-black sm:text-lg">
            {request.request_number}
          </p>
          <p className="text-sm text-muted-foreground">
            {request.delivery_method_label}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold",
            statusClass,
          )}
        >
          <span
            className="size-1.5 shrink-0 rounded-full bg-current"
            aria-hidden="true"
          />
          <CustomIcon
            src={getStatusIcon(request.status, request.status_color)}
            size={16}
            className="size-4"
          />
          {request.status_label}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full text-base font-bold sm:size-14 sm:text-lg",
              avatarTone,
            )}
            aria-hidden="true"
          >
            {request.avatar_initial}
          </span>
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-semibold text-black sm:text-base">
              {request.worker_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {request.description}
            </p>
          </div>
        </div>

        <p className="flex shrink-0 items-center gap-1.5 font-clash text-sm text-muted-foreground sm:text-base">
          <CustomIcon
            src="/icons/calendar-tick.svg"
            size={16}
            className="size-4"
          />
          <span>{request.submitted_date_label}</span>
        </p>
      </div>

      {isCompleted ? (
        <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            type="button"
            onClick={() => openTrackedRequest("completed")}
            disabled={trackMutation.isPending}
            className="h-11 flex-1 gap-2 rounded-full bg-primary px-3 text-sm font-bold text-white shadow-none hover:bg-primary/90 sm:h-12 sm:text-base"
          >
            {trackMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Eye className="size-4 shrink-0" aria-hidden="true" />
            )}
            <span>{t("actions.viewInvoice")}</span>
          </Button>

          <Button
            type="button"
            onClick={() => {
              if (request.final_contract_url) {
                window.open(
                  request.final_contract_url,
                  "_blank",
                  "noopener,noreferrer",
                )
                return
              }
              setContractOpen(true)
            }}
            className="h-11 flex-1 gap-2 rounded-full bg-black px-3 text-sm font-bold text-white shadow-none hover:bg-black/90 sm:h-12 sm:text-base"
          >
            <CustomIcon
              src="/icons/download.svg"
              size={16}
              className="size-4 text-white"
            />
            <span>{t("actions.downloadContract")}</span>
          </Button>

          {canCopy ? (
            <CopyButton
              value={request.request_number}
              label={copyLabel}
              className="h-11 shrink-0 gap-1.5 rounded-full border border-[#d7e0e3] bg-white px-3 text-xs font-semibold text-black sm:h-12 sm:px-4 sm:text-sm"
            >
              <span className="hidden sm:inline">{copyLabel}</span>
              <CustomIcon src="/icons/copy.svg" size={14} className="size-3.5" />
            </CopyButton>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-3">
          <Button
            type="button"
            onClick={handlePrimaryAction}
            disabled={trackMutation.isPending}
            className={cn(
              "h-11 flex-1 gap-2 rounded-full text-sm font-bold shadow-none sm:h-12 sm:text-base",
              getPrimaryButtonClass(primaryType, request.status),
            )}
          >
            {trackMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <CustomIcon
                src="/icons/arrows.svg"
                width={24}
                height={14}
                className="shrink-0 text-white ltr:rotate-180"
              />
            )}
            <span>{primaryLabel}</span>
            <CustomIcon
              src="/icons/arrows.svg"
              width={24}
              height={14}
              className="shrink-0 text-white rtl:rotate-180"
            />
          </Button>

          {canCopy ? (
            <CopyButton
              value={request.request_number}
              label={copyLabel}
              className="h-11 shrink-0 gap-1.5 rounded-full border border-[#d7e0e3] bg-white px-3 text-xs font-semibold text-black sm:h-12 sm:px-4 sm:text-sm"
            >
              <span className="hidden sm:inline">{copyLabel}</span>
              <CustomIcon src="/icons/copy.svg" size={14} className="size-3.5" />
            </CopyButton>
          ) : null}
        </div>
      )}

      <ContractPreviewDialog
        open={contractOpen}
        onOpenChange={setContractOpen}
      />
    </article>
  )
}
