import { getLocale, getTranslations } from "next-intl/server"

import FaqContent from "@/features/landing/components/faq-content"
import {
  getFaqContent,
  getFallbackFaqs,
} from "@/features/landing/services/faq"

export default async function Faq() {
  const t = await getTranslations("Faq")
  const locale = await getLocale()

  const faq = await getFaqContent(locale, {
    eyebrow: t("eyebrow"),
    description: t("description"),
    items: getFallbackFaqs(locale),
  })

  return (
    <FaqContent
      eyebrow={faq.eyebrow}
      titleHtml={faq.titleHtml}
      titleFallback={t.rich("heading", {
        primary: (chunks) => (
          <span className="mt-1 block text-primary">{chunks}</span>
        ),
      })}
      description={faq.description}
      items={faq.items ?? []}
    />
  )
}
