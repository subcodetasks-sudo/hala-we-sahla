import Image from "next/image"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { getLocale, getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { formatNumber } from "@/lib/format"

const FEATURED = {
  publishedAt: new Date(2026, 5, 12),
  readingMinutes: 5,
  views: 2140,
  image: "/images/blog.png",
} as const

export default async function BlogFeaturedCard() {
  const t = await getTranslations("Blog.featured")
  const locale = await getLocale()
  const dateLocale = locale === "ar" ? ar : enUS

  const dateLabel = format(FEATURED.publishedAt, "d MMMM yyyy", {
    locale: dateLocale,
  })
  const viewsLabel = formatNumber(FEATURED.views, locale)

  return (
    <article className="relative h-full min-h-[480px] overflow-hidden rounded-3xl">
      <Image
        src={FEATURED.image}
        alt={t("title")}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 65vw"
      />

      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/20"
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex flex-col p-6 sm:p-8">
        <p className="text-sm text-white/95">
          {t("meta", {
            date: dateLabel,
            minutes: FEATURED.readingMinutes,
          })}
        </p>

        <div className="mt-auto max-w-xl space-y-3 pb-12 sm:space-y-4 sm:pb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
            <CustomIcon
              src="/icons/tag-2.svg"
              size={16}
              className="size-4 text-white"
            />
            {t("category")}
          </span>

          <h2 className="text-xl font-bold leading-snug text-balance text-white sm:text-2xl md:text-[1.75rem] md:leading-snug">
            {t("title")}
          </h2>

          <p className="text-sm leading-relaxed text-white/90 sm:text-[0.95rem]">
            {t("description")}
          </p>
        </div>

        <div className="absolute end-6 bottom-6 flex items-center gap-2 text-sm text-white sm:end-8 sm:bottom-8">
          <CustomIcon
            src="/icons/users.svg"
            size={20}
            className="size-5 text-white"
          />
          <span>
            {t("views", {
              count: viewsLabel,
            })}
          </span>
        </div>
      </div>
    </article>
  )
}
