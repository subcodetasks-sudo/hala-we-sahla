import { api } from "@/lib/api"
import { toTrackOrderApiPhone } from "@/features/forms/services/track-order"
import {
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"
import type { SupportInquiryValues } from "@/features/support/schemas/support-inquiry"

export type SupportHeaderApi = {
  id: number
  title: string
  description: string
  content: string
}

export type SupportCardApi = {
  id: number
  card_number: number
  title: string
  description: string
  image: string
  button_type: string
  button_value: string
  button_label: string
}

export type SupportFormHeaderApi = {
  id: number
  title: string
  description: string
}

export type SupportInquiryTypeApi = {
  id: number
  name: string
  sort_order: number
}

type SupportApiResponse = {
  success: boolean
  message: string
  data: {
    header: SupportHeaderApi
    cards: SupportCardApi[]
    form: {
      header: SupportFormHeaderApi
      inquiry_types: SupportInquiryTypeApi[]
    }
  }
}

export type SupportCardView = {
  id: string
  eyebrow?: string
  title: string
  description: string
  availability?: string
  cta: string
  href: string
  iconSrc: string
  imageIsRemote: boolean
}

export type InquiryTypeView = {
  id: string
  label: string
}

export type SupportContentView = {
  eyebrow: string
  titleHtml: string | null
  title: string
  description: string
  cards: SupportCardView[]
  formTitleHtml: string | null
  formTitle: string
  formDescription: string
  inquiryTypes: InquiryTypeView[]
  source: "api" | "fallback"
}

export type SupportFallback = {
  eyebrow: string
  title: string
  description: string
  cardAvailability: string
  cards: SupportCardView[]
  formTitle: string
  formDescription: string
  inquiryTypes: InquiryTypeView[]
}

function resolveButtonHref(buttonType: string, value: string) {
  const trimmed = value.trim()
  if (!trimmed) return "#"

  if (buttonType === "email") {
    return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`
  }

  if (buttonType === "phone") {
    const digits = trimmed.replace(/\D/g, "")
    return digits ? `https://wa.me/${digits}` : "#"
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : "#"
}

function resolveIconFallback(buttonType: string) {
  if (buttonType === "email") return "/icons/sms-tracking.svg"
  return "/icons/whatsapp.svg"
}

function mapCard(item: SupportCardApi): SupportCardView {
  const image = item.image?.trim() || ""
  const imageIsRemote = /^https?:\/\//i.test(image)

  return {
    id: `card-${item.id}`,
    title: item.title?.trim() || "",
    description: item.description?.trim() || "",
    cta: item.button_label?.trim() || "",
    href: resolveButtonHref(item.button_type, item.button_value),
    iconSrc: imageIsRemote ? image : resolveIconFallback(item.button_type),
    imageIsRemote,
  }
}

export async function fetchSupport(locale: string) {
  const response = await api.get<SupportApiResponse>("/website/legal/support", {
    language: locale,
  })

  return response.data
}

export async function getSupportContent(
  locale: string,
  fallback: SupportFallback,
): Promise<SupportContentView> {
  try {
    const data = await fetchSupport(locale)
    const cards = [...(data.cards ?? [])]
      .sort((a, b) => a.card_number - b.card_number)
      .map(mapCard)
      .filter((card) => card.title && card.href !== "#" && card.cta)

    const inquiryTypes = [...(data.form?.inquiry_types ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        id: String(item.id),
        label: item.name?.trim() || "",
      }))
      .filter((item) => item.label)

    if (cards.length === 0 || inquiryTypes.length === 0) {
      throw new Error("Support payload is empty")
    }

    const titleHtml = stripEmptyParagraphs(
      unwrapHtmlTag(sanitizeCmsHtml(data.header?.title ?? ""), "h1"),
    )
    const formTitleHtml = stripEmptyParagraphs(
      unwrapHtmlTag(sanitizeCmsHtml(data.form?.header?.title ?? ""), "h2"),
    )

    return {
      eyebrow: data.header?.content?.trim() || fallback.eyebrow,
      titleHtml: titleHtml || null,
      title: fallback.title,
      description:
        data.header?.description?.trim() || fallback.description,
      cards: cards.map((card) => ({
        ...card,
        availability: fallback.cardAvailability,
      })),
      formTitleHtml: formTitleHtml || null,
      formTitle: fallback.formTitle,
      formDescription:
        data.form?.header?.description?.trim() || fallback.formDescription,
      inquiryTypes,
      source: "api",
    }
  } catch {
    return {
      eyebrow: fallback.eyebrow,
      titleHtml: null,
      title: fallback.title,
      description: fallback.description,
      cards: fallback.cards,
      formTitleHtml: null,
      formTitle: fallback.formTitle,
      formDescription: fallback.formDescription,
      inquiryTypes: fallback.inquiryTypes,
      source: "fallback",
    }
  }
}

type SupportContactApiResponse = {
  success: boolean
  message: string
  data?: unknown
}

export function splitFullName(fullName: string) {
  const trimmed = fullName.trim().replace(/\s+/g, " ")
  const spaceIndex = trimmed.indexOf(" ")

  if (spaceIndex === -1) {
    return {
      first_name: trimmed,
      last_name: trimmed,
    }
  }

  return {
    first_name: trimmed.slice(0, spaceIndex),
    last_name: trimmed.slice(spaceIndex + 1),
  }
}

export async function submitSupportContact(
  locale: string,
  values: SupportInquiryValues,
) {
  const inquiryTypeId = Number(values.inquiryType)
  if (!Number.isFinite(inquiryTypeId)) {
    throw new Error("Invalid inquiry type")
  }

  const { first_name, last_name } = splitFullName(values.fullName)
  const orderNumber = values.orderNumber.trim()

  const body: Record<string, unknown> = {
    first_name,
    last_name,
    phone: toTrackOrderApiPhone(values.phone),
    inquiry_type_id: inquiryTypeId,
    message: values.message.trim(),
  }

  if (orderNumber) {
    body.order_number = orderNumber
  }

  const response = await api.post<SupportContactApiResponse>(
    "/website/legal/support/contact",
    {
      language: locale,
      body,
    },
  )

  return {
    message: response.message,
  }
}
