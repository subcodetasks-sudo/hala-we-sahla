import { getLocale, getTranslations } from "next-intl/server"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import BlogArticlesSection from "@/features/blog/components/blog-articles-section"
import BlogFeaturedCard from "@/features/blog/components/blog-featured-card"
import BlogHeader from "@/features/blog/components/blog-header"
import BlogLatestArticles from "@/features/blog/components/blog-latest-articles"
import BlogMostReadSection from "@/features/blog/components/blog-most-read-section"
import { buildBlogFallbackPosts } from "@/features/blog/lib/blog-fallback"
import {
  filterBlogPosts,
  getBlogs,
} from "@/features/blog/services/blogs"

type BlogPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = await getLocale()
  const tCommon = await getTranslations("Common")
  const tFooter = await getTranslations("Footer")
  const tFeatured = await getTranslations("Blog.featured")
  const tArticles = await getTranslations("Blog.articles")

  const { posts } = await getBlogs(
    locale,
    buildBlogFallbackPosts({
      featuredTitle: tFeatured("title"),
      featuredExcerpt: tFeatured("description"),
      featuredCategory: tFeatured("category"),
      articleTitle: tArticles("items.steps.title"),
      articleExcerpt: tArticles("items.steps.excerpt"),
    }),
  )

  const { q } = await searchParams
  const searchQuery = q?.trim() ?? ""
  const isSearching = searchQuery.length > 0
  const visiblePosts = isSearching
    ? filterBlogPosts(posts, searchQuery)
    : posts

  const [featuredPost, ...remainingPosts] = posts
  const latestPosts = remainingPosts.slice(0, 4)
  const mostReadPosts = posts.slice(0, 4)

  return (
    <div className="container pb-16">
      <BreadcrumbNav
        className="pt-6 md:pt-10"
        items={[
          { label: tCommon("home"), href: "/" },
          { label: tFooter("columns.quickLinks.blog") },
        ]}
      />

      <BlogHeader />

      {!isSearching && featuredPost ? (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)] lg:items-stretch lg:gap-6">
          <BlogFeaturedCard post={featuredPost} />
          <BlogLatestArticles posts={latestPosts} />
        </section>
      ) : null}

      <BlogArticlesSection
        posts={visiblePosts}
        searchQuery={isSearching ? searchQuery : undefined}
      />
      {!isSearching ? <BlogMostReadSection posts={mostReadPosts} /> : null}
    </div>
  )
}
