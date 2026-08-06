import { getTranslations } from "next-intl/server"

import BlogArticleCard from "@/features/blog/components/blog-article-card"
import type { BlogPostView } from "@/features/blog/services/blogs"

type BlogArticlesSectionProps = {
  posts: BlogPostView[]
  searchQuery?: string
}

export default async function BlogArticlesSection({
  posts,
  searchQuery,
}: BlogArticlesSectionProps) {
  const tArticles = await getTranslations("Blog.articles")
  const tSearch = await getTranslations("Blog.search")
  const isSearch = Boolean(searchQuery?.trim())

  return (
    <section className="mt-16 rounded-[2rem] bg-white px-4 py-12 sm:px-6 md:mt-24 md:rounded-[2.5rem] md:px-8 md:py-16">
      <header className="mx-auto max-w-2xl text-center">
        {isSearch ? (
          <>
            <p className="text-sm font-medium text-accent">
              {tSearch("resultsEyebrow")}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {tSearch("resultsHeading")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {tSearch("resultsDescription", { query: searchQuery ?? "" })}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-accent">
              {tArticles("eyebrow")}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {tArticles("heading")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {tArticles("description")}
            </p>
          </>
        )}
      </header>

      {posts.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground sm:text-base">
          {tSearch("noResults")}
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3">
          {posts.map((article) => (
            <BlogArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  )
}
