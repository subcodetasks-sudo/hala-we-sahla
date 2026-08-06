import { getLocale, getTranslations } from "next-intl/server"

import HeroContent from "@/features/landing/components/hero-content"
import { getHeroContent } from "@/features/landing/services/hero"

export default async function Hero() {
  const t = await getTranslations("Hero")
  const locale = await getLocale()

  const hero = await getHeroContent(locale, {
    badge: t("badge"),
    description: t("description"),
    imageSrc: "/landing/hero.svg",
    imageAlt: t("imageAlt"),
  })

  return (
    <HeroContent
      badge={hero.badge}
      titleHtml={hero.titleHtml}
      titleFallback={t.rich("heading", {
        primary: (chunks) => <span className="text-primary">{chunks}</span>,
      })}
      descriptionHtml={hero.descriptionHtml}
      descriptionText={hero.descriptionText}
      primaryCta={t("primaryCta")}
      secondaryCta={t("secondaryCta")}
      imageSrc={hero.imageSrc}
      imageAlt={hero.imageAlt}
    />
  )
}
