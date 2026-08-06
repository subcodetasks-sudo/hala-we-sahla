"use client"

import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

import { useFormsBack } from "@/features/forms/components/forms-back-provider"
import { LanguageSwitcher } from "@/features/landing/components/language-switcher"
import { SiteLogo } from "@/features/landing/components/site-logo"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils";

type PageTitleKey =
  | "renewal"
  | "trackOrders"
  | "forgotRequestNumber"
  | "verifyMobile"
  | "previousRequests"
  | "signature"

const PAGE_TITLE_KEYS: Record<string, PageTitleKey> = {
  "/renewal": "renewal",
  "/track-orders": "trackOrders",
  "/track-orders/forgot": "forgotRequestNumber",
  "/track-orders/forgot/verify": "verifyMobile",
  "/track-orders/requests": "previousRequests",
  "/signature": "signature",
}

function resolveTitleKey(pathname: string): PageTitleKey {
  if (PAGE_TITLE_KEYS[pathname]) return PAGE_TITLE_KEYS[pathname]
  if (pathname.startsWith("/track-orders")) return "trackOrders"
  if (pathname.startsWith("/renewal")) return "renewal"
  return "renewal"
}

function resolveFallbackHref(pathname: string) {
  if (pathname === "/track-orders/forgot/verify") return "/track-orders/forgot"
  if (pathname === "/track-orders/forgot") return "/track-orders"
  if (pathname === "/track-orders/requests") return "/track-orders"
  if (pathname.startsWith("/track-orders/")) return "/track-orders"
  if (pathname.startsWith("/renewal/")) return "/renewal"
  return "/"
}

export default function FormsHeader({
  logoSrc = "/logo.svg",
  logoAlt,
}: {
  logoSrc?: string
  logoAlt?: string
}) {
  const t = useTranslations("Forms.header")
  const pathname = usePathname()
  const router = useRouter()
  const { runBack } = useFormsBack()
  const titleKey = resolveTitleKey(pathname)
  const title = t(`pages.${titleKey}`)

  function handleBack() {
    runBack(() => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back()
        return
      }
      router.push(resolveFallbackHref(pathname))
    })
  }

  return (
    <header className={cn("sticky top-0 z-50 ", pathname === "/renewal" ? "max-md:bg-background" : "bg-background")}>
      <div className="container flex h-16 items-center justify-between gap-4 py-3 sm:h-20 sm:py-4">
        <div className="flex items-center gap-3 ">
          <button
            type="button"
            onClick={handleBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-opacity hover:opacity-80 sm:size-11"
            aria-label={t("back")}
          >
            <ArrowRight className="size-5 ltr:rotate-180" aria-hidden="true" />
          </button>
          <h1 className="text-base font-bold text-foreground sm:text-lg">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 ">
          <LanguageSwitcher />

          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label={t("home")}
          >
            <SiteLogo
              src={logoSrc}
              alt={logoAlt ?? t("logoAlt")}
              width={120}
              height={40}
              className="hidden h-8 w-auto md:block"
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
