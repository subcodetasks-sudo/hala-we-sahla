import { getTranslations } from "next-intl/server"

import BlogMostReadItem, {
  type BlogMostReadItemData,
} from "@/features/blog/components/blog-most-read-item"

const MOST_READ_ITEMS: BlogMostReadItemData[] = [
  {
    id: "documents",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    readingMinutes: 5,
    views: 1800,
    tone: "bg-[#f8e4e8]",
  },
  {
    id: "status",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    readingMinutes: 5,
    views: 1800,
    tone: "bg-[#dff0e6]",
  },
  {
    id: "inquiry",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    readingMinutes: 5,
    views: 1800,
    tone: "bg-[#f3e6d8]",
  },
  {
    id: "forgot",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    readingMinutes: 5,
    views: 1800,
    tone: "bg-[#ebe4f5]",
  },
]

export default async function BlogMostReadSection() {
  const t = await getTranslations("Blog.mostRead")

  return (
    <section className="mt-16 md:mt-24">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-accent">{t("eyebrow")}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {t("heading")}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          {t("description")}
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-border/50 bg-white px-4 shadow-sm sm:mt-10 sm:px-6 md:px-8">
        <ul className="divide-y divide-border/70">
          {MOST_READ_ITEMS.map((item) => (
            <BlogMostReadItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
