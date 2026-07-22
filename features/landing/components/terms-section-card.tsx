import { CircleCheck, Info } from "lucide-react"

import CustomIcon from "@/components/custom-icon"
import { cn } from "@/lib/utils"

type TermsSectionCardProps = {
  id: string
  number: string
  title: string
  subtitle: string
  body: string
  items?: string[]
  note?: string
  className?: string
}

export default function TermsSectionCard({
  id,
  number,
  title,
  subtitle,
  body,
  items,
  note,
  className,
}: TermsSectionCardProps) {
  return (
    <article
      id={id}
      className={cn(
        "scroll-mt-28 rounded-2xl bg-card p-5 shadow-sm sm:p-6 md:p-8",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CustomIcon
              src="/icons/receipt-item.svg"
              size={24}
              className="size-6 text-primary"
            />
          </span>

          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <span className="shrink-0 text-3xl font-bold tabular-nums text-accent sm:text-4xl">
          {number}
        </span>
      </div>

      <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>{body}</p>

        {items && items.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CircleCheck
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {note ? (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <Info
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>{note}</p>
        </div>
      ) : null}
    </article>
  )
}
