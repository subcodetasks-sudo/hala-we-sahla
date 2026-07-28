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

type DocumentUploadFieldProps = {
  id: string
  label: string
  value: File | null
  onChange: (file: File | null) => void
  invalid?: boolean
  showInfo?: boolean
  infoTitle?: string
  sampleSrc?: string
  className?: string
}

const ACCEPT = "image/png,image/jpeg,application/pdf"

export default function DocumentUploadField({
  id,
  label,
  value,
  onChange,
  invalid,
  showInfo = false,
  infoTitle,
  sampleSrc,
  className,
}: DocumentUploadFieldProps) {
  const t = useTranslations("Forms.renewal.wizard.documents")
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sampleOpen, setSampleOpen] = useState(false)

  const previewUrl = useMemo(() => {
    if (!value || !value.type.startsWith("image/")) return null
    return URL.createObjectURL(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function openFilePicker() {
    inputRef.current?.click()
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1.5">
        <label
          htmlFor={inputId}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground"
        >
          <span>{label}</span>
          <span className="text-accent">*</span>
        </label>
        {showInfo ? (
          <button
            type="button"
            className="inline-flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground"
            aria-label={infoTitle ?? t("sampleTitle")}
            onClick={() => setSampleOpen(true)}
          >
            i
          </button>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            openFilePicker()
          }
        }}
        className={cn(
          "flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-full border border-[#d7e0e3] bg-[#f7f9fa] py-2.5 ps-4 pe-3 transition-colors",
          invalid && "border-destructive ring-3 ring-destructive/20",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-start">
          {value ? (
            <span className="w-full truncate text-sm font-medium text-foreground">
              {value.name}
            </span>
          ) : (
            <>
              <p className="text-sm leading-5">
                <span className="font-medium text-primary">
                  {t("chooseFileClick")}
                </span>{" "}
                <span className="font-medium text-foreground/80">
                  {t("chooseFileRest")}
                </span>
              </p>
              <p className="text-xs leading-4 text-foreground/70 font-extrabold">
                {t("acceptedTypes")}
              </p>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {value ? (
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/15"
              aria-label={t("preview")}
              onClick={(event) => {
                event.stopPropagation()
                setPreviewOpen(true)
              }}
            >
              <Eye className="size-4" aria-hidden="true" />
            </button>
          ) : null}

          <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#ebeff1]">
            <CustomIcon
              src="/forms/step-3/upload.svg"
              size={18}
              className="size-4 text-[#434343]"
            />
          </span>
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
          }}
        />
      </div>

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
            ) : value ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <p className="text-sm font-medium text-foreground">
                  {value.name}
                </p>
                <p className="text-xs text-muted-foreground">{value.type}</p>
              </div>
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

      {showInfo ? (
        <Dialog open={sampleOpen} onOpenChange={setSampleOpen}>
          <DialogContent
            showCloseButton={false}
            className="gap-5 rounded-2xl p-5 sm:max-w-md"
          >
            <DialogHeader className="flex-row items-center justify-between gap-3 space-y-0 pe-0">
              <DialogTitle className="text-base font-bold text-foreground">
                {infoTitle ?? t("sampleTitle")}
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

            <div className="overflow-hidden">
              {sampleSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sampleSrc}
                  alt={infoTitle ?? t("sampleTitle")}
                  className="h-auto w-full object-contain"
                />
              ) : (
                <div className="flex min-h-48 items-center justify-center px-4 py-10 text-center text-sm text-muted-foreground">
                  {t("sampleHint")}
                </div>
              )}
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
      ) : null}
    </div>
  )
}
