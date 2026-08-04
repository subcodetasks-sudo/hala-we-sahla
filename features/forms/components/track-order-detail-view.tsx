"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useTranslations } from "next-intl"

import TrackOrderCancelAction from "@/features/forms/components/track-order-cancel-action"
import TrackOrderDetailHeader from "@/features/forms/components/track-order-detail-header"
import TrackOrderStages from "@/features/forms/components/track-order-stages"
import TrackOrderWhatsappFab from "@/features/forms/components/track-order-whatsapp-fab"
import { useTrackOrderDetail } from "@/features/forms/hooks/use-track-order-detail"
import {
  getApiCurrentStageIndex,
} from "@/features/forms/lib/map-track-order-timeline"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils";

type TrackOrderDetailViewProps = {
  requestNumber: string
  breadcrumb: ReactNode
}

export default function TrackOrderDetailView({
  requestNumber,
  breadcrumb,
}: TrackOrderDetailViewProps) {
  const t = useTranslations("Forms.trackOrders")
  const router = useRouter()
  const { data, hasSession, isLoading } = useTrackOrderDetail(requestNumber)

  useEffect(() => {
    if (!hasSession && !isLoading) {
      router.replace("/track-orders")
    }
  }, [hasSession, isLoading, router])

  if (!data) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        {t("errors.sessionMissing")}
      </div>
    )
  }

  const currentStageIndex = getApiCurrentStageIndex(data)

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {breadcrumb}
        <TrackOrderCancelAction
          requestNumber={requestNumber}
          currentStageIndex={currentStageIndex}
          className={cn(data?.status === "cancelled" && "hidden", "lg:ms-auto")}
        />
      </div>

      <div className="mt-8 space-y-4 pb-10 sm:mt-10 sm:pb-12">
        <TrackOrderDetailHeader
          requestNumber={data.request_number || requestNumber}
          employerName={data.employer_name}
          workerName={data.worker_name}
        />
        <TrackOrderStages
          requestNumber={requestNumber}
          trackData={data}
        />
      </div>

      <TrackOrderWhatsappFab />
    </>
  )
}
