import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { ArrowLeft, ChevronLeft, Mail, Phone } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CustomIcon from "@/components/custom-icon"

const PHONE_NUMBER = "+966 7000 6741"
const PHONE_HREF = "tel:+96670006741"
const EMAIL_DISPLAY = "Info@hala&sahla.com"
const EMAIL_HREF = "mailto:info@halawasahla.com"
const COMMERCIAL_REGISTRATION_NUMBER = "7000000001"
const TAX_NUMBER = "7000000006"

const SOCIAL_LINKS = [
    { key: "snapchat", href: "#", icon:"/icons/snapchat.svg" },
    { key: "instagram", href: "#", icon: "/icons/instagram.svg" },
    { key: "tiktok", href: "#", icon: "/icons/tiktok.svg" },
] as const

const IMPORTANT_LINKS = [
    { key: "renewal", href: "/renewal", icon: "/icons/repeat.svg" },
    { key: "trackOrders", href: "/track-orders", icon: "/icons/box-time.svg" },
    { key: "support", href: "/support", icon: "/icons/sms-tracking.svg" },
] as const

const QUICK_LINKS = [
    { key: "blog", href: "/blog" },
    { key: "faq", href: "/#faq" },
] as const

const LEGAL_LINKS = [
    { key: "terms", href: "/terms" },
    { key: "privacy", href: "/privacy" },
] as const

function DotSeparator() {
    return (
        <span
            aria-hidden="true"
            className="size-1 shrink-0 rounded-[1px] bg-foreground/25"
        />
    )
}

function FooterLinkList({
    links,
    t,
}: {
    links: ReadonlyArray<{ key: string; href: string; icon?: string }>
    t: (key: string) => string
}) {
    return (
        <ul className="flex flex-col gap-3">
            {links.map(({ key, href, icon }) => (
                <li key={key}>
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-sm transition-colors hover:text-foreground"
                    >
                        <ChevronLeft className="size-3.5 shrink-0 text-accent ltr:rotate-180" />
                        {icon && (
                            <CustomIcon
                                src={icon}
                                size={16}
                                className="size-4 shrink-0"
                            />
                        )}
                        {t(key)}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default async function Footer() {
    const t = await getTranslations("Footer")
    const year = new Date().getFullYear()

    return (
        <footer className="bg-footer">
            <div className="border-b border-border/60 bg-white">
                <div className="container flex flex-col items-center justify-between gap-4 py-4 text-sm text-foreground sm:flex-row sm:gap-6">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground">
                            {t("social.follow")}
                        </span>
                        <span aria-hidden="true" className="text-foreground/40">
                            -
                        </span>
                        <div className="flex items-center gap-2">
                            {SOCIAL_LINKS.map(({ key, href, icon }) => (
                                <a
                                    key={key}
                                    href={href}
                                    aria-label={t(`social.${key}`)}
                                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
                                >
                                    <CustomIcon src={icon} size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div
                        dir="ltr"
                        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start"
                    >
                        <a
                            href={PHONE_HREF}
                            className="flex items-center gap-1.5 transition-colors hover:text-primary"
                        >
                            {PHONE_NUMBER}
                            <Phone className="size-3.5 shrink-0" />
                        </a>
                        <DotSeparator />
                        <a
                            href={EMAIL_HREF}
                            className="flex items-center gap-1.5 transition-colors hover:text-primary"
                        >
                            {EMAIL_DISPLAY}
                            <Mail className="size-3.5 shrink-0" />
                        </a>
                        <DotSeparator />
                        <span dir="auto" className="font-bold ">{t("contact.supportText")}</span>
                    </div>
                </div>
            </div>

            <div className="container md:py-20">
                <div className="grid grid-cols-1 gap-10 px-4 py-10 sm:grid-cols-2 md:grid-cols-5">
                    <div className="flex flex-col items-start gap-4 md:col-span-2">
                        <Image
                            src="/logo.svg"
                            alt={t("logoAlt")}
                            width={141}
                            height={28}
                            className="h-8 w-auto"
                        />
                        <p className="max-w-sm text-sm text-balance">
                            {t("description")}
                        </p>
                        <Button
                            className="gap-1.5 h-12! text-base! rounded-full text-white"
                            asChild
                        >
                            <Link href="/renewal">
                                <CustomIcon
                                    src="/icons/receipt-edit.svg"
                                    size={16}
                                    className="size-4 shrink-0"
                                />
                                {t("cta")}
                                <ArrowLeft />
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-primary">
                            {t("columns.importantLinks.title")}
                        </h3>
                        <FooterLinkList
                            links={IMPORTANT_LINKS}
                            t={(key) => t(`columns.importantLinks.${key}`)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-primary">
                            {t("columns.quickLinks.title")}
                        </h3>
                        <FooterLinkList
                            links={QUICK_LINKS}
                            t={(key) => t(`columns.quickLinks.${key}`)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-primary">
                            {t("columns.licenses.title")}
                        </h3>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li>
                                {t("columns.licenses.commercialRegister")}:{" "}
                                {COMMERCIAL_REGISTRATION_NUMBER}
                            </li>
                            <li>
                                {t("columns.licenses.taxNumber")}: {TAX_NUMBER}
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col-reverse items-center justify-between gap-3 px-4 py-4 text-xs sm:flex-row">
                    <p>{t("copyright", { year })}</p>
                    <div className="flex items-center gap-3">
                        {LEGAL_LINKS.map(({ key, href }, index) => (
                            <span key={key} className="flex items-center gap-3">
                                {index > 0 && <span aria-hidden="true">•</span>}
                                <Link
                                    href={href}
                                    className="transition-colors hover:text-foreground"
                                >
                                    {t(`legal.${key}`)}
                                </Link>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
