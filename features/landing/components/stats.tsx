import { getLocale, getTranslations } from "next-intl/server"
import { FileSignature, Receipt, UserCheck } from "lucide-react"
import { formatNumber } from "@/lib/format"
import CustomIcon from "@/components/custom-icon";

const STATS_ITEMS = [
    { key: "satisfaction", icon: "/icons/profile-tick.svg", kind: "percent", value: 0.96 },
    { key: "contracts", icon: "/icons/receipt-edit.svg", kind: "count", value: 8000 },
    { key: "requests", icon: "/icons/receipt-item.svg", kind: "count", value: 13500 },
] as const

function formatStatValue(
    locale: string,
    kind: "percent" | "count",
    value: number,
) {
    if (kind === "percent") {
        return formatNumber(value, locale, { style: "percent" })
    }

    return formatNumber(value, locale, { signDisplay: "exceptZero" })
}

export default async function Stats() {
    const t = await getTranslations("Stats")
    const locale = await getLocale()

    return (
        <section className="container py-10 lg:py-16">
            <div className="mx-auto max-w-xl text-center">
                <p className="text-sm font-semibold text-accent">
                    {t("eyebrow")}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                    {t.rich("heading", {
                        primary: (chunks) => (
                            <span className="text-primary">{chunks}</span>
                        ),
                    })}
                </h2>
                <p className="mt-3 text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {STATS_ITEMS.map(({ key, icon: Icon, kind, value }) => (
                    <div
                        key={key}
                        className="flex flex-col items-center gap-6 rounded-4xl bg-background px-6 py-10 text-center border-t-2 border-primary/80"
                    >
                        <CustomIcon size={48} src={Icon as string} className="size-12 text-primary" aria-hidden="true" />
                        <span className="text-3xl font-bold text-primary">
                            {formatStatValue(locale, kind, value)}
                        </span>
                        <p className="text-sm font-medium text-foreground/80">
                            {t(`items.${key}`)}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
