import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { getLocale, getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { cn } from "@/lib/utils"

const LATEST_ITEMS = [
  {
    id: "docs",
    publishedAt: new Date(2026, 5, 12),
    readingMinutes: 5,
    tone: "bg-[#ebe4f5]",
  },
  {
    id: "timeline",
    publishedAt: new Date(2026, 5, 12),
    readingMinutes: 5,
    tone: "bg-[#f3e6d8]",
  },
  {
    id: "status",
    publishedAt: new Date(2026, 5, 12),
    readingMinutes: 5,
    tone: "bg-[#dceef5]",
  },
  {
    id: "mistakes",
    publishedAt: new Date(2026, 5, 12),
    readingMinutes: 5,
    tone: "bg-[#dff0e6]",
  },
] as const

export default async function BlogLatestArticles() {
  const t = await getTranslations("Blog.latest")
  const locale = await getLocale()
  const dateLocale = locale === "ar" ? ar : enUS

  return (
    <aside className="flex h-full flex-col rounded-3xl border border-border/50 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-2">
        <CustomIcon
          src="/icons/search.svg"
          size={18}
          className="size-[18px] text-foreground"
        />
        <h2 className="text-base font-bold text-foreground sm:text-lg">
          {t("title")}
        </h2>
      </div>

      <ul className="flex flex-1 flex-col justify-between gap-5">
        {LATEST_ITEMS.map((item) => {
          const dateLabel = format(item.publishedAt, "d MMMM yyyy", {
            locale: dateLocale,
          })

          return (
            <li key={item.id}>
              <a
                href="#"
                className="flex items-start gap-3 rounded-xl transition-opacity hover:opacity-80"
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg sm:size-12",
                    item.tone
                  )}
                  aria-hidden="true"
                >
                  <CustomIcon
                    src="/icons/file.svg"
                    size={20}
                    className="size-5 text-foreground/80"
                  />
                </span>

                <div className="min-w-0 flex-1 text-start">
                  <p className="text-sm font-bold leading-snug text-foreground sm:text-[0.95rem]">
                    {t(`items.${item.id}.title`)}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    {t("meta", {
                      date: dateLabel,
                      minutes: item.readingMinutes,
                    })}
                  </p>
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
