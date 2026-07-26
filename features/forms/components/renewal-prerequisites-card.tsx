import { ArrowLeft, SaudiRiyal } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatNumber } from "@/lib/format"

const PLAN_PRICE = 199

const REQUIREMENT_ITEMS = [
  {
    key: "employer",
    icon: "/icons/user-square.svg",
  },
  {
    key: "worker",
    icon: "/icons/user-octagon.svg",
  },
  {
    key: "documents",
    icon: "/icons/ticket-2.svg",
  },
] as const

export default async function RenewalPrerequisitesCard() {
  const t = await getTranslations("Forms.renewal.prerequisites")
  const locale = await getLocale()

  return (
    <Card className="mx-auto w-full max-w-lg gap-0 rounded-4xl bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <CustomIcon
            src="/icons/hand.svg"
            size={24}
            className="size-6 text-primary"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {t("title")}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>

        <p className="mt-5 flex flex-wrap items-center justify-center gap-1.5 font-clash text-3xl font-bold text-primary sm:text-4xl">
          <span>{formatNumber(PLAN_PRICE, locale)}</span>
          <SaudiRiyal className="size-6 sm:size-7" aria-hidden="true" />
          <span className="text-base font-semibold sm:text-lg">
            / {t("priceSuffix")}
          </span>
        </p>
      </div>

      <Separator className="my-6 sm:my-8" />

      <div>
        <p className="text-sm text-muted-foreground">{t("documentsLabel")}</p>

        <ul className="mt-5 flex flex-col gap-5">
          {REQUIREMENT_ITEMS.map(({ key, icon }) => (
            <li key={key} className="flex items-start gap-3">
              <CustomIcon
                src={icon}
                size={28}
                className="mt-0.5 size-7 shrink-0 text-foreground"
              />
              <div className="min-w-0 flex-1 text-start">
                <p className="font-bold text-foreground">
                  {t(`items.${key}.title`)}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${key}.description`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Button className="mt-8 h-12! w-full gap-1.5 rounded-full text-base! text-white">
        <CustomIcon
          src="/icons/receipt-edit.svg"
          size={16}
          className="size-4 shrink-0 text-white"
        />
        {t("cta")}
        <ArrowLeft className="ltr:rotate-180" />
      </Button>
    </Card>
  )
}
