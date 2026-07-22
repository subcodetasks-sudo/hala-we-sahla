import { getTranslations } from "next-intl/server"

import TermsSectionCard from "@/features/landing/components/terms-section-card"
import TermsSidebar from "@/features/landing/components/terms-sidebar"

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

export default async function TermsContent() {
  const t = await getTranslations("Terms")

  const sidebarItems = SECTION_KEYS.map((key) => ({
    id: key,
    label: t(`sections.${key}.title`),
  }))

  return (
    <section className="container pb-12 md:pb-16">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-8">
        <div className="flex flex-col gap-4 md:gap-5">
          {SECTION_KEYS.map((key, index) => {
            const items =
              key === "responsibilities"
                ? RESPONSIBILITY_ITEM_KEYS.map((itemKey) =>
                    t(`sections.responsibilities.items.${itemKey}`),
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
  )
}
