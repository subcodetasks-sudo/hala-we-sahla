import { getLocale, getTranslations } from "next-intl/server"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"

import PrivacyContentSection from "@/features/privacy/components/privacy-content-view"
import PrivacyHeaderView from "@/features/privacy/components/privacy-header-view"
import {
  getPrivacyContent,
  type PrivacySectionView,
} from "@/features/privacy/services/privacy"

const SECTION_KEYS = [
  "introduction",
  "dataSharing",
  "dataProtection",
  "notifications",
  "cookies",
  "dataRetention",
  "contact",
] as const

const DATA_PROTECTION_ITEM_KEYS = [
  "encryption",
  "accessControl",
  "secureStorage",
  "monitoring",
] as const

const SECTIONS_WITH_NOTES = new Set([
  "introduction",
  "dataSharing",
  "dataRetention",
])

const LAST_UPDATED_AT = new Date(2026, 5, 1)

function buildFallbackSections(
  t: (key: string) => string,
): PrivacySectionView[] {
  return SECTION_KEYS.map((key) => {
    const items =
      key === "dataProtection"
        ? DATA_PROTECTION_ITEM_KEYS.map((itemKey) =>
            t(`sections.dataProtection.items.${itemKey}`),
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

export default async function PrivacyPage() {
  const locale = await getLocale()
  const t = await getTranslations("Privacy")
  const tCommon = await getTranslations("Common")
  const tFooter = await getTranslations("Footer")

  const privacy = await getPrivacyContent(locale, {
    eyebrow: t("eyebrow"),
    title: t("title"),
    description: t("description"),
    sections: buildFallbackSections(t),
  })

  const lastUpdatedDate = format(LAST_UPDATED_AT, "MMMM yyyy", {
    locale: locale === "ar" ? ar : enUS,
  })

  return (
    <>
      <PrivacyHeaderView
        breadcrumbHome={tCommon("home")}
        breadcrumbCurrent={tFooter("legal.privacy")}
        lastUpdatedLabel={t("lastUpdated", { date: lastUpdatedDate })}
        privacy={privacy}
      />
      <PrivacyContentSection
        privacy={privacy}
        tocTitle={t("tocTitle")}
      />
    </>
  )
}
