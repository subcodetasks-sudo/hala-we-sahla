import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import RenewalPrerequisitesCard from "@/features/forms/components/renewal-prerequisites-card"

export default async function RenewalPage() {
  const tCommon = await getTranslations("Common")
  const t = await getTranslations("Forms")

  return (
    <div className="container py-3 sm:py-4">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs.renewal.section") },
        ]}
      />

      <div className="fit-viewport mt-4 sm:mt-5">
        <RenewalPrerequisitesCard />
      </div>
    </div>
  )
}
