import { ArrowLeft, Clock } from "lucide-react"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SupportContactCardProps = {
  eyebrow: string
  title: string
  description: string
  availability: string
  cta: string
  href: string
  iconSrc: string
  className?: string
}

export default function SupportContactCard({
  eyebrow,
  title,
  description,
  availability,
  cta,
  href,
  iconSrc,
  className,
}: SupportContactCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 items-center rounded-4xl border-t-primary/80 border-t-2 bg-primary/10 px-6 py-8 text-center sm:px-8 sm:py-10",
        className,
      )}
    >
      <CustomIcon
        src={iconSrc}
        size={50}
        className="size-10 text-primary"
      />

      <p className="mt-5 text-sm text-muted-foreground">{eyebrow}</p>

      <h2 className="mt-2 text-xl  tracking-relaxed text-foreground sm:text-4xl lg:max-w-62.5 font-medium">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-xl lg:max-w-62.5 font-medium">
        {description}
      </p>

      <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="size-4 shrink-0" aria-hidden="true" />
        <span>{availability}</span>
      </p>

      <Button
        className="mt-8 h-12 gap-2 rounded-full px-6 text-base"
        asChild
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          <CustomIcon
            src={iconSrc}
            size={18}
            className="size-5 text-primary-foreground"
          />
          {cta}
          <ArrowLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
        </a>
      </Button>
    </article>
  )
}
