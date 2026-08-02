import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import TrackOrderDetailView from "@/features/forms/components/track-order-detail-view"

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

  const breadcrumb = (
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
  )

  return (
    <div className="container py-6 md:py-8">
      <TrackOrderDetailView
        requestNumber={requestNumber}
        breadcrumb={breadcrumb}
      />
    </div>
  )
}
