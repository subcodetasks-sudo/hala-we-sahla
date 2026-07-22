import { getTranslations } from "next-intl/server"

import LegalSidebar from "@/components/shared/legal-sidebar"
import BlogPostCta from "@/features/blog/components/blog-post-cta"
import BlogPostSection from "@/features/blog/components/blog-post-section"

const SECTION_KEYS = [
  "whatIs",
  "beforeStart",
  "steps",
  "tracking",
  "payment",
  "receive",
] as const

const CHECKLIST_KEYS = ["id", "passport", "contract"] as const
const STEP_KEYS = [
  "employer",
  "worker",
  "documents",
  "delivery",
  "submit",
] as const

export default async function BlogPostContent() {
  const t = await getTranslations("Blog.post")

  const sidebarItems = SECTION_KEYS.map((key) => ({
    id: key,
    label: t(`sections.${key}.title`),
  }))

  return (
    <div className="bg-white py-10 md:py-14">
      <section className="container">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-8">
          <div className="flex flex-col gap-10 md:gap-12">
            {SECTION_KEYS.map((key, index) => {
              const checklist =
                key === "beforeStart"
                  ? CHECKLIST_KEYS.map((itemKey) =>
                      t(`sections.beforeStart.checklist.${itemKey}`)
                    )
                  : undefined

              const steps =
                key === "steps"
                  ? STEP_KEYS.map((itemKey) =>
                      t(`sections.steps.items.${itemKey}`)
                    )
                  : undefined

              return (
                <BlogPostSection
                  key={key}
                  id={key}
                  number={index + 1}
                  title={t(`sections.${key}.title`)}
                  body={t(`sections.${key}.body`)}
                  checklist={checklist}
                  steps={steps}
                />
              )
            })}
          </div>

          <aside className="order-first flex flex-col gap-4 lg:sticky lg:top-28 lg:order-0 lg:self-start">
            <LegalSidebar
              title={t("tocTitle")}
              items={sidebarItems}
              className="rounded-3xl border border-border/60 bg-white shadow-none"
            />
            <BlogPostCta />
          </aside>
        </div>
      </section>
    </div>
  )
}
