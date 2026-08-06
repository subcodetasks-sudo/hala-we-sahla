import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { getLocale, getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import RenewalWizard from "@/features/forms/components/renewal-wizard"
import { citiesQueryOptions } from "@/features/forms/services/cities"
import {
  EMPLOYER_PASSPORT_ISSUE_COUNTRY,
  WORKER_PASSPORT_ISSUE_COUNTRY,
  passportIssuePlacesQueryOptions,
} from "@/features/forms/services/passport-issue-places"
import { plansQueryOptions } from "@/features/landing/services/plans"
import { settingsQueryOptions } from "@/features/landing/services/settings"

export default async function CreateRenewalPage() {
  const tCommon = await getTranslations("Common")
  const tForms = await getTranslations("Forms")
  const locale = await getLocale()

  const queryClient = new QueryClient()
  await Promise.all([
    queryClient.prefetchQuery(citiesQueryOptions(locale)),
    queryClient.prefetchQuery(
      passportIssuePlacesQueryOptions(locale, EMPLOYER_PASSPORT_ISSUE_COUNTRY),
    ),
    queryClient.prefetchQuery(
      passportIssuePlacesQueryOptions(locale, WORKER_PASSPORT_ISSUE_COUNTRY),
    ),
    queryClient.prefetchQuery(plansQueryOptions(locale)),
    queryClient.prefetchQuery(settingsQueryOptions(locale)),
  ])

  return (
    <div className="container py-6">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: tForms("breadcrumbs.renewal.section"), href: "/renewal" },
          { label: tForms("breadcrumbs.renewal.current") },
        ]}
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <RenewalWizard />
      </HydrationBoundary>
    </div>
  )
}
