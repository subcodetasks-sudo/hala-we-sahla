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

      <div className="mt-5 pb-8 sm:mt-8 sm:pb-12 md:mt-10 md:pb-16">
        <RenewalPrerequisitesCard />
      </div>
    </div>
  )
}
