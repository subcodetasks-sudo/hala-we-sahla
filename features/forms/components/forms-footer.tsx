import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"

export default async function FormsFooter() {
  const t = await getTranslations("Footer")
  const tForms = await getTranslations("Forms.footer")
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto py-5 sm:py-6">
      <div className="container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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
    </footer>
  )
}
