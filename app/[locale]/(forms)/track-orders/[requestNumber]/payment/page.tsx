import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import PaymentFlow from "@/features/forms/components/payment-flow"

type TrackOrderPaymentPageProps = {
  params: Promise<{ requestNumber: string }>
}

export default async function TrackOrderPaymentPage({
  params,
}: TrackOrderPaymentPageProps) {
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
            label: t("breadcrumbs.trackOrders.inquiry"),
            href: "/track-orders",
          },
          {
            label: t("breadcrumbs.trackOrders.detail"),
            href: `/track-orders/${encodeURIComponent(requestNumber)}`,
          },
          { label: t("trackOrders.detail.payment.breadcrumb") },
        ]}
      />

      <div className="mt-8 pb-10">
        <PaymentFlow requestNumber={requestNumber} />
      </div>
    </div>
  )
}
