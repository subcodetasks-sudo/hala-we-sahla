import { getLocale, getTranslations } from "next-intl/server"

import ServicesContent from "@/features/landing/components/services-content"
import {
  getServicesContent,
  type ServiceItemView,
} from "@/features/landing/services/services"

const FALLBACK_META = [
  {
    key: "request" as const,
    href: "/renewal",
    icon: "/icons/receipt-edit.svg",
    image: "/landing/servcies-1.svg",
    tone: "primary" as const,
    imageFirst: false,
  },
  {
    key: "whatsapp" as const,
    href: "/support",
    icon: "/icons/whatsapp.svg",
    image: "/landing/services-2.svg",
    tone: "whatsapp" as const,
    imageFirst: true,
  },
  {
    key: "tracking" as const,
    href: "/track-orders",
    icon: "/icons/magicpen.svg",
    image: "/landing/services-3.svg",
    tone: "accent" as const,
    imageFirst: false,
  },
]

export default async function Services() {
  const t = await getTranslations("Services")
  const locale = await getLocale()

  const fallbackItems: ServiceItemView[] = FALLBACK_META.map((item) => ({
    id: item.key,
    title: `${t(`items.${item.key}.titleLine1`)} ${t(`items.${item.key}.titleLine2`)}`,
    titleLine1: t(`items.${item.key}.titleLine1`),
    titleLine2: t(`items.${item.key}.titleLine2`),
    description: t(`items.${item.key}.description`),
    ctaLabel: t(`items.${item.key}.cta`),
    href: item.href,
    external: false,
    imageSrc: item.image,
    imageAlt: t(`items.${item.key}.imageAlt`),
    imageIsRemote: false,
    iconSrc: item.icon,
    tone: item.tone,
    imageFirst: item.imageFirst,
  }))

  const services = await getServicesContent(locale, {
    eyebrow: t("eyebrow"),
    description: t("description"),
    items: fallbackItems,
  })

  return (
    <ServicesContent
      eyebrow={services.eyebrow}
      titleHtml={services.titleHtml}
      titleFallback={t.rich("heading", {
        br: () => <br />,
        primary: (chunks) => <span className="text-primary">{chunks}</span>,
      })}
      description={services.description}
      items={services.items}
    />
  )
}
