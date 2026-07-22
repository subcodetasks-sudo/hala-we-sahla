import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { Link } from "@/i18n/navigation"

export type BlogRelatedCardData = {
  id: string
  slug: string
  image: string
}

type BlogRelatedCardProps = {
  article: BlogRelatedCardData
}

export default async function BlogRelatedCard({ article }: BlogRelatedCardProps) {
  const t = await getTranslations("Blog.related")
  const href = `/blog/${article.slug}`

  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl bg-background p-5 sm:p-6">
      <Link
        href={href}
        className="relative aspect-16/10 overflow-hidden rounded-2xl"
      >
        <Image
          src={article.image}
          alt={t(`items.${article.id}.title`)}
          fill
          className="object-cover transition-transform hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-sm font-medium text-accent">
          <CustomIcon
            src="/icons/receipt-3.svg"
            size={16}
            className="size-4 text-accent"
          />
          <span>{t("category")}</span>
        </div>

        <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
          <Link href={href} className="transition-colors hover:text-primary">
            {t(`items.${article.id}.title`)}
          </Link>
        </h3>

        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("readMore")}
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
