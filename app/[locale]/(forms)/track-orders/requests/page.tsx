import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import PreviousRequestsView from "@/features/forms/components/previous-requests-view"
import TrackOrderWhatsappFab from "@/features/forms/components/track-order-whatsapp-fab"

export default async function PreviousRequestsPage() {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms")

  return (
    <div className="container py-6 md:py-8">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          {
            label: t("breadcrumbs.trackOrders.detail"),
            href: "/track-orders",
          },
          { label: t("breadcrumbs.trackOrders.inquiry") },
        ]}
      />

      <div className="mt-8 pb-10 sm:mt-10 sm:pb-12">
        <PreviousRequestsView />
      </div>

      <TrackOrderWhatsappFab />
    </div>
  )
}
