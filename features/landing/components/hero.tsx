import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight, CircleCheck } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

export default async function Hero() {
    const t = await getTranslations("Hero")

    return (
        <section className="container grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 ps-1.5 pe-4 py-1.5 text-sm font-medium">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CircleCheck className="size-3.5" />
                    </span>
                    {t("badge")}
                </span>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
                    {t.rich("heading", {
                        primary: (chunks) => (
                            <span className="text-primary">{chunks}</span>
                        ),
                    })}
                </h1>

                <p className="max-w-lg text-balance text-muted-foreground sm:text-lg">
                    {t("description")}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                    <Button size="lg" className="gap-1.5 rounded-2xl" asChild>
                        <Link href="/renewal">
                            {t("primaryCta")}
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="gap-1.5 rounded-2xl"
                        asChild
                    >
                        <Link href="/about">
                            {t("secondaryCta")}
                            <ArrowUpRight />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="hidden md:block mx-auto w-full max-w-lg lg:max-w-none">
                <Image
                    src="/landing/hero.svg"
                    alt={t("imageAlt")}
                    width={799}
                    height={677}
                    priority
                    className="h-auto w-full"
                />
            </div>
        </section>
    )
}
