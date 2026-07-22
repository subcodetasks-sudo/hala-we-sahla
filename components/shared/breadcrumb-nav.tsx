import { Fragment } from "react"
import { ChevronLeft } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

export type BreadcrumbNavItem = {
  label: string
  href?: string
}

type BreadcrumbNavProps = {
  items: BreadcrumbNavItem[]
  className?: string
}

export default function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList className="gap-1.5 text-sm sm:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <BreadcrumbSeparator className="mx-0 text-muted-foreground [&>svg]:size-3.5">
                  <ChevronLeft className="ltr:rotate-180" />
                </BreadcrumbSeparator>
              )}

              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="font-bold text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
