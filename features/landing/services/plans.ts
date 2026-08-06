import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { plansKeys } from "@/features/landing/query-keys"

export type PlanApiItem = {
  id: number
  icon: string | null
  title: string
  title_ar: string
  title_en: string
  description: string
  description_ar: string
  description_en: string
  price: number
  advantages: string[]
  type: string
  type_label: string
}

type PlansApiResponse = {
  success: boolean
  message: string
  data: PlanApiItem[]
}

export type PlanVariant = "primary" | "green"

export type PlanView = {
  id: string
  title: string
  description: string
  price: number
  advantages: string[]
  type: string
  variant: PlanVariant
  iconSrc: string
  iconIsRemote: boolean
  ctaHref: string
  ctaExternal: boolean
  ctaLabel: string
  ctaIconSrc: string
}

export type PlansFallbackLabels = {
  renewalCta: string
  whatsappCta: string
  whatsappHref: string
}

function pickLocalized(
  locale: string,
  ar: string | undefined,
  en: string | undefined,
  fallback: string,
) {
  const value = locale === "en" ? en || fallback : ar || fallback
  return value?.trim() || fallback.trim()
}

function toPlanVariant(type: string): PlanVariant {
  return type === "whatsapp" ? "green" : "primary"
}

function mapPlan(
  item: PlanApiItem,
  locale: string,
  labels: PlansFallbackLabels,
): PlanView {
  const isWhatsapp = item.type === "whatsapp"
  const iconSrc = item.icon?.trim() || ""
  const iconIsRemote = /^https?:\/\//i.test(iconSrc)

  return {
    id: String(item.id),
    title: pickLocalized(locale, item.title_ar, item.title_en, item.title),
    description: pickLocalized(
      locale,
      item.description_ar,
      item.description_en,
      item.description,
    ),
    price: Number(item.price) || 0,
    advantages: (item.advantages ?? []).filter(Boolean),
    type: item.type,
    variant: toPlanVariant(item.type),
    iconSrc: iconIsRemote
      ? iconSrc
      : isWhatsapp
        ? "/icons/whatsapp.svg"
        : "/icons/magicpen.svg",
    iconIsRemote,
    ctaHref: isWhatsapp ? labels.whatsappHref : "/renewal",
    ctaExternal: isWhatsapp,
    ctaLabel: isWhatsapp ? labels.whatsappCta : labels.renewalCta,
    ctaIconSrc: isWhatsapp
      ? "/icons/whatsapp.svg"
      : "/icons/receipt-edit.svg",
  }
}

export async function fetchPlans(locale: string): Promise<PlanApiItem[]> {
  const response = await api.get<PlansApiResponse>("/website/plans", {
    language: locale,
  })

  return response.data
}

export function resolveRenewalPlanId(
  plans: PlanApiItem[] | undefined,
  fallbackPlanId = 1,
) {
  const renewalPlan = plans?.find((plan) => plan.type === "plan_renewal")
  return renewalPlan?.id ?? fallbackPlanId
}

export function resolveRenewalPlanPrice(
  plans: PlanApiItem[] | undefined,
  fallbackPlanPrice = 500,
) {
  const renewalPlan = plans?.find((plan) => plan.type === "plan_renewal")
  const price = Number(renewalPlan?.price)

  return price > 0 ? price : fallbackPlanPrice
}

export async function getRenewalPlanPrice(
  locale: string,
  fallbackPlanPrice = 500,
) {
  try {
    const plans = await fetchPlans(locale)
    return resolveRenewalPlanPrice(plans, fallbackPlanPrice)
  } catch {
    return fallbackPlanPrice
  }
}

export function plansQueryOptions(locale: string) {
  return queryOptions({
    queryKey: plansKeys.list(locale),
    queryFn: () => fetchPlans(locale),
    staleTime: 5 * 60 * 1000,
  })
}

export async function getPlans(
  locale: string,
  fallback: PlanView[],
  labels: PlansFallbackLabels,
): Promise<{ plans: PlanView[]; source: "api" | "fallback" }> {
  try {
    const data = await fetchPlans(locale)
    const plans = (data ?? [])
      .map((item) => mapPlan(item, locale, labels))
      .filter((plan) => plan.title && plan.price > 0)

    if (plans.length === 0) {
      throw new Error("Plans payload is empty")
    }

    return { plans, source: "api" }
  } catch {
    return { plans: fallback, source: "fallback" }
  }
}
