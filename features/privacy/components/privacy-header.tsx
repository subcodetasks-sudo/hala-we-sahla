import { getLocale, getTranslations } from "next-intl/server"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { Clock } from "lucide-react"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"

const LAST_UPDATED_AT = new Date(2026, 5, 1)

export default async function PrivacyHeader() {
  const locale = await getLocale()
  const t = await getTranslations("Privacy")
  const tCommon = await getTranslations("Common")
  const tFooter = await getTranslations("Footer")

  const lastUpdatedDate = format(LAST_UPDATED_AT, "MMMM yyyy", {
    locale: locale === "ar" ? ar : enUS,
  })

  return (
    <header className="container py-6 md:py-10">
      <BreadcrumbNav
        items={[
          { label: tCommon("home"), href: "/" },
          { label: tFooter("legal.privacy") },
        ]}
      />

      <div className="mt-8 max-w-2xl md:mt-10">
        <p className="text-sm font-semibold text-accent">{t("eyebrow")}</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          {t("title")}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("description")}
        </p>

        <p className="mt-5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4 shrink-0" aria-hidden="true" />
          <span>{t("lastUpdated", { date: lastUpdatedDate })}</span>
        </p>
      </div>
    </header>
  )
}
