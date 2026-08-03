"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { useTranslations } from "next-intl"

import CopyButton from "@/components/shared/copy-button"
import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import ContractPreviewDialog from "@/features/forms/components/contract-preview-dialog"
import type { PreviousRequest } from "@/features/forms/lib/previous-requests-demo"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const AVATAR_TONES: Record<PreviousRequest["avatarTone"], string> = {
  pink: "bg-[#f9d5e5] text-[#c2185b]",
  blue: "bg-[#d6e4ff] text-[#2f6fed]",
  indigo: "bg-[#dce4ff] text-[#3f51b5]",
}

type PreviousRequestCardProps = {
  request: PreviousRequest
}

export default function PreviousRequestCard({
  request,
}: PreviousRequestCardProps) {
  const t = useTranslations("Forms.trackOrders.previousRequests")
  const isCompleted = request.status === "completed"

  const statusConfig = {
    received: {
      label: t("status.received"),
      className: "border border-[#00A63E33] bg-[#DEFFEA] text-[#00A63E]",
      icon: "/icons/tick-circle.svg",
    },
    awaiting_payment: {
      label: t("status.awaitingPayment"),
      className: "bg-[#e8f4f8] text-primary",
      icon: "/icons/empty-wallet-time.svg",
    },
    sent_for_auth: {
      label: t("status.sentForAuth"),
      className: "border border-[#155DFC33] bg-[#E2EBFF] text-[#155DFC]",
      icon: "/icons/frame.svg",
    },
    processed: {
      label: t("status.processed"),
      className: "border border-[#00A63E33] bg-[#DEFFEA] text-[#00A63E]",
      icon: "/icons/chart.svg",
    },
    completed: {
      label: t("status.completed"),
      className: "border border-[#00A63E33] bg-[#DEFFEA] text-[#00A63E]",
      icon: "/icons/receipt-2.svg",
    },
    cancelled: {
      label: t("status.cancelled"),
      className: "border border-[#FFB39C] bg-[#FFDCD2] text-[#FF3C00]",
      icon: "/icons/information.svg",
    },
    refund_requested: {
      label: t("status.refundRequested"),
      className: "border border-[#FFB39C] bg-[#FFDCD2] text-[#FF3C00]",
      icon: "/icons/information.svg",
    },
  }[request.status]

  const trackAction = {
    label: t("actions.trackRequest"),
    href: `/track-orders/${request.requestNumber}`,
    className: "bg-primary text-white hover:bg-primary/90",
  }

  const viewRequestAction = {
    label: t("actions.viewRequest"),
    href: `/track-orders/${request.requestNumber}`,
    className: "bg-primary text-white hover:bg-primary/90",
  }

  const action = {
    received: trackAction,
    awaiting_payment: {
      label: t("actions.completePayment"),
      href: `/track-orders/${request.requestNumber}/payment`,
      className: "bg-black text-white hover:bg-black/90",
    },
    sent_for_auth: trackAction,
    processed: trackAction,
    completed: {
      label: t("actions.viewContract"),
      href: `/track-orders/${request.requestNumber}/completed`,
      className: "bg-custom-green text-white hover:bg-custom-green/90",
    },
    cancelled: viewRequestAction,
    refund_requested: viewRequestAction,
  }[request.status]

  const [contractOpen, setContractOpen] = useState(false)

  function handleDownloadContract() {
    setContractOpen(true)
  }

  return (
    <article className="rounded-2xl border border-primary/10 bg-[#F9F9F9] p-4 sm:rounded-3xl sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="font-clash text-base font-bold tabular-nums text-black sm:text-lg">
            {request.requestNumber}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(`delivery.${request.delivery}`)}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold",
            statusConfig.className,
          )}
        >
          <span
            className="size-1.5 shrink-0 rounded-full bg-current"
            aria-hidden="true"
          />
          <CustomIcon
            src={statusConfig.icon}
            size={16}
            className="size-4"
          />
          {statusConfig.label}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full text-base font-bold sm:size-14 sm:text-lg",
              AVATAR_TONES[request.avatarTone],
            )}
            aria-hidden="true"
          >
            {request.workerInitial}
          </span>
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-semibold text-black sm:text-base">
              {request.workerName}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(`services.${request.serviceKey}`)}
            </p>
          </div>
        </div>

        <p className="flex shrink-0 items-center gap-1.5 font-clash text-2xl text-muted-foreground">
          <CustomIcon
            src="/icons/calendar-tick.svg"
            size={16}
            className="size-4"
          />
          <span>{t(`dates.${request.dateKey}`)}</span>
        </p>
      </div>

      {isCompleted ? (
        <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            asChild
            className="h-11 flex-1 gap-2 rounded-full bg-primary px-3 text-sm font-bold text-white shadow-none hover:bg-primary/90 sm:h-12 sm:text-base"
          >
            <Link href={`/track-orders/${request.requestNumber}/completed`}>
              <Eye className="size-4 shrink-0" aria-hidden="true" />
              <span>{t("actions.viewInvoice")}</span>
            </Link>
          </Button>

          <Button
            type="button"
            onClick={handleDownloadContract}
            className="h-11 flex-1 gap-2 rounded-full bg-black px-3 text-sm font-bold text-white shadow-none hover:bg-black/90 sm:h-12 sm:text-base"
          >
            <CustomIcon
              src="/icons/download.svg"
              size={16}
              className="size-4 text-white"
            />
            <span>{t("actions.downloadContract")}</span>
          </Button>

          <CopyButton
            value={request.requestNumber}
            label={t("actions.copyNumber")}
            className="h-11 shrink-0 gap-1.5 rounded-full border border-[#d7e0e3] bg-white px-3 text-xs font-semibold text-black sm:h-12 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">{t("actions.copyNumber")}</span>
            <CustomIcon src="/icons/copy.svg" size={14} className="size-3.5" />
          </CopyButton>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-3">
          <Button
            asChild
            className={cn(
              "h-11 flex-1 gap-2 rounded-full text-sm font-bold shadow-none sm:h-12 sm:text-base",
              action.className,
            )}
          >
            <Link href={action.href}>
              <CustomIcon
                src="/icons/arrows.svg"
                width={24}
                height={14}
                className="shrink-0 text-white ltr:rotate-180"
              />
              <span>{action.label}</span>
              <CustomIcon
                src="/icons/arrows.svg"
                width={24}
                height={14}
                className="shrink-0 text-white rtl:rotate-180"
              />
            </Link>
          </Button>

          <CopyButton
            value={request.requestNumber}
            label={t("actions.copyNumber")}
            className="h-11 shrink-0 gap-1.5 rounded-full border border-[#d7e0e3] bg-white px-3 text-xs font-semibold text-black sm:h-12 sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">{t("actions.copyNumber")}</span>
            <CustomIcon src="/icons/copy.svg" size={14} className="size-3.5" />
          </CopyButton>
        </div>
      )}

      <ContractPreviewDialog
        open={contractOpen}
        onOpenChange={setContractOpen}
      />
    </article>
  )
}
