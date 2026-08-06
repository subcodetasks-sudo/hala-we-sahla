import { api } from "@/lib/api"
import {
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"

export type StepsHeaderApi = {
  id: number
  content: string
  title: string
  description: string
}

export type StepApiItem = {
  step_number: number
  step_name: string
  title: string
  description: string
  image: string
}

type StepsApiResponse = {
  success: boolean
  message: string
  data: {
    header: StepsHeaderApi
    steps: StepApiItem[]
  }
}

export type StepItemView = {
  key: string
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
  imageIsRemote: boolean
  titlePlacement: "top" | "bottom"
  iconIndex: number
  framed: boolean
  tone: "accent" | "success"
}

export type StepsContentView = {
  eyebrow: string
  titleHtml: string | null
  description: string
  items: StepItemView[]
  source: "api" | "fallback"
}

export type StepsFallback = {
  eyebrow: string
  description: string
  items: StepItemView[]
}

function mapStepItem(item: StepApiItem, index: number, total: number): StepItemView {
  const image = item.image?.trim() || ""
  const isLast = index === total - 1 || item.step_number === total

  return {
    key: `step-${item.step_number || index + 1}`,
    label: item.step_name?.trim() || `الخطوة ${index + 1}`,
    title: item.title?.trim() || "",
    description: item.description?.trim() || "",
    image,
    imageAlt: item.title?.trim() || item.description?.trim() || item.step_name?.trim() || "",
    imageIsRemote: /^https?:\/\//i.test(image),
    // Even steps: title under image; odd steps: title above (matches design)
    titlePlacement: index % 2 === 0 ? "bottom" : "top",
    iconIndex: index,
    framed: true,
    tone: isLast ? "success" : "accent",
  }
}

export async function fetchHomeSteps(locale: string) {
  const response = await api.get<StepsApiResponse>("/website/home/steps", {
    language: locale,
  })

  return response.data
}

export async function getStepsContent(
  locale: string,
  fallback: StepsFallback,
): Promise<StepsContentView> {
  try {
    const data = await fetchHomeSteps(locale)
    const sorted = [...(data.steps ?? [])].sort(
      (a, b) => a.step_number - b.step_number,
    )
    const items = sorted
      .map((item, index) => mapStepItem(item, index, sorted.length))
      .filter((item) => item.image)

    if (items.length === 0) {
      throw new Error("Steps payload is empty")
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
