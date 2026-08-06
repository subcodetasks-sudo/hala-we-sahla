import Image from "next/image"
import { ArrowLeft, Clock } from "lucide-react"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SupportContactCardProps = {
  eyebrow?: string
  title: string
  description: string
  availability?: string
  cta: string
  href: string
  iconSrc: string
  imageIsRemote?: boolean
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
  imageIsRemote = false,
  className,
}: SupportContactCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col items-center gap-4 rounded-4xl bg-background px-6 py-8 text-center sm:px-8 sm:py-10",
        className,
      )}
    >
      {imageIsRemote ? (
        <Image
          src={iconSrc}
          alt=""
          width={64}
          height={64}
          unoptimized
          className="size-16 object-contain"
          aria-hidden="true"
        />
      ) : (
        <CustomIcon
          src={iconSrc}
          size={64}
          className="size-16 text-primary"
        />
      )}

      {eyebrow ? (
        <p className="mt-5 text-sm text-muted-foreground">{eyebrow}</p>
      ) : null}

      <h2 className="mt-2 text-xl font-medium tracking-relaxed text-foreground sm:text-4xl lg:max-w-62.5">
        {title}
      </h2>

      <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground sm:text-xl lg:max-w-62.5">
        {description}
      </p>

      {availability ? (
        <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4 shrink-0" aria-hidden="true" />
          <span>{availability}</span>
        </p>
      ) : null}

      <Button
        className="mt-8 h-12 gap-2 rounded-full px-6 text-base"
        asChild
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {imageIsRemote ? (
            <Image
              src={iconSrc}
              alt=""
              width={20}
              height={20}
              unoptimized
              className="size-5 object-contain brightness-0 invert"
              aria-hidden="true"
            />
          ) : (
            <CustomIcon
              src={iconSrc}
              size={18}
              className="size-5 text-primary-foreground"
            />
          )}
          {cta}
          <ArrowLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
        </a>
      </Button>
    </article>
  )
}
