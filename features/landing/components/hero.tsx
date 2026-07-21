import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight, CircleCheck } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import CustomIcon from "@/components/custom-icon";

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
                    <Button  className="gap-1.5 rounded-full text-base! h-fit! p-3 bg-black hover:bg-accent! shadow-primary/20! shadow-xl" asChild>
                        <Link href="/renewal">
                            <CustomIcon src="/icons/receipt-edit.svg" className="size-4" />
                            {t("primaryCta")}
                            <div className="flex items-center gap-2 size-8 shrink-0  justify-center rounded-full bg-white text-black ">
                                <ArrowUpRight className="rtl:-rotate-90" />
                            </div>
                        </Link>
                    </Button>
                    <Button
                    
                        className="gap-1.5 h-12! text-lg! bg-transparent! text-black"
                        asChild
                    >
                        <Link href="/about">
                            <CustomIcon src="/icons/box-time.svg" className="size-4" />
                            {t("secondaryCta")}
                            <ArrowLeft className="ltr:rotate-180" />
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
