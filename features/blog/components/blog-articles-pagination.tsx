import { getTranslations } from "next-intl/server"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"

const VISIBLE_PAGES = [1, 2, 3, 4] as const
const TOTAL_PAGES = 40
const CURRENT_PAGE = 1

export default async function BlogArticlesPagination() {
  const t = await getTranslations("Blog.articles.pagination")

  return (
    <Pagination className="mt-10 md:mt-12">
      <PaginationContent className="flex-wrap justify-center gap-2">
        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label={t("previous")}
            size="icon"
            className="size-10 rounded-full border-0 bg-muted text-foreground hover:bg-muted/80"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>

        {VISIBLE_PAGES.map((page) => {
          const isActive = page === CURRENT_PAGE

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={isActive}
                aria-label={t("page", { page })}
                size="icon"
                className={cn(
                  "size-10 rounded-full border-0 text-sm font-medium",
                  isActive
                    ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationEllipsis className="size-10 text-muted-foreground" />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label={t("page", { page: TOTAL_PAGES })}
            size="icon"
            className="size-10 rounded-full border-0 bg-muted text-sm font-medium text-foreground hover:bg-muted/80"
          >
            {TOTAL_PAGES}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            aria-label={t("next")}
            size="icon"
            className="size-10 rounded-full border-0 bg-muted text-foreground hover:bg-muted/80"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
