import { getTranslations } from "next-intl/server"
import { ArrowLeft, SaudiRiyal } from "lucide-react"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"

const REQUIREMENT_KEYS = ["nationalId", "passport", "previousContract"] as const
const WHATSAPP_STEP_KEYS = [
  "contactSupport",
  "sendData",
  "completeContract",
] as const
const WHATSAPP_HREF = "https://wa.me/96670006741"

export default async function Pricing() {
  const t = await getTranslations("Pricing")

  return (
    <section className="container py-10 lg:py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold text-accent">{t("eyebrow")}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {t.rich("heading", {
            primary: (chunks) => (
              <span className="text-primary">{chunks}</span>
            ),
          })}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("description")}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
        {/* Renewal package */}
        <div className="rounded-4xl bg-linear-to-b from-primary to-transparent p-px">
          <Card className="flex h-full flex-col rounded-4xl bg-background p-6">
            <div className="flex flex-col items-center gap-6 px-6 pt-8 pb-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                <CustomIcon
                  size={24}
                  src="/icons/magicpen.svg"
                  className="size-6 text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-heading text-lg font-bold">{t("planTitle")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("planDescription")}
              </p>
              <p className="mt-4 flex items-center gap-2 font-clash text-4xl font-bold text-primary">
                500 <SaudiRiyal className="size-6" />
              </p>
              <p className="text-xs text-muted-foreground">/ {t("priceSuffix")}</p>
            </div>

            <ul className="mx-auto flex w-fit flex-col items-start gap-3 px-6 pb-6 text-start">
              {REQUIREMENT_KEYS.map((key) => (
                <li key={key} className="flex items-center gap-2 text-sm">
                  <CustomIcon
                    size={16}
                    src="/icons/check-green.svg"
                    className="size-4 shrink-0 text-custom-green"
                    aria-hidden="true"
                  />
                  <span>{t(`requirements.${key}`)}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-auto h-12! w-full gap-1.5 rounded-full text-base! "
              asChild
            >
              <Link href="/renewal">
                <CustomIcon
                  size={16}
                  src="/icons/receipt-edit.svg"
                  className="size-4 shrink-0 text-white"
                  aria-hidden="true"
                />
                {t("cta")}
                <ArrowLeft className="ltr:rotate-180" />
              </Link>
            </Button>
          </Card>
        </div>

        {/* WhatsApp service */}
        <div className="rounded-4xl bg-linear-to-b from-custom-green to-transparent p-px">
          <Card className="flex h-full flex-col rounded-4xl bg-green-50 p-6">
            <div className="flex flex-col items-center gap-6 px-6 pt-8 pb-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                <CustomIcon
                  size={24}
                  src="/icons/whatsapp.svg"
                  className="size-6 text-custom-green"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-heading text-lg font-bold">
                {t("whatsapp.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("whatsapp.description")}
              </p>
              <p className="mt-4 flex items-center gap-2 font-clash text-4xl font-bold text-custom-green">
                600 <SaudiRiyal className="size-6" />
              </p>
              <p className="text-xs text-muted-foreground">
                / {t("priceSuffix")}
              </p>
            </div>

            <ul className="mx-auto flex w-fit flex-col items-start gap-3 px-6 pb-6 text-start">
              {WHATSAPP_STEP_KEYS.map((key) => (
                <li key={key} className="flex items-center gap-2 text-sm">
                  <CustomIcon
                    size={16}
                    src="/icons/check-green.svg"
                    className="size-4 shrink-0 text-custom-green"
                    aria-hidden="true"
                  />
                  <span>{t(`whatsapp.steps.${key}`)}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-auto h-12! w-full gap-1.5 rounded-full bg-custom-green text-base! text-white hover:bg-custom-green/90!"
              asChild
            >
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CustomIcon
                  size={16}
                  src="/icons/whatsapp.svg"
                  className="size-4 shrink-0 text-white"
                  aria-hidden="true"
                />
                {t("whatsapp.cta")}
                <ArrowLeft className="ltr:rotate-180" />
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
