import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { getLocale, getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import BlogImage from "@/features/blog/components/blog-image"
import type { BlogPostView } from "@/features/blog/services/blogs"
import { Link } from "@/i18n/navigation"

type BlogFeaturedCardProps = {
  post: BlogPostView
}

export default async function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  const t = await getTranslations("Blog.featured")
  const locale = await getLocale()
  const dateLocale = locale === "ar" ? ar : enUS

  const dateLabel = format(post.publishedAt, "d MMMM yyyy", {
    locale: dateLocale,
  })
  const href = `/blog/${post.slug}`
  const categoryLabel = post.categoryName || t("category")

  return (
    <article className="relative h-full min-h-[480px] overflow-hidden rounded-3xl">
      <Link href={href} className="absolute inset-0 z-10" aria-label={post.title} />

      <BlogImage
        src={post.image}
        alt={post.title}
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

      <div className="pointer-events-none absolute inset-0 flex flex-col p-6 sm:p-8">
        <p className="text-sm text-white/95">
          {t("meta", {
            date: dateLabel,
            minutes: post.readingMinutes,
          })}
        </p>

        <div className="mt-auto max-w-lg space-y-3 pb-12 sm:space-y-4 sm:pb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
            <CustomIcon
              src="/icons/receipt-3.svg"
              size={16}
              className="size-4 text-white"
            />
            {categoryLabel}
          </span>

          <h2 className="text-xl font-bold leading-snug text-balance text-white sm:text-2xl md:text-[1.75rem] md:leading-snug">
            {post.title}
          </h2>

          <p className="text-sm leading-relaxed text-white/90 sm:text-[0.95rem]">
            {post.excerpt}
          </p>
        </div>
      </div>
    </article>
  )
}
