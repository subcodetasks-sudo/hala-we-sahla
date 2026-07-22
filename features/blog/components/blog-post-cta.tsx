import { ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export default async function BlogPostCta() {
  const t = await getTranslations("Blog.post.cta")

  return (
    <aside className="flex flex-col items-center rounded-3xl bg-primary/10 p-6 text-center sm:p-7">
      <div className="flex size-11 items-center justify-center rounded-full bg-white shadow-sm">
        <CustomIcon
          src="/icons/receipt-edit.svg"
          size={20}
          className="size-5 text-foreground"
        />
      </div>

      <h3 className="mt-4 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
        <span className="block text-foreground">{t("titleLine1")}</span>
        <span className="block text-primary">{t("titleLine2")}</span>
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {t("description")}
      </p>

      <Button
        asChild
        className="mt-5 h-11 w-full gap-1.5 rounded-full text-sm sm:h-12 sm:text-base"
      >
        <Link href="/renewal">
          <CustomIcon
            src="/icons/receipt-edit.svg"
            size={16}
            className="size-4 shrink-0 text-white"
          />
          {t("button")}
          <ArrowLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
        </Link>
      </Button>
    </aside>
  )
}
