import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { ArrowLeft, FilePenLine, MessageCircle, Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SERVICE_ITEMS = [
    {
        key: "request",
        href: "/renewal",
        icon: FilePenLine,
        image: "/landing/servcies-1.svg",
        tone: "primary",
        imageFirst: false,
    },
    {
        key: "whatsapp",
        href: "/support",
        icon: MessageCircle,
        image: "/landing/services-2.svg",
        tone: "primary",
        imageFirst: true,
    },
    {
        key: "tracking",
        href: "/track-orders",
        icon: Sparkles,
        image: "/landing/services-3.svg",
        tone: "accent",
        imageFirst: false,
    },
] as const

export default async function Services() {
    const t = await getTranslations("Services")

    return (
        <section className="w-full py-16 lg:py-24">
            <div className="container">
                <div className="mx-auto max-w-xl text-center">
                    <p className="text-sm font-semibold text-accent">
                        {t("eyebrow")}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                        {t.rich("heading", {
                            accent: (chunks) => (
                                <span className="text-accent">{chunks}</span>
                            ),
                        })}
                    </h2>
                </div>

                <div className="mt-16 flex flex-col gap-16 lg:mt-20 lg:gap-24">
                    {SERVICE_ITEMS.map(
                        ({ key, href, icon: Icon, image, tone, imageFirst }) => {
                            const toneText =
                                tone === "accent" ? "text-accent" : "text-primary"

                            const textBlock = (
                                <div
                                    key="text"
                                    className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-start"
                                >
                                    <span className="flex size-12 items-center justify-center rounded-full bg-white/10">
                                        <Icon
                                            className={cn("size-5", toneText)}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <h3 className="text-2xl font-bold sm:text-3xl">
                                        <span className="block ">
                                            {t(`items.${key}.titleLine1`)}
                                        </span>
                                        <span className={cn("block", toneText)}>
                                            {t(`items.${key}.titleLine2`)}
                                        </span>
                                    </h3>

                                    <p className="max-w-sm">
                                        {t(`items.${key}.description`)}
                                    </p>

                                    <Button
                                        size="lg"
                                        className={cn(
                                            "gap-1.5 rounded-2xl",
                                            tone === "accent" &&
                                                "bg-accent text-accent-foreground hover:bg-accent/80!",
                                        )}
                                        asChild
                                    >
                                        <Link href={href}>
                                            <Icon />
                                            {t(`items.${key}.cta`)}
                                            <ArrowLeft />
                                        </Link>
                                    </Button>
                                </div>
                            )

                            const imageBlock = (
                                <div
                                    key="image"
                                    className="mx-auto w-full max-w-md lg:max-w-none"
                                >
                                    <Image
                                        src={image}
                                        alt={t(`items.${key}.imageAlt`)}
                                        width={844}
                                        height={538}
                                        className="h-auto w-full"
                                    />
                                </div>
                            )

                            return (
                                <div
                                    key={key}
                                    className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                                >
                                    {imageFirst
                                        ? [imageBlock, textBlock]
                                        : [textBlock, imageBlock]}
                                </div>
                            )
                        },
                    )}
                </div>
            </div>
        </section>
    )
}
