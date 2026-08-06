"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import ContractPreviewDialog from "@/features/forms/components/contract-preview-dialog"
import TrackOrderStageItem from "@/features/forms/components/track-order-stage-item"
import { useTrackOrderCancellation } from "@/features/forms/hooks/use-track-order-cancellation"
import { useTrackOrderPayment } from "@/features/forms/hooks/use-track-order-payment"
import {
  getApiLineFill,
  mapApiTimelineToStages,
} from "@/features/forms/lib/map-track-order-timeline"
import {
  getCancelledTrackOrderStages,
  type TrackOrderStageStatus,
} from "@/features/forms/lib/track-order-stages"
import {
  getTrackOrderContractUrl,
  getTrackOrderInvoiceUrl,
  isTrackOrderCompleted,
  type TrackOrderData,
} from "@/features/forms/services/track-order"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type TrackOrderStagesProps = {
  requestNumber?: string
  trackData: TrackOrderData
  className?: string
}

function getStatusLabelKey(status: TrackOrderStageStatus) {
  if (status === "completed") return "completed"
  if (status === "in_progress") return "inProgress"
  if (status === "cancelled") return "cancelled"
  return "upcoming"
}

function openAssetUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer")
}

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
}

export default function TrackOrderStages({
  requestNumber,
  trackData,
  className,
}: TrackOrderStagesProps) {
  const t = useTranslations("Forms.trackOrders.detail.stages")
  const tCompleted = useTranslations(
    "Forms.trackOrders.detail.completedResult",
  )
  const router = useRouter()
  const { isCancelled, cancelledAt } = useTrackOrderCancellation(requestNumber)
  const { isPaid } = useTrackOrderPayment(requestNumber)
  const [contractOpen, setContractOpen] = useState(false)
  const [now] = useState(() => new Date())

  const apiStages = mapApiTimelineToStages(trackData)
  const contractUrl = getTrackOrderContractUrl(trackData)
  const invoiceUrl = getTrackOrderInvoiceUrl(trackData)
  const requestCompleted = isTrackOrderCompleted(trackData)
  const canPay = trackData.actions?.can_pay ?? true
  const canDownloadContract =
    Boolean(contractUrl) && (trackData.actions?.can_download_contract ?? true)
  const canDownloadInvoice =
    Boolean(invoiceUrl) && (trackData.actions?.can_download_invoice ?? true)

  const hasApiCancelled =
    trackData.status === "cancelled" ||
    trackData.timeline.some(
      (stage) => stage.key === "cancelled" || stage.state === "cancelled",
    )

  const cancelledStages =
    !hasApiCancelled && isCancelled && cancelledAt
      ? getCancelledTrackOrderStages(cancelledAt).map((stage, index) => ({
          key: stage.key,
          status: stage.status,
          statusLabel: t(`statuses.${getStatusLabelKey(stage.status)}`),
          title: t(`items.${stage.key}.title`),
          description: t(`items.${stage.key}.description`),
          completedAt: stage.completedAt,
          marker: stage.marker,
          index,
        }))
      : null

  const stages = cancelledStages ?? apiStages

  function handlePaymentClick() {
    if (!requestNumber) return
    router.push(`/track-orders/${encodeURIComponent(requestNumber)}/payment`)
  }

  function handleDownloadContract() {
    setContractOpen(true)
  }

  function handleDownloadInvoice() {
    if (invoiceUrl) {
      openAssetUrl(invoiceUrl)
      toast.success(t("items.completed.downloadStarted"))
      return
    }
    toast.error(tCompleted("invoice.unavailable"))
  }

  return (
    <section
      className={cn(
        "rounded-[28px] border bg-white p-6 sm:rounded-[32px] sm:p-8",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <CustomIcon
          src="/icons/bars.svg"
          size={20}
          className="size-5 text-primary"
        />
        <h2 className="text-base font-bold text-primary sm:text-lg">
          {trackData.timeline_title || t("title")}
        </h2>
      </div>

      <motion.ol
        key={isCancelled ? "cancelled" : `api-${trackData.id}`}
        className="mt-6 ms-2 sm:ms-6"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {stages.map((stage, index) => {
          const isPaymentAction =
            stage.key === "payment" &&
            stage.status === "in_progress" &&
            !isPaid &&
            canPay
          const isCompletedDownloads =
            stage.key === "completed" &&
            stage.status === "completed" &&
            (canDownloadContract || canDownloadInvoice || Boolean(contractUrl))

          const statusLabel =
            "statusLabel" in stage && stage.statusLabel
              ? stage.statusLabel
              : t(`statuses.${getStatusLabelKey(stage.status)}`)

          return (
            <TrackOrderStageItem
              key={`${stage.key}-${index}`}
              index={index}
              status={stage.status}
              statusLabel={statusLabel}
              title={stage.title}
              description={stage.description}
              completedAt={stage.completedAt}
              now={now}
              marker={stage.marker}
              actionLabel={
                isPaymentAction ? t("items.payment.action") : undefined
              }
              onActionClick={isPaymentAction ? handlePaymentClick : undefined}
              downloadActions={
                isCompletedDownloads
                  ? {
                      contractLabel: t("items.completed.downloadContract"),
                      invoiceLabel: t("items.completed.downloadInvoice"),
                      onDownloadContract: handleDownloadContract,
                      onDownloadInvoice: handleDownloadInvoice,
                      showContract: canDownloadContract || Boolean(contractUrl),
                      showInvoice: canDownloadInvoice,
                    }
                  : undefined
              }
              lineFill={
                isCancelled
                  ? 0
                  : requestCompleted && index < apiStages.length - 1
                    ? 1
                    : getApiLineFill(index, apiStages)
              }
              isLast={index === stages.length - 1}
            />
          )
        })}
      </motion.ol>

      <ContractPreviewDialog
        open={contractOpen}
        onOpenChange={setContractOpen}
        pdfUrl={contractUrl}
      />
    </section>
  )
}
