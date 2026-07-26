import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import RenewalPrerequisitesCard from "@/features/forms/components/renewal-prerequisites-card"

export default async function RenewalPage() {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms")

  return (
    <div className="container py-6">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs.renewal.section") },
        ]}
      />

      <div className="mt-8 pb-10 sm:mt-10 sm:pb-16">
        <RenewalPrerequisitesCard />
      </div>
    </div>
  )
}
