import { getTranslations } from "next-intl/server"

import BlogSearch from "@/features/blog/components/blog-search"

export default async function BlogHeader() {
  const t = await getTranslations("Blog")

  return (
    <header className="mx-auto max-w-3xl py-10 text-center md:py-16">
      <div className="flex items-center justify-center gap-4">
      <div className="hidden md:flex bg-linear-90 ltr:-bg-linear-90 from-black/50 via-white to-transparent w-1/4 h-0.5"></div>
        <p className="shrink-0 text-sm font-medium text-foreground">
          {t("eyebrow")}
        </p>
        <div className="hidden md:flex bg-linear-90 ltr:-bg-linear-90 from-transparent via-white to-black/50 w-1/4 h-0.5"></div>
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
