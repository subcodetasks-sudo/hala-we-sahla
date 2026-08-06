import { getLocale, getTranslations } from "next-intl/server"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"

import TermsContentSection from "@/features/terms/components/terms-content-view"
import TermsHeaderView from "@/features/terms/components/terms-header-view"
import {
  getTermsContent,
  type TermsSectionView,
} from "@/features/terms/services/terms"

const SECTION_KEYS = [
  "acceptance",
  "responsibilities",
  "dataAccuracy",
  "payment",
  "cancellation",
  "tracking",
  "intellectualProperty",
] as const

const RESPONSIBILITY_ITEM_KEYS = [
  "accurateInfo",
  "lawfulUse",
  "accountSecurity",
  "compliance",
] as const

const SECTIONS_WITH_NOTES = new Set([
  "acceptance",
  "dataAccuracy",
  "cancellation",
])

const LAST_UPDATED_AT = new Date(2026, 5, 1)

async function buildFallbackSections(
  t: (key: string) => string,
): Promise<TermsSectionView[]> {
  return SECTION_KEYS.map((key) => {
    const items =
      key === "responsibilities"
        ? RESPONSIBILITY_ITEM_KEYS.map((itemKey) =>
            t(`sections.responsibilities.items.${itemKey}`),
          )
        : undefined

    return {
      id: key,
      title: t(`sections.${key}.title`),
      subtitle: t(`sections.${key}.subtitle`),
      body: t(`sections.${key}.body`),
      items,
      note: SECTIONS_WITH_NOTES.has(key)
        ? t(`sections.${key}.note`)
        : undefined,
    }
  })
}

export default async function TermsPage() {
  const locale = await getLocale()
  const t = await getTranslations("Terms")
  const tCommon = await getTranslations("Common")
  const tFooter = await getTranslations("Footer")

  const fallbackSections = await buildFallbackSections(t)

  const terms = await getTermsContent(locale, {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),
    sections: fallbackSections,
  })

  const lastUpdatedDate = format(LAST_UPDATED_AT, "MMMM yyyy", {
    locale: locale === "ar" ? ar : enUS,
  })

  return (
    <>
      <TermsHeaderView
        breadcrumbHome={tCommon("home")}
        breadcrumbCurrent={tFooter("legal.terms")}
        lastUpdatedLabel={t("lastUpdated", { date: lastUpdatedDate })}
        terms={terms}
      />
      <TermsContentSection terms={terms} tocTitle={t("tocTitle")} />
    </>
  )
}
