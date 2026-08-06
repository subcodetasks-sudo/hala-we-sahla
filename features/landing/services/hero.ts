import { api } from "@/lib/api"
import {
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"

export type HeroApiData = {
  id: number
  badge: string
  title: string
  description: string
  image: string
}

type HeroApiResponse = {
  success: boolean
  message: string
  data: HeroApiData
}

export type HeroContent = {
  badge: string
  titleHtml: string | null
  descriptionHtml: string | null
  descriptionText: string | null
  imageSrc: string
  imageAlt: string
  source: "api" | "fallback"
}

export type HeroFallback = {
  badge: string
  description: string
  imageSrc: string
  imageAlt: string
}

export async function fetchHero(locale: string): Promise<HeroApiData> {
  const response = await api.get<HeroApiResponse>("/website/home/hero", {
    language: locale,
  })

  return response.data
}

export async function getHeroContent(
  locale: string,
  fallback: HeroFallback,
): Promise<HeroContent> {
  try {
    const data = await fetchHero(locale)

    const titleHtml = stripEmptyParagraphs(
      unwrapHtmlTag(sanitizeCmsHtml(data.title ?? ""), "h1"),
    )
    const descriptionHtml = stripEmptyParagraphs(
      sanitizeCmsHtml(data.description ?? ""),
    )

    const hasTitle = Boolean(titleHtml)
    const hasDescription = Boolean(descriptionHtml)
    const hasImage = Boolean(data.image?.trim())

    if (!hasTitle && !hasDescription && !hasImage && !data.badge?.trim()) {
      throw new Error("Hero payload is empty")
    }

    return {
      badge: data.badge?.trim() || fallback.badge,
      titleHtml: hasTitle ? titleHtml : null,
      descriptionHtml: hasDescription ? descriptionHtml : null,
      descriptionText: hasDescription ? null : fallback.description,
      imageSrc: hasImage ? data.image.trim() : fallback.imageSrc,
      imageAlt: fallback.imageAlt,
      source: "api",
    }
  } catch {
    return {
      badge: fallback.badge,
      titleHtml: null,
      descriptionHtml: null,
      descriptionText: fallback.description,
      imageSrc: fallback.imageSrc,
      imageAlt: fallback.imageAlt,
      source: "fallback",
    }
  }
}
