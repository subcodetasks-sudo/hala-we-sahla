import { getTranslations } from "next-intl/server"

export default async function SupportHeader() {
  const t = await getTranslations("Support")

  return (
    <header className="mx-auto max-w-2xl py-10 text-center md:py-16">
      <p className="text-sm font-medium text-muted-foreground">{t("eyebrow")}</p>

      <h1 className="mt-3 text-3xl  tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
        {t.rich("heading", {
          primary: (chunks) => (
            <span className="text-primary font-medium">{chunks}</span>
          ),
        })}
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground ">
        {t("description")}
      </p>
    </header>
  )
}
