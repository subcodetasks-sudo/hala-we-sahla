import { getLocale, getTranslations } from "next-intl/server"

import StatsContent from "@/features/landing/components/stats-content"
import { getStatisticsContent } from "@/features/landing/services/statistics"

const FALLBACK_ITEMS = [
  {
    id: "satisfaction",
    iconSrc: "/icons/profile-tick.svg",
    imageSrc: null,
    value: 96,
    suffix: "%",
    key: "satisfaction" as const,
  },
  {
    id: "contracts",
    iconSrc: "/icons/receipt-edit.svg",
    imageSrc: null,
    value: 8000,
    suffix: "+",
    key: "contracts" as const,
  },
  {
    id: "requests",
    iconSrc: "/icons/receipt-item.svg",
    imageSrc: null,
    value: 13500,
    suffix: "+",
    key: "requests" as const,
  },
]

export default async function Stats() {
  const t = await getTranslations("Stats")
  const locale = await getLocale()

  const stats = await getStatisticsContent(locale, {
    eyebrow: t("eyebrow"),
    description: t("description"),
    items: FALLBACK_ITEMS.map((item) => ({
      id: item.id,
      description: t(`items.${item.key}`),
      value: item.value,
      suffix: item.suffix,
      iconSrc: item.iconSrc,
      imageSrc: item.imageSrc,
    })),
  })

  return (
    <StatsContent
      eyebrow={stats.eyebrow}
      titleHtml={stats.titleHtml}
      titleFallback={t.rich("heading", {
        primary: (chunks) => (
          <span key="primary" className="text-primary">
            {chunks}
          </span>
        ),
      })}
      description={stats.description}
      items={stats.items}
    />
  )
}
