"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import TrackOrderStageItem from "@/features/forms/components/track-order-stage-item"
import { useTrackOrderCancellation } from "@/features/forms/hooks/use-track-order-cancellation"
import { useTrackOrderPayment } from "@/features/forms/hooks/use-track-order-payment"
import { useTrackOrderTimeline } from "@/features/forms/hooks/use-track-order-timeline"
import {
  getCancelledTrackOrderStages,
  getTrackOrderLineFill,
  getTrackOrderStages,
  TRACK_ORDER_CURRENT_STAGE_INDEX,
  type TrackOrderStageStatus,
} from "@/features/forms/lib/track-order-stages"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

type TrackOrderStagesProps = {
  initialStageIndex?: number
  requestNumber?: string
  className?: string
}

function getStatusLabelKey(status: TrackOrderStageStatus) {
  if (status === "completed") return "completed"
  if (status === "in_progress") return "inProgress"
  if (status === "cancelled") return "cancelled"
  return "upcoming"
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
  initialStageIndex = TRACK_ORDER_CURRENT_STAGE_INDEX,
  requestNumber,
  className,
}: TrackOrderStagesProps) {
  const t = useTranslations("Forms.trackOrders.detail.stages")
  const router = useRouter()
  const { isCancelled, cancelledAt } = useTrackOrderCancellation(requestNumber)
  const { isPaid, paidAt } = useTrackOrderPayment(requestNumber)
  const timeline = useTrackOrderTimeline(
    initialStageIndex,
    requestNumber
      ? `hala-track-order-stages-started-at:${requestNumber}`
      : undefined,
    { isPaid, paidAt },
  )

  const stages =
    isCancelled && cancelledAt
      ? getCancelledTrackOrderStages(cancelledAt)
      : getTrackOrderStages(
          timeline.currentStageIndex,
          timeline.completedAtByIndex,
        )

  function handlePaymentClick() {
    if (!requestNumber) return
    router.push(`/track-orders/${encodeURIComponent(requestNumber)}/payment`)
  }

  function handleDownload() {
    toast.success(t("items.completed.downloadStarted"))
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
          {t("title")}
        </h2>
      </div>

      <motion.ol
        className="mt-6 ms-2 sm:ms-6"
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {stages.map((stage, index) => {
          const isPaymentAction =
            stage.key === "payment" && stage.status === "in_progress" && !isPaid
          const isCompletedDownloads =
            stage.key === "completed" && stage.status === "completed"

          return (
            <TrackOrderStageItem
              key={stage.key}
              index={index}
              status={stage.status}
              statusLabel={t(`statuses.${getStatusLabelKey(stage.status)}`)}
              title={t(`items.${stage.key}.title`)}
              description={t(`items.${stage.key}.description`)}
              completedAt={stage.completedAt}
              now={timeline.now}
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
                      onDownloadContract: handleDownload,
                      onDownloadInvoice: handleDownload,
                    }
                  : undefined
              }
              lineFill={
                isCancelled
                  ? 0
                  : getTrackOrderLineFill(
                      index,
                      timeline.currentStageIndex,
                      timeline.intervalProgress,
                    )
              }
              isLast={index === stages.length - 1}
            />
          )
        })}
      </motion.ol>
    </section>
  )
}
