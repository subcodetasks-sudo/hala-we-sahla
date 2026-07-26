import { getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import RenewalWizard from "@/features/forms/components/renewal-wizard"

export default async function CreateRenewalPage() {
  const tCommon = await getTranslations("Common")
  const tForms = await getTranslations("Forms")

  return (
    <div className="container py-6">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: tForms("breadcrumbs.renewal.section"), href: "/renewal" },
          { label: tForms("breadcrumbs.renewal.current") },
        ]}
      />

      <RenewalWizard />
    </div>
  )
}
