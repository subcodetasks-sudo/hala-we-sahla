import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import PaymentResultView from "@/features/forms/components/payment-result-view"

type PaymentBackPageProps = {
  searchParams: Promise<{
    invoice_id?: string
    id?: string
    request_number?: string
    provider?: string
  }>
}

export default async function PaymentBackPage({
  searchParams,
}: PaymentBackPageProps) {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms.trackOrders.detail.payment")
  const params = await searchParams

  return (
    <div className="container py-6 md:py-8">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumb") },
          { label: t("result.backBreadcrumb") },
        ]}
      />
      <div className="mt-8 pb-10">
        <PaymentResultView
          mode="failed"
          invoiceId={params.invoice_id || params.id}
          requestNumber={params.request_number}
          provider={params.provider}
        />
      </div>
    </div>
  )
}
