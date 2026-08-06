import { getTranslations } from "next-intl/server"
import { Mail, Phone } from "lucide-react"

import type { SiteSettingsView } from "@/features/landing/services/settings"
import { Link } from "@/i18n/navigation"

type FormsFooterProps = {
  settings: SiteSettingsView
}

export default async function FormsFooter({ settings }: FormsFooterProps) {
  const t = await getTranslations("Footer")
  const tForms = await getTranslations("Forms.footer")
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto py-5 sm:py-6">
      <div className="container flex flex-col gap-4">
        {/* <div
          dir="ltr"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-foreground sm:justify-start"
        >
          <a
            href={settings.phoneHref}
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
          >
            <Phone className="size-3.5 shrink-0" aria-hidden="true" />
            {settings.phoneDisplay}
          </a>
          <span className="text-muted-foreground" aria-hidden="true">
            •
          </span>
          <a
            href={settings.emailHref}
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary"
          >
            <Mail className="size-3.5 shrink-0" aria-hidden="true" />
            {settings.email}
          </a>
        </div> */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium text-foreground">
            {t("copyright", { year })}
          </p>

          <nav
            aria-label={tForms("legalNav")}
            className="flex flex-wrap items-center gap-2 text-sm text-foreground"
          >
            <Link
              href="/terms"
              className="font-medium transition-colors hover:text-primary"
            >
              {t("legal.terms")}
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">
              •
            </span>
            <Link
              href="/privacy"
              className="font-medium transition-colors hover:text-primary"
            >
              {t("legal.privacy")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
