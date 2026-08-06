import { getLocale, getTranslations } from "next-intl/server"

import SupportContactCardsView from "@/features/support/components/support-contact-cards-view"
import SupportHeaderView from "@/features/support/components/support-header-view"
import SupportInquiryForm from "@/features/support/components/support-inquiry-form"
import { buildSiteSettingsFallback } from "@/features/landing/lib/site-settings-fallback"
import { getSiteSettings } from "@/features/landing/services/settings"
import { INQUIRY_TYPE_KEYS } from "@/features/support/schemas/support-inquiry"
import {
  getSupportContent,
  type SupportCardView,
  type InquiryTypeView,
} from "@/features/support/services/support"

function buildFallbackCards(
  t: (key: string) => string,
  settings: { emailHref: string; whatsappHref: string },
): SupportCardView[] {
  const FALLBACK_CARD_KEYS = [
    {
      key: "email" as const,
      href: settings.emailHref,
      iconSrc: "/icons/sms-tracking.svg",
    },
    {
      key: "whatsapp" as const,
      href: settings.whatsappHref,
      iconSrc: "/icons/whatsapp.svg",
    },
  ]

  return FALLBACK_CARD_KEYS.map((method) => ({
    id: method.key,
    eyebrow: t(`cards.${method.key}.eyebrow`),
    title: t(`cards.${method.key}.title`),
    description: t(`cards.${method.key}.description`),
    availability: t("cards.availability"),
    cta: t("cards.cta"),
    href: method.href,
    iconSrc: method.iconSrc,
    imageIsRemote: false,
  }))
}

function buildFallbackInquiryTypes(
  t: (key: string) => string,
): InquiryTypeView[] {
  return INQUIRY_TYPE_KEYS.map((key) => ({
    id: key,
    label: t(`form.fields.inquiryType.options.${key}`),
  }))
}

export default async function SupportPage() {
  const locale = await getLocale()
  const t = await getTranslations("Support")
  const tFooter = await getTranslations("Footer")
  const settings = await getSiteSettings(
    locale,
    buildSiteSettingsFallback({ description: tFooter("description") }),
  )

  const support = await getSupportContent(locale, {
    eyebrow: t("eyebrow"),
    title: t("heading"),
    description: t("description"),
    cardAvailability: t("cards.availability"),
    cards: buildFallbackCards(t, settings),
    formTitle: t("form.title"),
    formDescription: t("form.description"),
    inquiryTypes: buildFallbackInquiryTypes(t),
  })

  return (
    <div className="container">
      <SupportHeaderView
        eyebrow={support.eyebrow}
        titleHtml={support.titleHtml}
        titleFallback={t.rich("heading", {
          primary: (chunks) => (
            <span className="font-medium text-primary">{chunks}</span>
          ),
        })}
        description={support.description}
      />
      <SupportContactCardsView cards={support.cards} />
      <SupportInquiryForm
        formTitleHtml={support.formTitleHtml}
        formTitle={support.formTitle}
        formDescription={support.formDescription}
        inquiryTypes={support.inquiryTypes}
      />
    </div>
  )
}
