import { getTranslations } from "next-intl/server"

import BlogRelatedCard from "@/features/blog/components/blog-related-card"
import type { BlogPostView } from "@/features/blog/services/blogs"

type BlogRelatedSectionProps = {
  posts: BlogPostView[]
}

export default async function BlogRelatedSection({
  posts,
}: BlogRelatedSectionProps) {
  const t = await getTranslations("Blog.related")

  if (posts.length === 0) {
    return null
  }

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
          {posts.map((article) => (
            <BlogRelatedCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
