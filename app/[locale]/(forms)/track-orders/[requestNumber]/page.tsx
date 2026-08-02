import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import TrackOrderCancelAction from "@/features/forms/components/track-order-cancel-action"
import TrackOrderDetailHeader from "@/features/forms/components/track-order-detail-header"
import TrackOrderStages from "@/features/forms/components/track-order-stages"
import TrackOrderWhatsappFab from "@/features/forms/components/track-order-whatsapp-fab"

type TrackOrderDetailPageProps = {
  params: Promise<{ requestNumber: string }>
}

export default async function TrackOrderDetailPage({
  params,
}: TrackOrderDetailPageProps) {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms")
  const { requestNumber: rawRequestNumber } = await params
  const requestNumber = decodeURIComponent(rawRequestNumber)

  return (
    <div className="container py-6 md:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <BreadcrumbNav
          items={[
            { label: tCommon("home"), href: "/" },
            {
              label: t("breadcrumbs.trackOrders.inquiry"),
              href: "/track-orders",
            },
            { label: t("breadcrumbs.trackOrders.detail") },
          ]}
        />
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
    </div>
  )
}
