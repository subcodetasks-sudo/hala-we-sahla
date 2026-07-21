"use client"

import CustomIcon from "@/components/custom-icon";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/features/landing/components/language-switcher";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    CircleCheck,
    Menu,
    User
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
    { href: "/", key: "home", icon: "/icons/home.svg" },
    { href: "/renewal", key: "renewal", icon: "/icons/repeat.svg" },
    { href: "/track-orders", key: "trackOrders", icon: "/icons/box-time.svg" },
    { href: "/support", key: "support", icon: "/icons/sms-tracking.svg" },
] as const

export default function Header() {
    const t = useTranslations("Header")
    const pathname = usePathname()
    const direction = useDirection()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false);


useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 100);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
},[])

    return (
        <div className="sticky top-0 z-50 bg-white">
            <div
                className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                    scrolled ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
                )}
            >
                <div className="overflow-hidden">
                    <div className="md:flex md:items-center justify-center md:gap-2 pt-4">
                        <div className="hidden md:flex bg-linear-90 ltr:-bg-linear-90 from-black/50 via-white to-transparent w-1/4 h-0.5"></div>
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
                        <div className="hidden md:flex bg-linear-90 ltr:-bg-linear-90 from-transparent via-white to-black/50 w-1/4 h-0.5"></div>
                    </div>
                </div>
            </div>
            <header className="container py-4">
                <div className="flex h-16 items-center gap-6 ">
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

                    <span  className="h-8 self-center border-r border-gray-200"   aria-hidden="true" />
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
                                    <CustomIcon src={Icon as string} size={16} />
                                    {t(`nav.${key}`)}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-2 ms-auto">
                        <LanguageSwitcher className="hidden sm:flex" />

                        <Button  className="hidden gap-1.5 sm:flex rounded-full text-base h-12! hover:bg-accent!" asChild>
                            <Link href="/get-started">
                                <CustomIcon src="/icons/receipt-edit.svg" size={16} />
                                {t("getStarted")}
                                <ArrowLeft className="ltr:rotate-180"/>
                            </Link>
                        </Button>

                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button  className="md:hidden rounded-full size-12! hover:bg-accent! text-base flex items-center justify-center">
                                    <Menu />
                                    <span className="sr-only">{t("menu")}</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side={direction === "rtl" ? "right" : "left"}
                                className="flex flex-col gap-6"
                                showCloseButton={false}
                            >
                                <SheetHeader>
                                    <SheetTitle className="flex items-center text-lg font-bold">
<Image src="/logo.svg" alt="Navbar logo - HalaWaSahla" width={20} height={20} className="w-30 h-auto" />
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
                                            <CustomIcon src={Icon as string} size={16} />
                                            {t(`nav.${key}`)}
                                        </Link>
                                    ))}
                                </nav>

                                <SheetFooter>
                                    <LanguageSwitcher className="w-full justify-center" />
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
        </div>

    )
}
