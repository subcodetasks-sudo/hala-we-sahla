import { getLocale, getTranslations } from "next-intl/server"
import Image from "next/image"
import { ArrowLeft, ChevronLeft } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CustomIcon from "@/components/custom-icon"
import { FooterContactBar } from "@/features/landing/components/footer-contact-bar"
import { SiteLogo } from "@/features/landing/components/site-logo"
import { buildSiteSettingsFallback } from "@/features/landing/lib/site-settings-fallback"
import { getSiteSettings, type SiteSettingsView } from "@/features/landing/services/settings"

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
                        className="flex items-center gap-1 text-sm transition-colors hover:text-white"
                    >
                        <ChevronLeft className="size-3.5 shrink-0 text-white ltr:rotate-180" />
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

export default async function Footer({
    settings: settingsProp,
}: {
    settings?: SiteSettingsView
}) {
    const t = await getTranslations("Footer")
    const locale = await getLocale()
    const year = new Date().getFullYear()
    const settings =
        settingsProp ??
        (await getSiteSettings(
            locale,
            buildSiteSettingsFallback({ description: t("description") }),
        ))

    return (
        <footer className="bg-primary">
            <FooterContactBar
                settings={settings}
                followLabel={t("social.follow")}
                supportText={t("contact.supportText")}
                socialLabelFor={(key) => t(`social.${key}`)}
            />

            <div className="container md:py-20 text-white">
                <div className="grid grid-cols-1 gap-10 px-4 py-10 sm:grid-cols-2 md:grid-cols-5">
                    <div className="flex flex-col items-start gap-4 md:col-span-2 md:gap-6">
                        <SiteLogo
                            src={"/images/logo-mono.png"}
                            alt={t("logoAlt")}
                            width={141}
                            height={28}
                            className="h-16 w-auto "
                        />
                        <p className="max-w-sm  text-balance  leading-relaxed">
                            {settings.description}
                        </p>
                        <Button
                            className="gap-1.5 h-12! text-base! rounded-full text-primary! bg-white!"
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
                        <h3 className="text-sm font-semibold text-black">
                            {t("columns.importantLinks.title")}
                        </h3>
                        <FooterLinkList
                            links={IMPORTANT_LINKS}
                            t={(key) => t(`columns.importantLinks.${key}`)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-black">
                            {t("columns.quickLinks.title")}
                        </h3>
                        <FooterLinkList
                            links={QUICK_LINKS}
                            t={(key) => t(`columns.quickLinks.${key}`)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-semibold text-black">
                            {t("columns.licenses.title")}
                        </h3>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li>
                                {t("columns.licenses.commercialRegister")}:{" "}
                                {settings.commercialRegister}
                            </li>
                            <li>
                                {t("columns.licenses.taxNumber")}: {settings.taxNumber}
                            </li>
                        </ul>
                        <a href="https://maroof.sa/" target="_blank">
                            <Image
                                src="/images/maroof.png"
                                alt={t("logoAlt")}
                                width={141}
                                height={28}
                                className=" w-1/2"
                            />
                        </a>
                    </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex flex-col-reverse items-center justify-between gap-3 px-4 py-4  sm:flex-row">
                    <p>{t("copyright", { year })}</p>
                    <div className="flex items-center gap-3">
                        {LEGAL_LINKS.map(({ key, href }, index) => (
                            <span key={key} className="flex items-center gap-3">
                                {index > 0 && <span aria-hidden="true">•</span>}
                                <Link
                                    href={href}
                                    className="transition-colors hover:text-white"
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
