import { getLocale, getTranslations } from "next-intl/server"
import { ArrowLeft, CircleCheck, FileText, SaudiRiyal, Sparkles, WandSparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import CustomIcon from "@/components/custom-icon";

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

            <Card className="mx-auto mt-10 max-w-sm p-6 bg-background rounded-4xl border-t-primary/80 border-t-2">
                <div className="flex flex-col items-center gap-6 px-6 pt-8 pb-6 text-center">
                    <div className=" rounded-full bg-white shadow-sm size-12 flex items-center justify-center">
                        <CustomIcon size={24} src="/icons/magicpen.svg" className="size-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-bold">
                        {t("planTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {t("planDescription")}
                    </p>
                    <p className="mt-4 text-4xl font-bold text-primary flex items-center gap-2">
                        500 <SaudiRiyal className="size-6" />
                    </p>
                    <p className="text-xs text-muted-foreground">
                        / {t("priceSuffix")}
                    </p>
                </div>

                <ul className="flex flex-col gap-3 px-6 pb-6 mx-auto ">
                    {REQUIREMENT_KEYS.map((key) => (
                        <li
                            key={key}
                            className="flex items-center  gap-2 text-sm"
                        >
                            <CustomIcon
                                size={16}
                                src="/icons/check-green.svg"
                                className="size-4 shrink-0 text-green-500"
                                aria-hidden="true"
                            />
                            <span>{t(`requirements.${key}`)}</span>
                        </li>
                    ))}
                </ul>

                {/* <CardFooter> */}
                <Button  className="w-full gap-1.5 text-base! rounded-full hover:bg-accent! h-12!" asChild>
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
                {/* </CardFooter> */}
            </Card>
        </section>
    )
}
