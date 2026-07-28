"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { Eye } from "lucide-react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type SignatureUploadButtonProps = {
  id: string
  label: string
  value: File | null
  onChange: (file: File | null) => void
  invalid?: boolean
  className?: string
}

const ACCEPT = "image/png,image/jpeg,image/webp"

export default function SignatureUploadButton({
  id,
  label,
  value,
  onChange,
  invalid,
  className,
}: SignatureUploadButtonProps) {
  const t = useTranslations("Forms.renewal.wizard.documents")
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const [previewOpen, setPreviewOpen] = useState(false)

  const previewUrl = useMemo(() => {
    if (!value || !value.type.startsWith("image/")) return null
    return URL.createObjectURL(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={cn(
            "group/button inline-flex h-12 min-w-0 flex-1 shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-[#003143] px-2.5 text-base font-medium whitespace-nowrap text-white transition-all outline-none select-none hover:bg-[#003143]/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            invalid && "ring-3 ring-destructive/20",
            value && "bg-primary hover:bg-primary/90",
          )}
          onClick={() => inputRef.current?.click()}
        >
          <CustomIcon
            src="/forms/step-3/brush.svg"
            size={18}
            className="size-4.5 shrink-0 text-white"
          />
          <span className="truncate">{value ? value.name : label}</span>
        </button>

        {value ? (
          <button
            type="button"
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/15"
            aria-label={t("preview")}
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        name={id}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null
          onChange(file)
          event.target.value = ""
        }}
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-5 rounded-2xl p-5 sm:max-w-md"
        >
          <DialogHeader className="flex-row items-center justify-between gap-3 space-y-0 pe-0">
            <DialogTitle className="text-base font-bold text-foreground">
              {label}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full bg-muted text-muted-foreground"
              >
                <span className="text-base leading-none">×</span>
                <span className="sr-only">{t("close")}</span>
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/20">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={label}
                className="max-h-105 w-full object-contain"
              />
            ) : null}
          </div>

          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="h-11 w-full rounded-full bg-muted text-base text-muted-foreground hover:bg-muted/80"
            >
              {t("close")}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
