import { getTranslations } from "next-intl/server"

import TermsSectionCard from "@/features/landing/components/terms-section-card"
import TermsSidebar from "@/features/landing/components/terms-sidebar"

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

export default async function PrivacyContent() {
  const t = await getTranslations("Privacy")

  const sidebarItems = SECTION_KEYS.map((key) => ({
    id: key,
    label: t(`sections.${key}.title`),
  }))

  return (
    <div className="bg-primary/20 py-16">
      <section className="container">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-8">
          <div className="flex flex-col gap-4 md:gap-5">
            {SECTION_KEYS.map((key, index) => {
              const items =
                key === "dataProtection"
                  ? DATA_PROTECTION_ITEM_KEYS.map((itemKey) =>
                      t(`sections.dataProtection.items.${itemKey}`),
                    )
                  : undefined

              return (
                <TermsSectionCard
                  key={key}
                  id={key}
                  number={String(index + 1).padStart(2, "0")}
                  title={t(`sections.${key}.title`)}
                  subtitle={t(`sections.${key}.subtitle`)}
                  body={t(`sections.${key}.body`)}
                  items={items}
                  note={
                    SECTIONS_WITH_NOTES.has(key)
                      ? t(`sections.${key}.note`)
                      : undefined
                  }
                />
              )
            })}
          </div>

          <aside className="order-first lg:sticky lg:top-28 lg:order-0 lg:self-start">
            <TermsSidebar title={t("tocTitle")} items={sidebarItems} />
          </aside>
        </div>
      </section>
    </div>
  )
}
