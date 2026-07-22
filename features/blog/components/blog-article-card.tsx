import Image from "next/image"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { ArrowLeft, Clock } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { formatNumber } from "@/lib/format"

export type BlogArticleCardData = {
  id: string
  publishedAt: Date
  views: number
  image: string
}

type BlogArticleCardProps = {
  article: BlogArticleCardData
}

export default async function BlogArticleCard({
  article,
}: BlogArticleCardProps) {
  const t = await getTranslations("Blog.articles")
  const locale = await getLocale()
  const dateLocale = locale === "ar" ? ar : enUS

  const dateLabel = format(
    article.publishedAt,
    locale === "ar" ? "EEEE، d MMMM yyyy" : "EEEE, d MMMM yyyy",
    {
      locale: dateLocale,
    }
  )
  const viewsLabel = formatNumber(article.views, locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  })

  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl bg-background p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:text-sm">
        <div className="flex min-w-0 items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" aria-hidden="true" />
          <time dateTime={article.publishedAt.toISOString()} className="truncate">
            {dateLabel}
          </time>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <CustomIcon
            src="/icons/users.svg"
            size={14}
            className="size-3.5 text-muted-foreground"
          />
          <span>{viewsLabel}</span>
        </div>
      </div>

      <div className="relative aspect-16/10 overflow-hidden rounded-2xl">
        <Image
          src={article.image}
          alt={t(`items.${article.id}.title`)}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-accent">
          <CustomIcon
            src="/icons/file.svg"
            size={16}
            className="size-4 text-accent"
          />
          <span>{t("category")}</span>
        </div>

        <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
          {t(`items.${article.id}.title`)}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(`items.${article.id}.excerpt`)}
        </p>

        <a
          href="#"
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
        >
          {t("readMore")}
          <ArrowLeft className="size-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
