import { api } from "@/lib/api"
import {
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"

export type ServicesHeaderApi = {
  id: number
  content: string
  title: string
  description: string
}

export type ServiceApiItem = {
  id: number
  title: string
  description: string
  button_text: string
  button_link: string
  image: string
  sort_order: number
}

type ServicesApiResponse = {
  success: boolean
  message: string
  data: {
    header: ServicesHeaderApi
    services: ServiceApiItem[]
  }
}

export type ServiceTone = "primary" | "accent" | "whatsapp"

export type ServiceItemView = {
  id: string
  title: string
  titleLine1: string | null
  titleLine2: string | null
  description: string
  ctaLabel: string
  href: string
  external: boolean
  imageSrc: string
  imageAlt: string
  imageIsRemote: boolean
  iconSrc: string
  tone: ServiceTone
  imageFirst: boolean
}

export type ServicesContentView = {
  eyebrow: string
  titleHtml: string | null
  description: string
  items: ServiceItemView[]
  source: "api" | "fallback"
}

export type ServicesFallback = {
  eyebrow: string
  description: string
  items: ServiceItemView[]
}

/** Fix known CMS typos and detect external links. */
export function normalizeServiceHref(href: string) {
  const trimmed = href.trim()
  if (!trimmed) return "/"

  if (trimmed === "/trak-orders") return "/track-orders"

  return trimmed
}

function resolveTone(href: string, index: number): ServiceTone {
  const lower = href.toLowerCase()
  if (
    lower.includes("whatsapp") ||
    lower.includes("wa.me") ||
    lower.includes("support")
  ) {
    return "whatsapp"
  }
  if (lower.includes("track")) return "accent"
  if (index === 2) return "accent"
  return "primary"
}

function resolveIcon(href: string, tone: ServiceTone) {
  if (tone === "whatsapp") return "/icons/whatsapp.svg"
  if (href.includes("track")) return "/icons/magicpen.svg"
  return "/icons/receipt-edit.svg"
}

/** Split API titles into the two-line style used by the static UI. */
export function splitServiceTitle(title: string): {
  titleLine1: string
  titleLine2: string
} {
  const trimmed = title.trim().replace(/\s+/g, " ")
  const parts = trimmed.split(" ")

  if (parts.length < 2) {
    return { titleLine1: trimmed, titleLine2: "" }
  }

  return {
    titleLine1: parts[0]!,
    titleLine2: parts.slice(1).join(" "),
  }
}

function mapServiceItem(
  item: ServiceApiItem,
  index: number,
): ServiceItemView {
  const href = normalizeServiceHref(item.button_link || "/")
  const external = /^https?:\/\//i.test(href)
  const tone = resolveTone(href, index)
  const imageSrc = item.image?.trim() || ""
  const title = item.title?.trim() || ""
  const { titleLine1, titleLine2 } = splitServiceTitle(title)

  return {
    id: String(item.id),
    title,
    titleLine1,
    titleLine2: titleLine2 || null,
    description: item.description?.trim() || "",
    ctaLabel: item.button_text?.trim() || "",
    href,
    external,
    imageSrc,
    imageAlt: title,
    imageIsRemote: /^https?:\/\//i.test(imageSrc),
    iconSrc: resolveIcon(href, tone),
    tone,
    imageFirst: index % 2 === 1,
  }
}

export async function fetchHomeServices(locale: string) {
  const response = await api.get<ServicesApiResponse>(
    "/website/home/services",
    { language: locale },
  )

  return response.data
}

export async function getServicesContent(
  locale: string,
  fallback: ServicesFallback,
): Promise<ServicesContentView> {
  try {
    const data = await fetchHomeServices(locale)
    const items = [...(data.services ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item, index) => mapServiceItem(item, index))
      .filter(
        (item) =>
          item.title && item.description && item.ctaLabel && item.imageSrc,
      )

    if (items.length === 0) {
      throw new Error("Services payload is empty")
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
