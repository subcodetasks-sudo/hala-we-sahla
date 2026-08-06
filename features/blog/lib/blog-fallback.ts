import {
  BLOG_ITEM_TONES,
  type BlogPostView,
} from "@/features/blog/services/blogs"

export function buildBlogFallbackPosts(input: {
  featuredTitle: string
  featuredExcerpt: string
  featuredCategory: string
  articleTitle: string
  articleExcerpt: string
}): BlogPostView[] {
  const publishedAt = new Date(2026, 5, 12)
  const contentHtml = `<p>${input.featuredExcerpt}</p>`

  return [
    {
      id: "fallback-1",
      slug: "guide-contract-renewal",
      title: input.featuredTitle,
      excerpt: input.featuredExcerpt,
      contentHtml,
      image: "/images/blog.png",
      imageIsRemote: false,
      categoryName: input.featuredCategory,
      publishedAt,
      readingMinutes: 5,
      tone: BLOG_ITEM_TONES[0],
    },
    {
      id: "fallback-2",
      slug: "contract-renewal-documents",
      title: input.articleTitle,
      excerpt: input.articleExcerpt,
      contentHtml: `<p>${input.articleExcerpt}</p>`,
      image: "/images/blog.png",
      imageIsRemote: false,
      categoryName: input.featuredCategory,
      publishedAt,
      readingMinutes: 4,
      tone: BLOG_ITEM_TONES[1],
    },
  ]
}
