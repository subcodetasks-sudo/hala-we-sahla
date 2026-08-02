import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import TrackOrderCompleted from "@/features/forms/components/track-order-completed"

type TrackOrderCompletedPageProps = {
  params: Promise<{ requestNumber: string }>
}

export default async function TrackOrderCompletedPage({
  params,
}: TrackOrderCompletedPageProps) {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms")
  const { requestNumber: rawRequestNumber } = await params
  const requestNumber = decodeURIComponent(rawRequestNumber)

  return (
    <div className="container py-6 md:py-8">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          {
            label: t("breadcrumbs.trackOrders.detail"),
            href: "/track-orders",
          },
          { label: t("trackOrders.detail.completedResult.breadcrumb") },
        ]}
      />

      <div className="mt-8 pb-10 sm:mt-10 sm:pb-12">
        <TrackOrderCompleted requestNumber={requestNumber} />
      </div>
    </div>
  )
}
