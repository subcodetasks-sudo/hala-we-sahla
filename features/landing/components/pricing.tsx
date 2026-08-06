import { getLocale, getTranslations } from "next-intl/server"

import PricingHeader from "@/features/landing/components/pricing-header"
import PricingPlans from "@/features/landing/components/pricing-plans"
import { getPlans, type PlanView } from "@/features/landing/services/plans"
import { getPricingHeader } from "@/features/landing/services/pricing"

const WHATSAPP_HREF = "https://wa.me/96670006741"

export default async function Pricing() {
  const t = await getTranslations("Pricing")
  const locale = await getLocale()

  const header = await getPricingHeader(locale, {
    eyebrow: t("eyebrow"),
    description: t("description"),
  })

  const fallbackPlans: PlanView[] = [
    {
      id: "renewal",
      title: t("planTitle"),
      description: t("planDescription"),
      price: 500,
      advantages: [
        t("requirements.nationalId"),
        t("requirements.passport"),
        t("requirements.previousContract"),
      ],
      type: "plan_renewal",
      variant: "primary",
      iconSrc: "/icons/magicpen.svg",
      iconIsRemote: false,
      ctaHref: "/renewal",
      ctaExternal: false,
      ctaLabel: t("cta"),
      ctaIconSrc: "/icons/receipt-edit.svg",
    },
    {
      id: "whatsapp",
      title: t("whatsapp.title"),
      description: t("whatsapp.description"),
      price: 600,
      advantages: [
        t("whatsapp.steps.contactSupport"),
        t("whatsapp.steps.sendData"),
        t("whatsapp.steps.completeContract"),
      ],
      type: "whatsapp",
      variant: "green",
      iconSrc: "/icons/whatsapp.svg",
      iconIsRemote: false,
      ctaHref: WHATSAPP_HREF,
      ctaExternal: true,
      ctaLabel: t("whatsapp.cta"),
      ctaIconSrc: "/icons/whatsapp.svg",
    },
  ]

  const { plans } = await getPlans(locale, fallbackPlans, {
    renewalCta: t("cta"),
    whatsappCta: t("whatsapp.cta"),
    whatsappHref: WHATSAPP_HREF,
  })

  return (
    <section className="container py-10 lg:py-16">
      <PricingHeader
        eyebrow={header.eyebrow}
        titleHtml={header.titleHtml}
        titleFallback={t.rich("heading", {
          primary: (chunks) => (
            <span className="text-primary">{chunks}</span>
          ),
        })}
        description={header.description}
      />

      <PricingPlans plans={plans} priceSuffix={t("priceSuffix")} />
    </section>
  )
}
