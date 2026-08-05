import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import SignaturePartiesView from "@/features/forms/components/signature-parties-view"

type SignaturePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function parseOrderId(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export default async function SignaturePage({
  searchParams,
}: SignaturePageProps) {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms.signature")
  const { orderId } = await searchParams

  return (
    <div className="container py-6 md:py-8">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumb") },
        ]}
      />

      <div className="mt-8 pb-10 sm:mt-10 sm:pb-12">
        <SignaturePartiesView orderId={parseOrderId(orderId)} />
      </div>
    </div>
  )
}
