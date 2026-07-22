import { getTranslations } from "next-intl/server"

import SupportContactCard from "@/features/support/components/support-contact-card"

const WHATSAPP_HREF = "https://wa.me/96670006741"
const EMAIL_HREF = "mailto:info@halawasahla.com"

const CONTACT_METHODS = [
  {
    key: "email",
    href: EMAIL_HREF,
    iconSrc: "/icons/sms-tracking.svg",
  },
  {
    key: "whatsapp",
    href: WHATSAPP_HREF,
    iconSrc: "/icons/whatsapp.svg",
  },
] as const

export default async function SupportContactCards() {
  const t = await getTranslations("Support")

  return (
    <section className="pb-12 md:pb-16">
      <div className="mx-auto grid max-w-4xl gap-4 sm:gap-6 md:grid-cols-2">
        {CONTACT_METHODS.map((method) => (
          <SupportContactCard
            key={method.key}
            eyebrow={t(`cards.${method.key}.eyebrow`)}
            title={t(`cards.${method.key}.title`)}
            description={t(`cards.${method.key}.description`)}
            availability={t("cards.availability")}
            cta={t("cards.cta")}
            href={method.href}
            iconSrc={method.iconSrc}
          />
        ))}
      </div>
    </section>
  )
}
