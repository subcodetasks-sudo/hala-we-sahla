"use client"

import type { ReactNode } from "react"

import TrackOrderCancelAction from "@/features/forms/components/track-order-cancel-action"
import TrackOrderDetailHeader from "@/features/forms/components/track-order-detail-header"
import TrackOrderStages from "@/features/forms/components/track-order-stages"
import TrackOrderWhatsappFab from "@/features/forms/components/track-order-whatsapp-fab"

type TrackOrderDetailViewProps = {
  requestNumber: string
  breadcrumb: ReactNode
}

export default function TrackOrderDetailView({
  requestNumber,
  breadcrumb,
}: TrackOrderDetailViewProps) {
  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {breadcrumb}
        <TrackOrderCancelAction
          requestNumber={requestNumber}
          className="lg:ms-auto"
        />
      </div>

      <div className="mt-8 space-y-4 pb-10 sm:mt-10 sm:pb-12">
        <TrackOrderDetailHeader requestNumber={requestNumber} />
        <TrackOrderStages requestNumber={requestNumber} />
      </div>

      <TrackOrderWhatsappFab />
    </>
  )
}
