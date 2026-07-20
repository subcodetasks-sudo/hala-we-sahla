"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { useDirection } from "@/components/ui/direction"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/features/landing/components/language-switcher"
import { cn } from "@/lib/utils"
import {
    ArrowLeft,
    CircleCheck,
    HelpCircle,
    Home,
    Menu,
    RefreshCw,
    Truck,
    User,
} from "lucide-react"
import Image from "next/image"

const NAV_ITEMS = [
    { href: "/", key: "home", icon: Home },
    { href: "/renewal", key: "renewal", icon: RefreshCw },
    { href: "/track-orders", key: "trackOrders", icon: Truck },
    { href: "/support", key: "support", icon: HelpCircle },
] as const

export default function Header() {
    const t = useTranslations("Header")
    const pathname = usePathname()
    const direction = useDirection()
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="md:flex md:items-center md:gap-2 pt-4">
                <div className="hidden md:flex bg-linear-90 from-black/50 via-white to-transparent w-full h-0.5"></div>
                <div className="flex font-semibold items-center justify-center gap-2 px-4 py-2 text-center text-xs md:text-md sm:text-[14px]">
                    <p className="line-clamp-1">
                        <span>{t("announcement.text")}</span>{" "}
                        <Link
                            href="/renewal"
                            className="font-semibold underline underline-offset-2 text-primary hover:text-accent/80"
                        >
                            {t("announcement.cta")}
                        </Link>
                    </p>
                    <CircleCheck className="hidden size-4 shrink-0 sm:block" />
                </div>
                <div className="hidden md:flex bg-linear-90 from-transparent via-white to-black/50 w-full h-0.5"></div>
            </div>
            <header className="container">
                <div className="flex h-16 items-center justify-between gap-3 px-4">
                    <Link
                        href="/"
                        className="flex shrink-0 items-center text-xl font-bold tracking-tight"
                    >
                        <div>
                            <Image
                                src={"/logo.svg"}
                                alt="Navbar logo - HalaWaSahla"
                                width={20}
                                height={20}
                                className="w-30 h-auto"
                            />
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-6 md:flex">
                        {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
                            const active = pathname === href
                            return (
                                <Link
                                    key={key}
                                    href={href}
                                    className={cn(
                                        "flex items-center font-semibold gap-1.5 text-sm text-black transition-colors hover:text-foreground",
                                        active && "text-primary hover:text-primary/80",
                                    )}
                                >
                                    <Icon className="size-4" />
                                    {t(`nav.${key}`)}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-2">
                        <LanguageSwitcher className="hidden sm:flex" />

                        <Button size={"lg"} className="hidden gap-1.5 sm:flex rounded-2xl" asChild>
                            <Link href="/get-started">
                                {t("getStarted")}
                                <ArrowLeft />
                            </Link>
                        </Button>

                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu />
                                    <span className="sr-only">{t("menu")}</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side={direction === "rtl" ? "right" : "left"}
                                className="flex flex-col gap-6"
                            >
                                <SheetHeader>
                                    <SheetTitle className="flex items-center text-lg font-bold">
                                        <span className="text-primary">{t("brand.first")}</span>
                                        <span className="text-accent">{t("brand.second")}</span>
                                    </SheetTitle>
                                </SheetHeader>

                                <nav className="flex flex-col gap-1 px-4">
                                    {NAV_ITEMS.map(({ href, key, icon: Icon }) => (
                                        <Link
                                            key={key}
                                            href={href}
                                            onClick={() => setOpen(false)}
                                            className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                                        >
                                            <Icon className="size-4 text-muted-foreground" />
                                            {t(`nav.${key}`)}
                                        </Link>
                                    ))}
                                </nav>

                                <SheetFooter>
                                    <LanguageSwitcher className="w-full justify-center" />
                                    <Button variant="outline" className="gap-1.5" asChild>
                                        <Link href="/login" onClick={() => setOpen(false)}>
                                            <User />
                                            {t("login")}
                                        </Link>
                                    </Button>
                                    <Button size={"lg"} className="gap-1.5" asChild>
                                        <Link href="/get-started" onClick={() => setOpen(false)}>
                                            {t("getStarted")}
                                            <ArrowLeft />
                                        </Link>
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>

    )
}
