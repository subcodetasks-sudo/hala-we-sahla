import { setRequestLocale } from "next-intl/server"
import { getTranslations } from "next-intl/server"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { FormsBackProvider } from "@/features/forms/components/forms-back-provider"
import FormsFooter from "@/features/forms/components/forms-footer"
import FormsHeader from "@/features/forms/components/forms-header"
import { buildSiteSettingsFallback } from "@/features/landing/lib/site-settings-fallback"
import { plansQueryOptions } from "@/features/landing/services/plans"
import {
  getSiteSettings,
  settingsQueryOptions,
} from "@/features/landing/services/settings"

type FormsLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function FormsLayout({
  children,
  params,
}: FormsLayoutProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const tFooter = await getTranslations("Footer")
  const settings = await getSiteSettings(
    locale,
    buildSiteSettingsFallback({ description: tFooter("description") }),
  )

  const queryClient = new QueryClient()
  await Promise.all([
    queryClient.prefetchQuery(settingsQueryOptions(locale)),
    queryClient.prefetchQuery(plansQueryOptions(locale)),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <FormsBackProvider>
        <FormsHeader
          logoSrc={settings.logoSrc}
          logoAlt={tFooter("logoAlt")}
        />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <main className="flex-1">{children}</main>
        </HydrationBoundary>
        <FormsFooter settings={settings} />
      </FormsBackProvider>
    </div>
  )
}
