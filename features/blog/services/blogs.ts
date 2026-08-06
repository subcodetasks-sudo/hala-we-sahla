import { cache } from "react"

import {
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  stripHtmlTags,
} from "@/features/landing/lib/cms-html"
import { api } from "@/lib/api"

export const BLOG_ITEM_TONES = [
  "bg-[#ebe4f5]",
  "bg-[#f3e6d8]",
  "bg-[#dceef5]",
  "bg-[#dff0e6]",
  "bg-[#f8e4e8]",
] as const

export type BlogCategoryApi = {
  id: number
  name: string
  slug: string
}

export type LocalizedTextApi = {
  ar: string
  en: string
}

export type BlogApiItem = {
  id: number
  title: LocalizedTextApi
  slug: string
  content: LocalizedTextApi
  image: string
  category: BlogCategoryApi | null
  published_at: string
  created_at: string
}

type BlogsApiResponse = {
  success: boolean
  message: string
  data: BlogApiItem[]
}

export type BlogPostView = {
  id: string
  slug: string
  title: string
  excerpt: string
  contentHtml: string
  image: string
  imageIsRemote: boolean
  categoryName: string | null
  publishedAt: Date
  readingMinutes: number
  tone: string
}

export type BlogHeadingView = {
  id: string
  label: string
}

function pickLocalized(
  locale: string,
  ar: string | undefined,
  en: string | undefined,
  fallback = "",
) {
  const value = locale === "en" ? en || ar : ar || en
  return value?.trim() || fallback.trim()
}

export function parseBlogPublishedAt(value: string | undefined) {
  if (!value?.trim()) {
    return new Date()
  }

  const date = new Date(value.replace(" ", "T"))
  return Number.isNaN(date.getTime()) ? new Date() : date
}

export function estimateReadingMinutes(html: string) {
  const words = stripHtmlTags(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function createBlogExcerpt(html: string, maxLength = 160) {
  const text = stripHtmlTags(html)
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}...`
}

export function mapBlogPost(
  item: BlogApiItem,
  locale: string,
  index: number,
): BlogPostView {
  const title = pickLocalized(locale, item.title?.ar, item.title?.en, item.slug)
  const contentRaw = pickLocalized(
    locale,
    item.content?.ar,
    item.content?.en,
    "",
  )
  const contentHtml = stripEmptyParagraphs(sanitizeCmsHtml(contentRaw))
  const image = item.image?.trim() || "/images/blog.png"

  return {
    id: String(item.id),
    slug: item.slug,
    title,
    excerpt: createBlogExcerpt(contentHtml),
    contentHtml,
    image,
    imageIsRemote: /^https?:\/\//i.test(image),
    categoryName: item.category?.name?.trim() || null,
    publishedAt: parseBlogPublishedAt(item.published_at || item.created_at),
    readingMinutes: estimateReadingMinutes(contentHtml),
    tone: BLOG_ITEM_TONES[index % BLOG_ITEM_TONES.length],
  }
}

export function filterBlogPosts(posts: BlogPostView[], query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) {
    return posts
  }

  return posts.filter((post) => {
    const haystack = [post.title, post.excerpt, post.categoryName ?? ""]
      .join(" ")
      .toLowerCase()

    return terms.every((term) => haystack.includes(term))
  })
}

export function injectBlogHeadingIds(html: string) {
  const headings: BlogHeadingView[] = []
  let index = 0

  const contentHtml = html.replace(
    /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi,
    (_, inner: string) => {
      const label = stripHtmlTags(inner)
      const id = `section-${index}`
      index += 1
      headings.push({ id, label })
      return `<h2 id="${id}">${inner}</h2>`
    },
  )

  return { contentHtml, headings }
}

export async function fetchBlogs(locale: string) {
  const response = await api.get<BlogsApiResponse>("/website/blogs", {
    language: locale,
  })

  return response.data
}

export const getBlogs = cache(
  async (locale: string, fallback: BlogPostView[]) => {
    try {
      const data = await fetchBlogs(locale)
      const posts = (data ?? [])
        .map((item, index) => mapBlogPost(item, locale, index))
        .filter((post) => post.title && post.slug)
        .sort(
          (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
        )

      if (posts.length === 0) {
        throw new Error("Blogs payload is empty")
      }

      return { posts, source: "api" as const }
    } catch {
      return { posts: fallback, source: "fallback" as const }
    }
  },
)

export async function getBlogBySlug(
  locale: string,
  slug: string,
  fallback: BlogPostView[],
) {
  const { posts } = await getBlogs(locale, fallback)
  return posts.find((post) => post.slug === slug) ?? null
}
