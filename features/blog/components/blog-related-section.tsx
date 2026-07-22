import { getTranslations } from "next-intl/server"

import BlogRelatedCard, {
  type BlogRelatedCardData,
} from "@/features/blog/components/blog-related-card"

const RELATED_ARTICLES: BlogRelatedCardData[] = [
  {
    id: "steps",
    slug: "guide-contract-renewal",
    image: "/images/blog.png",
  },
  {
    id: "documents",
    slug: "guide-contract-renewal",
    image: "/images/blog.png",
  },
  {
    id: "tracking",
    slug: "guide-contract-renewal",
    image: "/images/blog.png",
  },
]

export default async function BlogRelatedSection() {
  const t = await getTranslations("Blog.related")

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container">
        <header className="max-w-2xl text-start">
          <p className="text-sm font-medium text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {t("description")}
          </p>
        </header>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3">
          {RELATED_ARTICLES.map((article) => (
            <BlogRelatedCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
