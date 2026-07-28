"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { Eye, ImagePlus, PenLine, Trash2, Upload } from "lucide-react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignaturePad from "@/features/forms/components/customer-signature/signature-pad"
import type {
  SignatureMode,
  SignatureValue,
} from "@/features/forms/components/customer-signature/types"
import { useSignaturePad } from "@/features/forms/components/customer-signature/use-signature-pad"
import { cn } from "@/lib/utils"

const ACCEPT = "image/png,image/jpeg,image/jpg"

type CustomerSignatureProps = {
  value: SignatureValue | null
  onChange: (value: SignatureValue | null) => void
  label?: string
  emptyLabel?: string
  invalid?: boolean
  /** `button` keeps the original dark pill trigger used in the documents step */
  variant?: "button" | "card"
  className?: string
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function blobToFile(blob: Blob, name: string) {
  return new File([blob], name, { type: blob.type || "image/png" })
}

export default function CustomerSignature({
  value,
  onChange,
  label,
  emptyLabel,
  invalid,
  variant = "button",
  className,
}: CustomerSignatureProps) {
  const t = useTranslations("Forms.renewal.wizard.documents.signature")
  const tDocuments = useTranslations("Forms.renewal.wizard.documents")
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const pad = useSignaturePad()

  const [open, setOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [mode, setMode] = useState<SignatureMode>(value?.type ?? "draw")
  const [draftUpload, setDraftUpload] = useState<{
    file: File
    image: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const triggerLabel = emptyLabel ?? t("emptyLabel")
  const title = label ?? t("title")

  const previewSrc = useMemo(() => value?.image ?? null, [value])
  const buttonLabel = triggerLabel

  useEffect(() => {
    if (!open) return

    setMode(value?.type ?? "draw")
    setError(null)
    setSaving(false)

    if (value?.type === "upload" && value.file) {
      setDraftUpload({ file: value.file, image: value.image })
      pad.clear()
      return
    }

    setDraftUpload(null)
    pad.clear()
    if (value?.type === "draw" && value.image) {
      window.requestAnimationFrame(() => pad.loadFromImage(value.image))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog opens
  }, [open])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setError(null)
      setSaving(false)
      setDraftUpload(null)
      pad.clear()
    }
  }

  async function handleUploadChange(file: File | null) {
    setError(null)
    if (!file) {
      setDraftUpload(null)
      return
    }

    if (!ACCEPT.split(",").includes(file.type) && !/\.(png|jpe?g)$/i.test(file.name)) {
      setError(t("errors.invalidType"))
      return
    }

    try {
      const image = await fileToDataUrl(file)
      setDraftUpload({ file, image })
      setMode("upload")
    } catch {
      setError(t("errors.uploadFailed"))
    }
  }

  async function handleSave() {
    setError(null)
    setSaving(true)

    try {
      if (mode === "upload") {
        if (!draftUpload) {
          setError(t("errors.uploadRequired"))
          return
        }

        onChange({
          type: "upload",
          file: draftUpload.file,
          image: draftUpload.image,
        })
        handleOpenChange(false)
        return
      }

      const blob = await pad.exportTrimmedPng()
      if (!blob) {
        setError(t("errors.drawRequired"))
        return
      }

      const file = await blobToFile(blob, "signature.png")
      const image = await fileToDataUrl(file)
      onChange({
        type: "draw",
        file,
        image,
      })
      handleOpenChange(false)
    } catch {
      setError(t("errors.saveFailed"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {variant === "button" ? (
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-invalid={invalid || undefined}
            className={cn(
              "group/button inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-transparent bg-[#003143] px-3 text-sm font-medium text-white transition-all outline-none select-none hover:bg-[#003143]/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:h-12 sm:px-2.5 sm:text-base",
              invalid && "ring-3 ring-destructive/20",
              value && "bg-primary hover:bg-primary/90",
            )}
          >
            <CustomIcon
              src="/forms/step-3/brush.svg"
              size={18}
              className="size-4 shrink-0 text-white sm:size-4.5"
            />
            <span className="min-w-0 truncate">{buttonLabel}</span>
          </button>

          {value && previewSrc ? (
            <button
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/15 sm:size-12"
              aria-label={tDocuments("preview")}
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-invalid={invalid || undefined}
          className={cn(
            "group relative flex min-h-28 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-dashed border-[#c7d5d9] bg-[#f7fafb] px-4 py-5 text-center transition-colors hover:border-primary/50 hover:bg-[#f2f8f9]",
            value && "border-solid border-[#cfe5e8] bg-card",
            invalid && "border-destructive ring-3 ring-destructive/20",
          )}
        >
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt={title}
              className="max-h-20 w-auto max-w-full object-contain"
            />
          ) : (
            <>
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CustomIcon
                  src="/forms/step-3/brush.svg"
                  size={18}
                  className="size-4.5"
                />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {triggerLabel}
              </span>
              <span className="text-xs text-muted-foreground">
                {t("emptyHint")}
              </span>
            </>
          )}

          {value ? (
            <span className="absolute end-2 top-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {t("edit")}
            </span>
          ) : null}
        </button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[min(90vh,720px)] w-[calc(100%-1.5rem)] flex-col gap-3 overflow-y-auto rounded-2xl p-4 sm:max-w-lg sm:gap-4 sm:p-5"
        >
          <DialogHeader className="gap-1 space-y-0 text-start">
            <DialogTitle className="text-base font-bold wrap-break-word text-foreground sm:text-lg">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("description")}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={mode}
            onValueChange={(next) => {
              setMode(next as SignatureMode)
              setError(null)
            }}
            className="min-h-0 flex-1 gap-3 sm:gap-4"
          >
            <TabsList className="grid h-11! w-full grid-cols-2 gap-1 rounded-full bg-[#e8f0f2] p-1 sm:h-12! sm:p-1.5 group-data-horizontal/tabs:h-11! sm:group-data-horizontal/tabs:h-12!">
              <TabsTrigger
                value="draw"
                className={cn(
                  "h-full gap-1 rounded-full px-2 text-xs font-semibold text-muted-foreground shadow-none after:hidden sm:gap-1.5 sm:px-3 sm:text-sm",
                  "hover:text-foreground",
                  "data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm",
                  "data-active:bg-primary data-active:text-white data-active:shadow-sm",
                )}
              >
                <PenLine className="size-3.5 sm:size-4" aria-hidden="true" />
                <span className="truncate">{t("tabs.draw")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className={cn(
                  "h-full gap-1 rounded-full px-2 text-xs font-semibold text-muted-foreground shadow-none after:hidden sm:gap-1.5 sm:px-3 sm:text-sm",
                  "hover:text-foreground",
                  "data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm",
                  "data-active:bg-primary data-active:text-white data-active:shadow-sm",
                )}
              >
                <Upload className="size-3.5 sm:size-4" aria-hidden="true" />
                <span className="truncate">{t("tabs.upload")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="draw" className="mt-0 outline-none">
              <SignaturePad
                pad={pad}
                clearLabel={t("clear")}
                undoLabel={t("undo")}
                padHint={t("padHint")}
              />
            </TabsContent>

            <TabsContent value="upload" className="mt-0 outline-none">
              <div className="flex flex-col gap-3">
                <input
                  ref={inputRef}
                  id={inputId}
                  type="file"
                  accept={ACCEPT}
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null
                    void handleUploadChange(file)
                    event.target.value = ""
                  }}
                />

                {draftUpload ? (
                  <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted/20 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={draftUpload.image}
                      alt={title}
                      className="mx-auto max-h-48 w-auto max-w-full object-contain"
                    />
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 rounded-full"
                        onClick={() => inputRef.current?.click()}
                      >
                        <ImagePlus className="size-3.5" aria-hidden="true" />
                        {t("replace")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 rounded-full"
                        onClick={() => setDraftUpload(null)}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        {t("remove")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-[#f7fafb] px-4 py-8 text-center transition-colors hover:border-primary/40"
                  >
                    <Upload className="size-6 text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-foreground">
                      {t("chooseImage")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("acceptedTypes")}
                    </span>
                  </button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-full sm:w-auto sm:px-8"
              onClick={() => handleOpenChange(false)}
              disabled={saving}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              className="h-11 w-full rounded-full text-white sm:w-auto sm:px-8"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          showCloseButton={false}
          className="gap-5 rounded-2xl p-5 sm:max-w-md"
        >
          <DialogHeader className="flex-row items-center justify-between gap-3 space-y-0 pe-0">
            <DialogTitle className="text-base font-bold text-foreground">
              {title}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full bg-muted text-muted-foreground"
              >
                <span className="text-base leading-none">×</span>
                <span className="sr-only">{tDocuments("close")}</span>
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/20">
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewSrc}
                alt={title}
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
              {tDocuments("close")}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
