import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { ChevronLeft, Clock, Eye, Timer } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export type BlogMostReadItemData = {
  id: string
  publishedAt: Date
  readingMinutes: number
  views: number
  tone: string
}

type BlogMostReadItemProps = {
  item: BlogMostReadItemData
}

export default async function BlogMostReadItem({ item }: BlogMostReadItemProps) {
  const t = await getTranslations("Blog.mostRead")
  const locale = await getLocale()
  const dateLocale = locale === "ar" ? ar : enUS

  const dateLabel = format(
    item.publishedAt,
    locale === "ar" ? "EEEE، d MMMM yyyy" : "EEEE, d MMMM yyyy",
    { locale: dateLocale }
  )
  const viewsLabel = formatNumber(item.views, locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  })

  return (
    <li>
      <a
        href="#"
        className="flex items-center gap-3 py-5 transition-opacity hover:opacity-80 sm:gap-4 sm:py-6"
      >
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14",
            item.tone
          )}
          aria-hidden="true"
        >
          <CustomIcon
            src="/icons/receipt-3.svg"
            size={24}
            className="size-6 text-primary"
          />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug text-foreground sm:text-base">
            {t(`items.${item.id}.title`)}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground sm:gap-x-4 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" aria-hidden="true" />
              <time dateTime={item.publishedAt.toISOString()}>{dateLabel}</time>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Timer className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{t("readingTime", { minutes: item.readingMinutes })}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{viewsLabel}</span>
            </span>
          </div>
        </div>

        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-foreground sm:size-10"
          aria-hidden="true"
        >
          <ChevronLeft className="size-4 ltr:rotate-180" />
        </span>
      </a>
    </li>
  )
}
