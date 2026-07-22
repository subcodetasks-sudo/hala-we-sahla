import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"

export default async function RenewalPage() {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms")

  return (
    <div className="container py-6 md:py-8">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs.renewal.section"), href: "/renewal" },
          { label: t("breadcrumbs.renewal.current") },
        ]}
      />
    </div>
  )
}
