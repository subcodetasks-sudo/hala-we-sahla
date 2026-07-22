import { getTranslations } from "next-intl/server"

import BlogArticleCard, {
  type BlogArticleCardData,
} from "@/features/blog/components/blog-article-card"
import BlogArticlesPagination from "@/features/blog/components/blog-articles-pagination"

const ARTICLES: BlogArticleCardData[] = [
  {
    id: "steps",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    views: 1800,
    image: "/images/blog.png",
  },
  {
    id: "documents",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    views: 1800,
    image: "/images/blog.png",
  },
  {
    id: "timeline",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    views: 1800,
    image: "/images/blog.png",
  },
  {
    id: "tracking",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    views: 1800,
    image: "/images/blog.png",
  },
  {
    id: "mistakes",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    views: 1800,
    image: "/images/blog.png",
  },
  {
    id: "checklist",
    slug: "guide-contract-renewal",
    publishedAt: new Date(2025, 1, 11),
    views: 1800,
    image: "/images/blog.png",
  },
]

export default async function BlogArticlesSection() {
  const t = await getTranslations("Blog.articles")

  return (
    <section className="mt-16 rounded-[2rem] bg-white px-4 py-12 sm:px-6 md:mt-24 md:rounded-[2.5rem] md:px-8 md:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-accent">{t("eyebrow")}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {t("heading")}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          {t("description")}
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3">
        {ARTICLES.map((article) => (
          <BlogArticleCard key={article.id} article={article} />
        ))}
      </div>

      <BlogArticlesPagination />
    </section>
  )
}
