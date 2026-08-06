import { api } from "@/lib/api"
import {
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"

export type PricingHeaderApi = {
  id: number
  content: string
  title: string
  description: string
}

type PricingApiResponse = {
  success: boolean
  message: string
  data: {
    header: PricingHeaderApi
  }
}

export type PricingHeaderView = {
  eyebrow: string
  titleHtml: string | null
  description: string
  source: "api" | "fallback"
}

export type PricingHeaderFallback = {
  eyebrow: string
  description: string
}

export async function fetchPricing(locale: string) {
  const response = await api.get<PricingApiResponse>("/website/home/pricing", {
    language: locale,
  })

  return response.data
}

export async function getPricingHeader(
  locale: string,
  fallback: PricingHeaderFallback,
): Promise<PricingHeaderView> {
  try {
    const data = await fetchPricing(locale)
    const header = data.header

    if (!header) {
      throw new Error("Pricing header is missing")
    }

    const titleHtml = stripEmptyParagraphs(
      unwrapHtmlTag(sanitizeCmsHtml(header.title ?? ""), "h2"),
    )

    return {
      eyebrow: header.content?.trim() || fallback.eyebrow,
      titleHtml: titleHtml || null,
      description: header.description?.trim() || fallback.description,
      source: "api",
    }
  } catch {
    return {
      eyebrow: fallback.eyebrow,
      titleHtml: null,
      description: fallback.description,
      source: "fallback",
    }
  }
}
