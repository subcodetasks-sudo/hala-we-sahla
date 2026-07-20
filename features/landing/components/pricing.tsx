import { getLocale, getTranslations } from "next-intl/server"
import { ArrowLeft, CircleCheck, FileText, Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"

const REQUIREMENT_KEYS = ["nationalId", "passport", "previousContract"] as const

const PLAN_PRICE = 500
const PLAN_CURRENCY = "SAR"

export default async function Pricing() {
    const t = await getTranslations("Pricing")
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

            <Card className="mx-auto mt-10 max-w-sm p-14 bg-background rounded-4xl border-t-primary/80 border-t-2">
                <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-6 text-center">
                    <div className="p-2 rounded-full bg-white shadow-sm">
                        <Sparkles className="size-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold">
                        {t("planTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {t("planDescription")}
                    </p>
                    <p className="mt-4 text-3xl font-bold text-primary">
                        {formatCurrency(PLAN_PRICE, PLAN_CURRENCY, locale)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        / {t("priceSuffix")}
                    </p>
                </div>

                <ul className="flex flex-col gap-3 px-6 pb-6">
                    {REQUIREMENT_KEYS.map((key) => (
                        <li
                            key={key}
                            className="flex items-center justify-center gap-2 text-sm"
                        >
                            <span>{t(`requirements.${key}`)}</span>
                            <CircleCheck
                                className="size-4 shrink-0 text-primary"
                                aria-hidden="true"
                            />
                        </li>
                    ))}
                </ul>

                {/* <CardFooter> */}
                <Button size="lg" className="w-full gap-1.5 rounded-2xl" asChild>
                    <Link href="/renewal">
                        <FileText />
                        {t("cta")}
                        <ArrowLeft />
                    </Link>
                </Button>
                {/* </CardFooter> */}
            </Card>
        </section>
    )
}
