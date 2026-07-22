"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { LanguageSwitcher } from "@/features/landing/components/language-switcher"
import { Link, usePathname } from "@/i18n/navigation"

const PAGE_TITLE_KEYS: Record<string, "renewal" | "trackOrders"> = {
  "/renewal": "renewal",
  "/track-orders": "trackOrders",
}

export default function FormsHeader() {
  const t = useTranslations("Forms.header")
  const pathname = usePathname()
  const titleKey = PAGE_TITLE_KEYS[pathname]
  const title = titleKey ? t(`pages.${titleKey}`) : t("pages.renewal")

  return (
    <header className="sticky top-0 z-50 ">
      <div className="container flex h-16 items-center justify-between gap-4 py-3 sm:h-20 sm:py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-opacity hover:opacity-80 sm:size-11"
            aria-label={t("back")}
          >
            <ArrowRight className="size-5 ltr:rotate-180" aria-hidden="true" />
          </Link>

          <h1 className="text-base font-bold text-foreground sm:text-lg">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />

          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label={t("home")}
          >
            <Image
              src="/logo.svg"
              alt={t("logoAlt")}
              width={120}
              height={40}
              className="h-8 w-auto "
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
