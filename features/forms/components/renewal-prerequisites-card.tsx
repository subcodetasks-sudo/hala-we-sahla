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
    <div className="renewal-prereq mx-auto w-full max-w-3xl overflow-hidden rounded-[28px] bg-linear-to-b from-primary to-transparent p-px sm:rounded-[40px]">
      <Card className="renewal-prereq-card w-full gap-0 overflow-visible rounded-[27px] border-none bg-card px-5 py-6 shadow-none ring-0 sm:rounded-[39px] sm:px-10 sm:py-10">
        <div className="renewal-prereq-header flex flex-col items-center text-center">
          <div className="renewal-prereq-icon flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:size-14">
            <CustomIcon
              src="/icons/hand.svg"
              size={28}
              className="size-6 text-primary sm:size-7"
            />
          </div>

          <h2 className="renewal-prereq-title mt-4 text-xl font-bold tracking-tight wrap-break-word text-foreground sm:mt-5 sm:text-2xl">
            {t("title")}
          </h2>

          <p className="renewal-prereq-subtitle mt-2 max-w-md text-sm leading-relaxed wrap-break-word text-muted-foreground sm:text-base">
            {t("subtitle")}
          </p>

          <p className="renewal-prereq-price mt-4 flex flex-wrap items-center justify-center gap-1.5 font-clash text-3xl text-primary sm:mt-5 sm:text-4xl">
            <span className="font-semibold">
              {formatNumber(PLAN_PRICE, locale)}
            </span>
            <SaudiRiyal className="size-5 shrink-0 sm:size-6" aria-hidden="true" />
            <span className="text-sm font-medium text-muted-foreground sm:text-base">
              / {t("priceSuffix")}
            </span>
          </p>
        </div>

        <Separator className="renewal-prereq-separator my-5 sm:my-7" />

        <div className="renewal-prereq-docs min-w-0">
          <p className="text-sm font-medium text-muted-foreground sm:text-base">
            {t("documentsLabel")}
          </p>

          <ul className="renewal-prereq-list mt-4 flex flex-col gap-4 sm:mt-5 sm:gap-5">
            {REQUIREMENT_ITEMS.map(({ key, icon }) => (
              <li key={key} className="flex min-w-0 items-start gap-3 sm:gap-3.5">
                <CustomIcon
                  src={icon}
                  size={28}
                  className="mt-0.5 size-6 shrink-0 text-foreground sm:size-7"
                />
                <div className="min-w-0 flex-1 text-start">
                  <p className="text-sm leading-relaxed wrap-break-word text-muted-foreground sm:text-[15px] sm:leading-7">
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
          className="renewal-prereq-cta mt-6 h-12! w-full gap-1.5 rounded-full text-base! text-white sm:mt-8 sm:h-14!"
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
