import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import PaymentResultView from "@/features/forms/components/payment-result-view"
import { PAYMENT_PROVIDER } from "@/features/forms/services/payment"

type PaymentStatusPageProps = {
  params: Promise<{ invoiceId: string }>
  searchParams: Promise<{ provider?: string; request_number?: string }>
}

export default async function PaymentStatusPage({
  params,
  searchParams,
}: PaymentStatusPageProps) {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms.trackOrders.detail.payment")
  const { invoiceId: rawInvoiceId } = await params
  const { provider, request_number } = await searchParams
  const invoiceId = decodeURIComponent(rawInvoiceId)

  return (
    <div className="container py-6 md:py-8">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumb") },
          { label: t("result.breadcrumb") },
        ]}
      />
      <div className="mt-8 pb-10">
        <PaymentResultView
          mode="status"
          invoiceId={invoiceId}
          requestNumber={request_number}
          provider={provider || PAYMENT_PROVIDER}
        />
      </div>
    </div>
  )
}
