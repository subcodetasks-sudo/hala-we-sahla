import { getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { NumberTicker } from "@/components/ui/number-ticker"

const STATS_ITEMS = [
  {
    key: "satisfaction",
    icon: "/icons/profile-tick.svg",
    kind: "percent",
    value: 96,
  },
  {
    key: "contracts",
    icon: "/icons/receipt-edit.svg",
    kind: "count",
    value: 8000,
  },
  {
    key: "requests",
    icon: "/icons/receipt-item.svg",
    kind: "count",
    value: 13500,
  },
] as const

export default async function Stats() {
  const t = await getTranslations("Stats")

  return (
    <section className="container py-10 lg:py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold text-accent">{t("eyebrow")}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {t.rich("heading", {
            primary: (chunks) => (
              <span key="primary" className="text-primary">
                {chunks}
              </span>
            ),
          })}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("description")}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {STATS_ITEMS.map(({ key, icon, kind, value }) => (
          <div
            key={key}
            className="rounded-4xl bg-linear-to-b from-primary to-transparent p-px"
          >
            <div className="flex w-full flex-col items-center gap-6 rounded-4xl bg-background px-6 py-10 text-center">
              <CustomIcon
                size={48}
                src={icon}
                className="size-12 text-primary"
                aria-hidden="true"
              />
              <span className="font-clash text-3xl font-bold text-primary">
                <NumberTicker
                  value={value}
                  className="font-clash text-3xl font-bold text-primary"
                />
                {kind === "percent" ? "%" : "+"}
              </span>
              <p className="text-sm font-medium text-foreground/80">
                {t(`items.${key}`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
