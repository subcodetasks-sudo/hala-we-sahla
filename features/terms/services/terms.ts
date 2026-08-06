import { api } from "@/lib/api"
import {
  parseLegalSectionHtml,
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"

export type TermsHeaderApi = {
  id: number
  title: string
  description: string
  content: string
}

export type TermsSectionApi = {
  id: number
  title: string
  description: string
  content: string
  sort_order: number
}

type TermsApiResponse = {
  success: boolean
  message: string
  data: {
    header: TermsHeaderApi
    sections: TermsSectionApi[]
  }
}

export type TermsSectionView = {
  id: string
  title: string
  subtitle: string
  contentHtml?: string | null
  body?: string
  items?: string[]
  note?: string
}

export type TermsContentView = {
  eyebrow: string
  titleHtml: string | null
  title: string
  description: string
  sections: TermsSectionView[]
  source: "api" | "fallback"
}

export type TermsFallback = {
  eyebrow: string
  title: string
  description: string
  sections: TermsSectionView[]
}

function mapSection(item: TermsSectionApi): TermsSectionView {
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

export async function fetchTerms(locale: string) {
  const response = await api.get<TermsApiResponse>("/website/legal/terms", {
    language: locale,
  })

  return response.data
}

export async function getTermsContent(
  locale: string,
  fallback: TermsFallback,
): Promise<TermsContentView> {
  try {
    const data = await fetchTerms(locale)
    const sections = [...(data.sections ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapSection)
      .filter(
        (section) =>
          section.title &&
          (section.contentHtml || section.body || section.items?.length),
      )

    if (sections.length === 0) {
      throw new Error("Terms payload is empty")
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
