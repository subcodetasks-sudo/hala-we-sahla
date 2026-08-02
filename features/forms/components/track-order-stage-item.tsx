"use client"

import { AnimatePresence, motion } from "motion/react"
import { ArrowUpLeft, Clock3 } from "lucide-react"
import { useLocale } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import type { TrackOrderStageStatus } from "@/features/forms/lib/track-order-stages"
import {
  formatTrackOrderCompletedDate,
  formatTrackOrderCompletedTime,
  formatTrackOrderRelativeMinutes,
} from "@/features/forms/lib/track-order-datetime"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"



type TrackOrderDownloadActions = {
  contractLabel: string
  invoiceLabel: string
  onDownloadContract: () => void
  onDownloadInvoice: () => void
}

type TrackOrderStageItemProps = {
  status: TrackOrderStageStatus
  statusLabel: string
  title: string
  description: string
  completedAt?: Date | null
  now?: Date
  lineFill?: number
  marker?: "solid" | "ring" | "cancelled"
  actionLabel?: string
  actionHref?: string
  onActionClick?: () => void
  downloadActions?: TrackOrderDownloadActions
  isLast?: boolean
  index?: number
}

export default function TrackOrderStageItem({
  status,
  statusLabel,
  title,
  description,
  completedAt = null,
  now = new Date(),
  lineFill = 0,
  marker,
  actionLabel,
  actionHref,
  onActionClick,
  downloadActions,
  isLast = false,
  index = 0,
}: TrackOrderStageItemProps) {
  const stageItemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: index === 0 ? 0 : 0.45 + index * 0.28,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }
  const locale = useLocale()
  const isInProgress = status === "in_progress"
  const isCompleted = status === "completed"
  const isUpcoming = status === "upcoming"
  const isCancelled = status === "cancelled"
  const shouldPulse = isInProgress
  const showAction = Boolean(
    actionLabel && (actionHref || onActionClick) && !isUpcoming && !isCancelled,
  )
  const showDownloads =
    Boolean(downloadActions) && isCompleted && !isCancelled

  const showRing =
    marker === "ring" || (marker == null && isInProgress)
  const showCancelledMarker = marker === "cancelled" || isCancelled
  const showSolid =
    marker === "solid" ||
    (marker == null && isCompleted && !showCancelledMarker)

  return (
    <motion.li
      data-status={status}
      className="relative flex gap-4 sm:gap-5"
      variants={stageItemVariants}
    >
      <div className="relative flex w-6 shrink-0 flex-col items-center self-stretch sm:w-10">
        <span
          aria-hidden="true"
          className={cn(
            "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full sm:size-10",
            showRing && "border-2 border-primary bg-card",
            showSolid && "bg-primary",
            showCancelledMarker && "bg-[#FF0A0E]",
            isUpcoming &&
              !showRing &&
              !showSolid &&
              !showCancelledMarker &&
              "bg-primary/20",
          )}
        >
          {shouldPulse && showRing ? (
            <>
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
                initial={{ scale: 1, opacity: 0.45 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
                initial={{ scale: 1, opacity: 0.35 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.9,
                }}
              />
            </>
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            {showRing ? (
              <motion.span
                key="dot"
                className="relative z-10 size-2 rounded-full bg-primary sm:size-4"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  shouldPulse
                    ? {
                        scale: [1, 1.18, 1],
                        opacity: [1, 0.72, 1],
                      }
                    : { scale: 1, opacity: 1 }
                }
                exit={{ scale: 0, opacity: 0 }}
                transition={
                  shouldPulse
                    ? {
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.2 }
                }
              />
            ) : null}
            {showSolid ? (
              <motion.span
                key="fill"
                className="absolute inset-0 rounded-full bg-primary"
                initial={{ scale: 0.35, opacity: 0.4 }}
                animate={{ scale: [0.35, 1.18, 1], opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            ) : null}
            {showCancelledMarker ? (
              <motion.span
                key="cancelled"
                className="relative z-10 flex items-center justify-center"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
              >
                <CustomIcon
                  src="/icons/shield-cross.svg"
                  size={20}
                  className="size-3.5 text-white sm:size-4"
                />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>

        {!isLast ? (
          <span
            aria-hidden="true"
            className="relative mt-2 mb-2 w-px min-h-6 flex-1 overflow-hidden rounded-full bg-[#d7e0e3]"
          >
            <motion.span
              className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-primary"
              initial={false}
              animate={{ scaleY: lineFill }}
              transition={{ duration: 0.12, ease: "linear" }}
            />
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "min-w-0 flex-1 pt-0.5",
          !isLast && "pb-8 sm:pb-10",
        )}
      >
        <motion.p
          key={status}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.08 }}
          className={cn(
            "text-xs font-medium",
            isInProgress && "text-accent",
            isCompleted && (marker === "ring" ? "text-accent" : "text-primary"),
            isCancelled && "text-[#FF0A0E]",
            isUpcoming && "text-muted-foreground",
          )}
        >
          {statusLabel}
        </motion.p>
        <h3
          className={cn(
            "mt-1 text-sm font-bold transition-colors duration-300 sm:text-base",
            isCancelled && "text-[#FF0A0E]",
            isUpcoming && "text-[#5b7380]",
            !isCancelled && !isUpcoming && "text-[#1a3d4d]",
          )}
        >
          {title}
        </h3>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="min-w-0 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
            {description}
          </p>

          {showAction ? (
            onActionClick ? (
              <Button
                type="button"
                onClick={onActionClick}
                className="h-10 shrink-0 gap-2 rounded-full px-5 text-sm font-semibold"
              >
                {actionLabel}
                <ArrowUpLeft
                  className="size-4 ltr:rotate-180"
                  aria-hidden="true"
                />
              </Button>
            ) : (
              <Button
                asChild
                className="h-10 shrink-0 gap-2 rounded-full px-5 text-sm font-semibold"
              >
                <Link href={actionHref!}>
                  {actionLabel}
                  <ArrowUpLeft
                    className="size-4 ltr:rotate-180"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            )
          ) : null}

          {showDownloads && downloadActions ? (
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                type="button"
                onClick={downloadActions.onDownloadContract}
                className="h-10 gap-2 rounded-full px-4 text-sm font-semibold sm:px-5"
              >
                <CustomIcon
                  src="/icons/download.svg"
                  size={18}
                  className="size-4.5 text-current"
                />
                {downloadActions.contractLabel}
              </Button>
              <Button
                type="button"
                onClick={downloadActions.onDownloadInvoice}
                className="h-10 gap-2 rounded-full bg-[#003143] px-4 text-sm font-semibold text-white hover:bg-[#003143]/90 sm:px-5"
              >
                <CustomIcon
                  src="/icons/download.svg"
                  size={18}
                  className="size-4.5 text-current"
                />
                {downloadActions.invoiceLabel}
              </Button>
            </div>
          ) : null}
        </div>

        <AnimatePresence initial={false}>
          {isCancelled && completedAt ? (
            <motion.div
              key="cancelled-meta"
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-2 overflow-hidden"
            >
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
                <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
                {formatTrackOrderCompletedDate(completedAt, locale)}
              </p>
            </motion.div>
          ) : null}

          {isCompleted && completedAt ? (
            <motion.div
              key="completed-meta"
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mt-2 space-y-0.5 overflow-hidden"
            >
              <p className="text-xs font-medium text-[#4b626d] sm:text-sm">
                {formatTrackOrderCompletedDate(completedAt, locale)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTrackOrderCompletedTime(completedAt, locale)}
                {" - "}
                {formatTrackOrderRelativeMinutes(completedAt, now, locale)}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.li>
  )
}
