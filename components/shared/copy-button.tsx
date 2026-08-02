"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  className?: string
  label?: string
  children?: React.ReactNode
}

export default function CopyButton({
  value,
  className,
  label,
  children,
}: CopyButtonProps) {
  const t = useTranslations("Common.copy")
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current)
      }
      setOpen(true)
      timeoutRef.current = window.setTimeout(() => setOpen(false), 2000)
    } catch {
      setOpen(false)
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open} onOpenChange={(next) => !next && setOpen(false)}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={label ?? t("label")}
            className={cn(
              "inline-flex shrink-0 items-center justify-center",
              className,
            )}
          >
            {children ?? (
              <CustomIcon
                src="/icons/copy.svg"
                size={16}
                className="size-4"
              />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          sideOffset={6}
          className="bg-primary text-primary-foreground [&_svg]:bg-primary [&_svg]:fill-primary"
        >
          {t("copiedSuccessfully")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
