import { api } from "@/lib/api"
import {
  parseLegalSectionHtml,
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"

export type PrivacyHeaderApi = {
  id: number
  title: string
  description: string
  content: string
}

export type PrivacySectionApi = {
  id: number
  title: string
  description: string
  content: string
  sort_order: number
}

type PrivacyApiResponse = {
  success: boolean
  message: string
  data: {
    header: PrivacyHeaderApi
    sections: PrivacySectionApi[]
  }
}

export type PrivacySectionView = {
  id: string
  title: string
  subtitle: string
  contentHtml?: string | null
  body?: string
  items?: string[]
  note?: string
}

export type PrivacyContentView = {
  eyebrow: string
  titleHtml: string | null
  title: string
  description: string
  sections: PrivacySectionView[]
  source: "api" | "fallback"
}

export type PrivacyFallback = {
  eyebrow: string
  title: string
  description: string
  sections: PrivacySectionView[]
}

function mapSection(item: PrivacySectionApi): PrivacySectionView {
  const sanitized = stripEmptyParagraphs(sanitizeCmsHtml(item.content ?? ""))
  const parsed = parseLegalSectionHtml(sanitized)
  const title = item.title?.trim() || ""
  const subtitle = item.description?.trim() || ""

  return {
    id: `section-${item.id}`,
    title,
    subtitle: subtitle && subtitle !== title ? subtitle : "",
    body: parsed.body,
    items: parsed.items,
    contentHtml: parsed.contentHtml ?? null,
  }
}

export async function fetchPrivacy(locale: string) {
  const response = await api.get<PrivacyApiResponse>("/website/legal/privacy", {
    language: locale,
  })

  return response.data
}

export async function getPrivacyContent(
  locale: string,
  fallback: PrivacyFallback,
): Promise<PrivacyContentView> {
  try {
    const data = await fetchPrivacy(locale)
    const sections = [...(data.sections ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapSection)
      .filter(
        (section) =>
          section.title &&
          (section.contentHtml || section.body || section.items?.length),
      )

    if (sections.length === 0) {
      throw new Error("Privacy payload is empty")
    }

    const titleHtml = stripEmptyParagraphs(
      unwrapHtmlTag(sanitizeCmsHtml(data.header?.title ?? ""), "h1"),
    )

    return {
      eyebrow: data.header?.content?.trim() || fallback.eyebrow,
      titleHtml: titleHtml || null,
      title: fallback.title,
      description:
        data.header?.description?.trim() || fallback.description,
      sections,
      source: "api",
    }
  } catch {
    return {
      eyebrow: fallback.eyebrow,
      titleHtml: null,
      title: fallback.title,
      description: fallback.description,
      sections: fallback.sections,
      source: "fallback",
    }
  }
}
