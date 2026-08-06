import { api } from "@/lib/api"
import {
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"

export type StatisticsHeaderApi = {
  id: number
  content: string
  title: string
  description: string
}

export type StatisticsItemApi = {
  id: number
  description: string
  number: string
  image: string
  sort_order: number
}

type StatisticsApiResponse = {
  success: boolean
  message: string
  data: {
    header: StatisticsHeaderApi
    items: StatisticsItemApi[]
  }
}

export type StatsItemView = {
  id: string
  description: string
  value: number
  suffix: string
  iconSrc: string | null
  imageSrc: string | null
}

export type StatsContentView = {
  eyebrow: string
  titleHtml: string | null
  description: string
  items: StatsItemView[]
  source: "api" | "fallback"
}

export type StatsFallback = {
  eyebrow: string
  description: string
  items: StatsItemView[]
}

export function parseStatNumber(raw: string): { value: number; suffix: string } {
  const trimmed = raw.trim()
  const hasPercent = trimmed.includes("%")
  const hasPlus = trimmed.includes("+")
  const numeric = Number(trimmed.replace(/[^\d.]/g, ""))

  return {
    value: Number.isFinite(numeric) ? numeric : 0,
    suffix: hasPercent ? "%" : hasPlus ? "+" : "",
  }
}

export async function fetchStatistics(locale: string) {
  const response = await api.get<StatisticsApiResponse>(
    "/website/home/statistics",
    { language: locale },
  )

  return response.data
}

export async function getStatisticsContent(
  locale: string,
  fallback: StatsFallback,
): Promise<StatsContentView> {
  try {
    const data = await fetchStatistics(locale)
    const items = [...(data.items ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => {
        const parsed = parseStatNumber(item.number ?? "")
        return {
          id: String(item.id),
          description: item.description?.trim() || "",
          value: parsed.value,
          suffix: parsed.suffix,
          iconSrc: null,
          imageSrc: item.image?.trim() || null,
        } satisfies StatsItemView
      })
      .filter((item) => item.description && item.value > 0)

    if (items.length === 0) {
      throw new Error("Statistics items are empty")
    }

    const titleHtml = stripEmptyParagraphs(
      unwrapHtmlTag(sanitizeCmsHtml(data.header?.title ?? ""), "h2"),
    )

    return {
      eyebrow: data.header?.content?.trim() || fallback.eyebrow,
      titleHtml: titleHtml || null,
      description:
        data.header?.description?.trim() || fallback.description,
      items,
      source: "api",
    }
  } catch {
    return {
      eyebrow: fallback.eyebrow,
      titleHtml: null,
      description: fallback.description,
      items: fallback.items,
      source: "fallback",
    }
  }
}
