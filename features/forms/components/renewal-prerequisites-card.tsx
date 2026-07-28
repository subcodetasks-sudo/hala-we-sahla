import { ArrowLeft, SaudiRiyal } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/navigation"
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
    <div className="mx-auto w-full max-w-xl rounded-[28px] bg-linear-to-b from-primary to-transparent p-px sm:rounded-[40px]">
      <Card className="w-full gap-0 overflow-visible rounded-[28px] border-none bg-card px-4 py-6 shadow-none ring-0 sm:rounded-[40px] sm:px-8 sm:py-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:size-12">
            <CustomIcon
              src="/icons/hand.svg"
              size={24}
              className="size-5 text-primary sm:size-6"
            />
          </div>

          <h2 className="mt-4 text-lg font-bold tracking-tight wrap-break-word text-foreground sm:mt-5 sm:text-xl">
            {t("title")}
          </h2>

          <p className="mt-1.5 text-sm leading-relaxed wrap-break-word text-muted-foreground sm:mt-2">
            {t("subtitle")}
          </p>

          <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 font-clash text-2xl text-primary sm:mt-5 sm:text-4xl">
            <span className="font-semibold">
              {formatNumber(PLAN_PRICE, locale)}
            </span>
            <SaudiRiyal className="size-4.5 shrink-0 sm:size-5" aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground sm:text-base">
              / {t("priceSuffix")}
            </span>
          </p>
        </div>

        <Separator className="my-5 sm:my-8" />

        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {t("documentsLabel")}
          </p>

          <ul className="mt-4 flex flex-col gap-4 sm:mt-5 sm:gap-5">
            {REQUIREMENT_ITEMS.map(({ key, icon }) => (
              <li key={key} className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                <CustomIcon
                  src={icon}
                  size={28}
                  className="mt-0.5 size-6 shrink-0 text-foreground sm:size-7"
                />
                <div className="min-w-0 flex-1 text-start">
                  <p className="text-[13px] leading-6 wrap-break-word text-muted-foreground sm:text-sm sm:leading-relaxed">
                    <span className="font-bold text-foreground">
                      {t(`items.${key}.title`)}
                    </span>{" "}
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Button
          asChild
          className="mt-6 h-11! w-full gap-1.5 rounded-full text-sm! text-white sm:mt-8 sm:h-12! sm:text-base!"
        >
          <Link href="/renewal/create">
            <CustomIcon
              src="/icons/receipt-edit.svg"
              size={16}
              className="size-4 shrink-0 text-white"
            />
            {t("cta")}
            <ArrowLeft className="ltr:rotate-180" aria-hidden="true" />
          </Link>
        </Button>
      </Card>
    </div>
  )
}
