import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { Clock, Eye, Timer } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import BlogPostShare from "@/features/blog/components/blog-post-share"
import { formatNumber } from "@/lib/format"

const POST = {
  publishedAt: new Date(2025, 1, 11),
  readingMinutes: 5,
  views: 1800,
} as const

export default async function BlogPostHeader() {
  const t = await getTranslations("Blog.post")
  const tCommon = await getTranslations("Common")
  const tFooter = await getTranslations("Footer")
  const locale = await getLocale()
  const dateLocale = locale === "ar" ? ar : enUS

  const title = t("title")
  const dateLabel = format(
    POST.publishedAt,
    locale === "ar" ? "EEEE، d MMMM yyyy" : "EEEE, d MMMM yyyy",
    { locale: dateLocale }
  )
  const viewsLabel = formatNumber(POST.views, locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  })

  return (
    <header className="bg-white">
      <div className="container py-6 md:py-10">
        <BreadcrumbNav
          items={[
            { label: tCommon("home"), href: "/" },
            {
              label: tFooter("columns.quickLinks.blog"),
              href: "/blog",
            },
            { label: title },
          ]}
        />

        <div className="mt-8 lg:max-w-[75%] md:mt-10 ">
          <p className="text-sm font-semibold text-accent">{t("category")}</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance text-primary sm:text-4xl md:text-[2.5rem] md:leading-tight">
            {title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              <time dateTime={POST.publishedAt.toISOString()}>{dateLabel}</time>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Timer className="size-4 shrink-0" aria-hidden="true" />
              <span>{t("readingTime", { minutes: POST.readingMinutes })}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-4 shrink-0" aria-hidden="true" />
              <span>{viewsLabel}</span>
            </span>
          </div>

          <BlogPostShare title={title} />
        </div>
      </div>
    </header>
  )
}
