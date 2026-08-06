import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api"
import {
  sanitizeCmsHtml,
  stripEmptyParagraphs,
  unwrapHtmlTag,
} from "@/features/landing/lib/cms-html"
import { faqKeys } from "@/features/landing/query-keys"

export type FaqHeaderApi = {
  id: number
  content: string
  title: string
  description: string
}

export type FaqApiItem = {
  id: number
  question: string
  answer: string
  sort_order: number
}

type FaqsApiResponse = {
  success: boolean
  message: string
  data: {
    header: FaqHeaderApi
    faqs: FaqApiItem[]
  }
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export type FaqContentView = {
  eyebrow: string
  titleHtml: string | null
  description: string
  items: FaqItem[]
  source: "api" | "fallback"
}

export type FaqFallback = {
  eyebrow: string
  description: string
  items: FaqItem[]
}

const FALLBACK_FAQS: Record<string, FaqItem[]> = {
  ar: [
    {
      id: "duration",
      question: "كم يستغرق تجديد العقد؟",
      answer:
        "تستغرق عملية تجديد العقد عادةً حوالي 5 أيام عمل من تاريخ استلام الطلب ومراجعة المستندات.",
    },
    {
      id: "required-data",
      question: "ما البيانات المطلوبة لتقديم الطلب؟",
      answer:
        "تحتاج إلى الهوية الوطنية أو الإقامة، جواز سفر العامل/ة، ونسخة من العقد السابق لإتمام تقديم الطلب.",
    },
    {
      id: "tracking",
      question: "كيف أتابع حالة طلبي؟",
      answer:
        "يمكنك تتبع حالة طلبك في أي وقت من خلال صفحة تتبع الطلبات باستخدام رقم الجوال أو رقم الطلب.",
    },
    {
      id: "payment",
      question: "متى يتم الدفع؟",
      answer:
        "يتم الدفع إلكترونيًا عند تقديم الطلب عبر المنصة، ويمكنك الاطلاع على رسوم الخدمة قبل التأكيد.",
    },
    {
      id: "electronic-contract",
      question: "هل يمكن استلام العقد إلكترونيًا؟",
      answer:
        "نعم، بمجرد اعتماد الطلب يصلك العقد الإلكتروني الجاهز مباشرة داخل المنصة.",
    },
    {
      id: "whatsapp",
      question: "هل يمكن التواصل عبر واتساب؟",
      answer:
        "نعم، يمكنك التواصل مع فريق الدعم مباشرة عبر واتساب لإتمام إجراءاتك بسهولة.",
    },
    {
      id: "cancellation",
      question: "هل يمكن إلغاء الطلب بعد إرساله؟",
      answer:
        "يمكن إلغاء الطلب خلال فترة المراجعة الأولية، وذلك بالتواصل مع فريق الدعم.",
    },
  ],
  en: [
    {
      id: "duration",
      question: "How long does contract renewal take?",
      answer:
        "Contract renewal usually takes about 5 business days from when we receive your request and review the documents.",
    },
    {
      id: "required-data",
      question: "What data is required to submit the request?",
      answer:
        "You'll need the national ID or Iqama, the worker's passport, and a copy of the previous contract to submit the request.",
    },
    {
      id: "tracking",
      question: "How do I track my request status?",
      answer:
        "You can track your request status at any time from the request tracking page using your phone number or request number.",
    },
    {
      id: "payment",
      question: "When is payment made?",
      answer:
        "Payment is made electronically when you submit the request through the platform, and you can review the service fee before confirming.",
    },
    {
      id: "electronic-contract",
      question: "Can the contract be received electronically?",
      answer:
        "Yes, as soon as your request is approved, the ready electronic contract is delivered directly within the platform.",
    },
    {
      id: "whatsapp",
      question: "Can I reach you over WhatsApp?",
      answer:
        "Yes, you can contact our support team directly on WhatsApp to complete your procedures easily.",
    },
    {
      id: "cancellation",
      question: "Can the request be cancelled after it's submitted?",
      answer:
        "The request can be cancelled during the initial review period by contacting our support team.",
    },
  ],
}

export function getFallbackFaqs(locale: string): FaqItem[] {
  return FALLBACK_FAQS[locale] ?? FALLBACK_FAQS.ar
}

function mapFaqItem(item: FaqApiItem): FaqItem {
  return {
    id: String(item.id),
    question: item.question?.trim() || "",
    answer: item.answer?.trim() || "",
  }
}

export async function fetchHomeFaqs(locale: string) {
  const response = await api.get<FaqsApiResponse>("/website/home/faqs", {
    language: locale,
  })

  return response.data
}

export async function getFaqContent(
  locale: string,
  fallback: FaqFallback,
): Promise<FaqContentView> {
  try {
    const data = await fetchHomeFaqs(locale)
    const items = [...(data.faqs ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapFaqItem)
      .filter((item) => item.question && item.answer)

    if (items.length === 0) {
      throw new Error("FAQ payload is empty")
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

/** List-only fetch for TanStack Query consumers; falls back to static FAQs. */
export async function fetchFaqs(locale: string): Promise<FaqItem[]> {
  const content = await getFaqContent(locale, {
    eyebrow: "",
    description: "",
    items: getFallbackFaqs(locale),
  })
  return content.items
}

export function faqQueryOptions(locale: string) {
  return queryOptions({
    queryKey: faqKeys.list(locale),
    queryFn: () => fetchFaqs(locale),
  })
}
