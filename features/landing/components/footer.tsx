import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { ArrowLeft, ChevronLeft, Headset, Mail, Phone } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CustomIcon from "@/components/custom-icon"

const PHONE_NUMBER = "+966 7000 6741"
const EMAIL_DISPLAY = "info@hala&sahla.com"
const EMAIL_HREF = "mailto:info@halawasahla.com"
const COMMERCIAL_REGISTRATION_NUMBER = "7000000001"
const TAX_NUMBER = "7000000006"

const SOCIAL_LINKS = [
    { key: "tiktok", href: "#", icon: "/landing/icons/tiktok.svg" },
    { key: "instagram", href: "#", icon: "/landing/icons/instagram.svg" },
    { key: "x", href: "#", icon: "/landing/icons/x.svg" },
] as const

const IMPORTANT_LINKS = [
    { key: "renewal", href: "/renewal" },
    { key: "trackOrders", href: "/track-orders" },
    { key: "support", href: "/support" },
] as const

const QUICK_LINKS = [
    { key: "blog", href: "/blog" },
    { key: "faq", href: "/faq" },
] as const

const LEGAL_LINKS = [
    { key: "terms", href: "/terms" },
    { key: "privacy", href: "/privacy" },
] as const

function FooterLinkList({
    links,
    t,
}: {
    links: ReadonlyArray<{ key: string; href: string }>
    t: (key: string) => string
}) {
    return (
        <ul className="flex flex-col gap-3">
            {links.map(({ key, href }) => (
                <li key={key}>
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {t(key)}
                        <ChevronLeft className="size-3.5 shrink-0" />
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
            <div className="container md:py-20">
                <div className="flex flex-col-reverse flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:text-[13px]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="flex items-center gap-1.5">
                            <Phone className="size-3.5 shrink-0" />
                            {PHONE_NUMBER}
                        </span>
                        <Separator orientation="vertical" className="hidden h-3 sm:block" />
                        <a href={EMAIL_HREF} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                            <Mail className="size-3.5 shrink-0" />
                            {EMAIL_DISPLAY}
                        </a>
                        <Separator orientation="vertical" className="hidden h-3 sm:block" />
                        <span className="flex items-center gap-1.5">
                            <Headset className="size-3.5 shrink-0" />
                            {t("contact.supportText")}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">{t("social.follow")}</span>
                        <div className="flex items-center gap-2">
                            {SOCIAL_LINKS.map(({ key, href, icon }) => (
                                <a
                                    key={key}
                                    href={href}
                                    aria-label={t(`social.${key}`)}
                                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary"
                                >
                                    <CustomIcon src={icon} size={14} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-10 px-4 py-10 sm:grid-cols-2 md:grid-cols-5">
                    <div className="flex flex-col items-start gap-4 md:col-span-2">
                        <Image
                            src="/logo.svg"
                            alt={t("logoAlt")}
                            width={141}
                            height={28}
                            className="h-8 w-auto"
                        />
                        <p className="max-w-sm text-sm text-muted-foreground text-balance">
                            {t("description")}
                        </p>
                        <Button size="lg" className="gap-1.5 rounded-2xl" asChild>
                            <Link href="/renewal">
                                {t("cta")}
                                <ArrowLeft />
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-primary">{t("columns.importantLinks.title")}</h3>
                        <FooterLinkList
                            links={IMPORTANT_LINKS}
                            t={(key) => t(`columns.importantLinks.${key}`)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-primary">{t("columns.quickLinks.title")}</h3>
                        <FooterLinkList
                            links={QUICK_LINKS}
                            t={(key) => t(`columns.quickLinks.${key}`)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-primary">{t("columns.licenses.title")}</h3>
                        <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                            <li>
                                {t("columns.licenses.commercialRegister")}: {COMMERCIAL_REGISTRATION_NUMBER}
                            </li>
                            <li>
                                {t("columns.licenses.taxNumber")}: {TAX_NUMBER}
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col-reverse items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
                    <p>{t("copyright", { year })}</p>
                    <div className="flex items-center gap-3">
                        {LEGAL_LINKS.map(({ key, href }, index) => (
                            <span key={key} className="flex items-center gap-3">
                                {index > 0 && <span aria-hidden="true">•</span>}
                                <Link href={href} className="transition-colors hover:text-foreground">
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
