"use client"

import Image from "next/image"
import { RefreshCw, X } from "lucide-react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { useWhatsappHref } from "@/features/landing/hooks/use-whatsapp-href"
import { cn } from "@/lib/utils"

type ChatHeaderProps = {
  logoSrc: string
  logoAlt?: string
  onClose: () => void
  onReset: () => void
  className?: string
}

export default function ChatHeader({
  logoSrc,
  logoAlt = "",
  onClose,
  onReset,
  className,
}: ChatHeaderProps) {
  const t = useTranslations("Chat")
  const whatsappHref = useWhatsappHref()

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-border/60">
          <Image
            src={logoSrc}
            alt={logoAlt}
            fill
            sizes="44px"
            className="object-contain p-1.5"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-black">
            {t("title")}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-custom-green"
            />
            {t("online")}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("whatsappLabel")}
          className="inline-flex size-8 items-center justify-center rounded-full bg-custom-green text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <CustomIcon
            src="/icons/whatsapp.svg"
            size={16}
            className="size-4 text-white"
          />
        </a>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label={t("resetLabel")}
          onClick={onReset}
          className="size-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        >
          <RefreshCw className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label={t("closeLabel")}
          onClick={onClose}
          className="size-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </header>
  )
}
