import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import BlogPostContent from "@/features/blog/components/blog-post-content"
import BlogPostHeader from "@/features/blog/components/blog-post-header"
import BlogRelatedSection from "@/features/blog/components/blog-related-section"
import { buildBlogFallbackPosts } from "@/features/blog/lib/blog-fallback"
import { getBlogBySlug, getBlogs } from "@/features/blog/services/blogs"

type BlogPostPageProps = {
  params: Promise<{ slug: string; locale: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params
  const tFeatured = await getTranslations("Blog.featured")
  const tArticles = await getTranslations("Blog.articles")

  const fallback = buildBlogFallbackPosts({
    featuredTitle: tFeatured("title"),
    featuredExcerpt: tFeatured("description"),
    featuredCategory: tFeatured("category"),
    articleTitle: tArticles("items.steps.title"),
    articleExcerpt: tArticles("items.steps.excerpt"),
  })

  const decodedSlug = decodeURIComponent(slug)
  const post = await getBlogBySlug(locale, decodedSlug, fallback)

  if (!post) {
    notFound()
  }

  const { posts } = await getBlogs(locale, fallback)
  const relatedPosts = posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3)

  return (
    <div className="pb-16">
      <BlogPostHeader post={post} />
      <BlogPostContent post={post} />
      <BlogRelatedSection posts={relatedPosts} />
    </div>
  )
}
