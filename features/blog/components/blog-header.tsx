import { getTranslations } from "next-intl/server"

import BlogSearch from "@/features/blog/components/blog-search"

export default async function BlogHeader() {
  const t = await getTranslations("Blog")

  return (
    <header className="mx-auto max-w-3xl py-10 text-center md:py-16">
      <div className="flex items-center justify-center gap-4">
        <span
          className="h-px w-10 bg-border sm:w-16 md:w-20"
          aria-hidden="true"
        />
        <p className="shrink-0 text-sm font-medium text-foreground">
          {t("eyebrow")}
        </p>
        <span
          className="h-px w-10 bg-border sm:w-16 md:w-20"
          aria-hidden="true"
        />
      </div>

      <h1 className="mt-5 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl md:leading-tight">
        {t.rich("heading", {
          primary: (chunks) => (
            <span className="text-primary">{chunks}</span>
          ),
          br: () => <br />,
        })}
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t("description")}
      </p>

      <div className="mt-8 md:mt-10">
        <BlogSearch />
      </div>
    </header>
  )
}
