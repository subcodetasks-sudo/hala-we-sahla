"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Eye, Loader2, Phone, SaudiRiyal } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useRenewalReview } from "@/features/forms/hooks/use-renewal-review"
import {
  formatNamedEntityLabel,
  type RenewalReviewDocuments,
} from "@/features/forms/services/renewal-review"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

type ReviewStepProps = {
  requestId: number | null
  enabled?: boolean
  confirmed: boolean
  onConfirmedChange: (value: boolean) => void
  className?: string
}

type ReviewFieldItem = {
  key: string
  label: string
  value: string
  icon: ReactNode
  valueSuffix?: ReactNode
  valueDir?: "ltr" | "rtl"
  valueClassName?: string
}

type DocumentItem = {
  key: keyof RenewalReviewDocuments
  label: string
  url: string | null
}

function formatSaudiPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10 && digits.startsWith("05")) {
    return `+966 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }
  return phone
}

function getUrlExtension(url: string) {
  const path = url.split("?")[0] ?? url
  const fileName = path.slice(path.lastIndexOf("/") + 1)
  const dotIndex = fileName.lastIndexOf(".")
  if (dotIndex === -1) return ""
  return fileName.slice(dotIndex)
}

function getDocumentKind(url: string) {
  const extension = getUrlExtension(url).toLowerCase()
  if (extension === ".pdf") return "pdf"
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(extension)) {
    return "image"
  }
  return "other"
}

// Chrome refuses to render cross-origin PDFs inside an iframe, so the file is
// downloaded and framed through a same-origin blob URL instead.
function useBlobPreviewUrl(url: string | null) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  )

  useEffect(() => {
    if (!url) {
      setBlobUrl(null)
      setStatus("idle")
      return
    }

    let cancelled = false
    let createdUrl: string | null = null

    setBlobUrl(null)
    setStatus("loading")

    async function load() {
      try {
        const response = await fetch(url as string, { credentials: "omit" })
        if (!response.ok) throw new Error("Failed to load file")

        const blob = await response.blob()
        if (cancelled) return

        createdUrl = URL.createObjectURL(
          new Blob([blob], { type: "application/pdf" }),
        )
        setBlobUrl(createdUrl)
        setStatus("ready")
      } catch {
        if (!cancelled) setStatus("error")
      }
    }

    void load()

    return () => {
      cancelled = true
      if (createdUrl) URL.revokeObjectURL(createdUrl)
    }
  }, [url])

  return { blobUrl, status }
}

function FieldIcon({ src }: { src: string }) {
  return (
    <CustomIcon
      src={src}
      size={16}
      className="size-3.5 text-muted-foreground"
    />
  )
}

function ReviewSectionTitle({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mb-5 flex items-center gap-2 text-accent">
      {icon}
      <h3 className="shrink-0 text-base font-bold">{children}</h3>
      <div className="grow border-t border-border/60" />
    </div>
  )
}

function ReviewFieldCell({ field }: { field: ReviewFieldItem }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex size-5 items-center justify-center">{field.icon}</span>
      <p className="text-xs font-medium text-muted-foreground sm:text-sm sm:text-nowrap">
        {field.label}
      </p>
      <p
        className={cn(
          "text-sm font-bold wrap-break-word text-black sm:text-base sm:text-nowrap",
          field.valueClassName,
        )}
      >
        <span dir={field.valueDir}>{field.value}</span>
        {field.valueSuffix ? (
          <span className="ms-1 inline-flex shrink-0 align-middle">
            {field.valueSuffix}
          </span>
        ) : null}
      </p>
    </div>
  )
}

function ReviewFieldsRow({ fields }: { fields: ReviewFieldItem[] }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [rowStartKeys, setRowStartKeys] = useState<Set<string>>(
    () => new Set(fields[0] ? [fields[0].key] : []),
  )

  useEffect(() => {
    const row = rowRef.current
    if (!row) return

    function updateRowStarts() {
      const items = Array.from(row!.children) as HTMLElement[]
      if (items.length === 0) {
        setRowStartKeys(new Set())
        return
      }

      const next = new Set<string>()
      let currentTop = items[0].offsetTop
      next.add(items[0].dataset.fieldKey ?? "")

      for (let index = 1; index < items.length; index += 1) {
        const item = items[index]
        if (item.offsetTop > currentTop + 1) {
          currentTop = item.offsetTop
          next.add(item.dataset.fieldKey ?? "")
        }
      }

      setRowStartKeys(next)
    }

    updateRowStarts()

    const observer = new ResizeObserver(updateRowStarts)
    observer.observe(row)
    window.addEventListener("resize", updateRowStarts)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updateRowStarts)
    }
  }, [fields])

  return (
    <div ref={rowRef} className="flex flex-wrap gap-y-6">
      {fields.map((field) => {
        const isRowStart = rowStartKeys.has(field.key)

        return (
          <div
            key={field.key}
            data-field-key={field.key}
            className={cn(
              "relative w-full px-3 sm:w-auto sm:shrink-0 sm:px-5",
              !isRowStart &&
                "sm:before:absolute sm:before:inset-s-0 sm:before:top-1/2 sm:before:h-5 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-[#d7d7d7]/40 sm:before:content-['']",
            )}
          >
            <ReviewFieldCell field={field} />
          </div>
        )
      })}
    </div>
  )
}

function DocumentPreviewButton({
  label,
  url,
  showExtension = true,
  onPreview,
}: {
  label: string
  url: string | null
  showExtension?: boolean
  onPreview: () => void
}) {
  if (!url) return null

  const extension = getUrlExtension(url)

  return (
    <button
      type="button"
      onClick={onPreview}
      className="inline-flex h-10 min-w-[min(100%,11.5rem)] flex-1 items-center justify-between gap-2 rounded-full bg-[#e8f4f6] px-3 text-xs font-semibold text-black transition-colors hover:bg-[#dceef1] sm:px-4 sm:text-sm"
    >
      <span className="flex min-w-0 items-center gap-1.5 text-start">
        <span aria-hidden="true" className="shrink-0">
          &#10003;
        </span>
        <span className="truncate">
          {label}
          {showExtension ? extension : ""}
        </span>
      </span>
      <Eye className="size-4 shrink-0 text-primary" aria-hidden="true" />
    </button>
  )
}

function ImagePreview({
  src,
  alt,
  errorMessage,
}: {
  src: string
  alt: string
  errorMessage: string
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    setStatus("loading")
  }, [src])

  return (
    <div className="relative flex min-h-48 items-center justify-center">
      {status === "loading" ? (
<Loader2 className="size-8 text-primary animate-spin" />
      ) : null}

      {status === "error" ? (
        <p className="px-4 py-10 text-center text-sm text-destructive">
          {errorMessage}
        </p>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0) {
              setStatus("ready")
            }
          }}
          className={cn(
            "mx-auto h-auto max-h-[calc(85vh-10rem)] w-full object-contain transition-opacity duration-200",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  )
}

export default function ReviewStep({
  requestId,
  enabled = true,
  confirmed,
  onConfirmedChange,
  className,
}: ReviewStepProps) {
  const t = useTranslations("Forms.renewal.wizard.review")
  const locale = useLocale()
  const { data, isPending, isError } = useRenewalReview(requestId, { enabled })
  const [preview, setPreview] = useState<DocumentItem | null>(null)

  const previewUrl = preview?.url ?? null
  const previewKind = previewUrl ? getDocumentKind(previewUrl) : null
  const { blobUrl: pdfBlobUrl, status: pdfStatus } = useBlobPreviewUrl(
    previewKind === "pdf" ? previewUrl : null,
  )

  const empty = t("empty")

  if (!requestId) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <h2 className="text-xl font-bold text-black sm:text-2xl">
          {t("title")}
        </h2>
        <p className="text-sm text-destructive">{t("loadError")}</p>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <h2 className="text-xl font-bold text-black sm:text-2xl">
          {t("title")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <h2 className="text-xl font-bold text-black sm:text-2xl">
          {t("title")}
        </h2>
        <p className="text-sm text-destructive">{t("loadError")}</p>
      </div>
    )
  }

  const { employer, worker, documents } = data

  const employerTopFields: ReviewFieldItem[] = [
    {
      key: "employerNameAr",
      label: t("fields.employerNameAr"),
      value: employer.employer_name_ar?.trim() || empty,
      icon: <FieldIcon src="/forms/step-1/user.svg" />,
    },
    {
      key: "employerNameEn",
      label: t("fields.employerNameEn"),
      value: employer.employer_name_en?.trim() || empty,
      icon: <FieldIcon src="/forms/step-1/user.svg" />,
      valueDir: "ltr",
    },
    {
      key: "nationalId",
      label: t("fields.nationalId"),
      value: employer.national_id || empty,
      icon: <FieldIcon src="/forms/step-1/personalcard.svg" />,
      valueDir: "ltr",
    },
    {
      key: "phone",
      label: t("fields.phone"),
      value: employer.phone ? formatSaudiPhone(employer.phone) : empty,
      icon: <Phone className="size-3.5 text-muted-foreground" />,
      valueDir: "ltr",
    },
  ]

  const employerBottomFields: ReviewFieldItem[] = [
    {
      key: "employerIssuePlace",
      label: t("fields.employerIssuePlace"),
      value: formatNamedEntityLabel(employer.passport_issue_place, empty),
      icon: <FieldIcon src="/icons/global.svg" />,
    },
    {
      key: "city",
      label: t("fields.city"),
      value: formatNamedEntityLabel(employer.city, empty),
      icon: <FieldIcon src="/forms/step-1/location.svg" />,
    },
  ]

  const salaryValue = documents.salary
    ? formatNumber(Number(documents.salary), locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    : empty

  const workerFieldsTop: ReviewFieldItem[] = [
    {
      key: "workerNameAr",
      label: t("fields.workerNameAr"),
      value: worker.worker_name_ar?.trim() || empty,
      icon: <FieldIcon src="/forms/step-2/user.svg" />,
    },
    {
      key: "workerNameEn",
      label: t("fields.workerNameEn"),
      value: worker.worker_name_en?.trim() || empty,
      icon: <FieldIcon src="/forms/step-2/user.svg" />,
      valueDir: "ltr",
    },
    {
      key: "workerPhone",
      label: t("fields.phone"),
      value: worker.worker_phone
        ? formatSaudiPhone(worker.worker_phone)
        : empty,
      icon: <Phone className="size-3.5 text-muted-foreground" />,
      valueDir: "ltr",
    },
    {
      key: "passportNumber",
      label: t("fields.passportNumber"),
      value: worker.passport_number || empty,
      icon: <FieldIcon src="/forms/step-1/id.svg" />,
      valueDir: "ltr",
    },
    {
      key: "passportIssueDate",
      label: t("fields.passportIssueDate"),
      value: worker.passport_issue_date || empty,
      icon: <FieldIcon src="/forms/step-2/calendar.svg" />,
      valueDir: "ltr",
    },
    {
      key: "passportExpiryDate",
      label: t("fields.passportExpiryDate"),
      value: worker.passport_expiry_date || empty,
      icon: <FieldIcon src="/forms/step-2/calendar.svg" />,
      valueDir: "ltr",
    },
  ]

  const workerFieldsBottom: ReviewFieldItem[] = [
    {
      key: "birthDate",
      label: t("fields.birthDate"),
      value: worker.birth_date || empty,
      icon: <FieldIcon src="/forms/step-2/calendar.svg" />,
      valueDir: "ltr",
    },
    {
      key: "philippinesAddress",
      label: t("fields.philippinesAddress"),
      value: worker.philippines_address || empty,
      icon: <FieldIcon src="/forms/step-2/location.svg" />,
    },
    {
      key: "passportIssuePlace",
      label: t("fields.passportIssuePlace"),
      value: formatNamedEntityLabel(
        worker.worker_passport_issue_place ?? worker.passport_issue_place,
        empty,
      ),
      icon: <FieldIcon src="/forms/step-2/location.svg" />,
    },
    {
      key: "salary",
      label: t("fields.salary"),
      value: salaryValue,
      icon: <FieldIcon src="/forms/step-3/money-recive.svg" />,
      valueDir: "ltr",
      valueClassName: "font-clash",
      valueSuffix:
        salaryValue !== empty ? (
          <SaudiRiyal className="size-3.5 shrink-0" aria-hidden="true" />
        ) : null,
    },
  ]

  const documentItems: DocumentItem[] = [
    {
      key: "national_id_image",
      label: t("documents.national_id_image"),
      url: documents.national_id_image,
    },
    {
      key: "iqama_image",
      label: t("documents.iqama_image"),
      url: documents.iqama_image,
    },
    {
      key: "passport_image",
      label: t("documents.passport_image"),
      url: documents.passport_image,
    },
    {
      key: "exit_reentry_visa",
      label: t("documents.exit_reentry_visa"),
      url: documents.exit_reentry_visa,
    },
    {
      key: "employer_signature",
      label: t("documents.employer_signature"),
      url: documents.employer_signature,
    },
    {
      key: "worker_signature",
      label: t("documents.worker_signature"),
      url: documents.worker_signature,
    },
  ]

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <h2 className="text-xl font-bold text-black sm:text-2xl">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <section>
        <ReviewSectionTitle
          icon={
            <CustomIcon
              src="/forms/step-1/user.svg"
              size={16}
              className="size-4.5 text-accent"
            />
          }
        >
          {t("sections.employer")}
        </ReviewSectionTitle>
        <div className="flex flex-col gap-6">
          <ReviewFieldsRow fields={employerTopFields} />
          <ReviewFieldsRow fields={employerBottomFields} />
        </div>
      </section>

      <section>
        <ReviewSectionTitle
          icon={
            <CustomIcon
              src="/icons/worker.svg"
              size={16}
              className="size-4.5 text-accent"
            />
          }
        >
          {t("sections.worker")}
        </ReviewSectionTitle>
        <div className="flex flex-col gap-8">
          <ReviewFieldsRow fields={workerFieldsTop} />
          <ReviewFieldsRow fields={workerFieldsBottom} />
        </div>
      </section>

      <section>
        <ReviewSectionTitle
          icon={
            <CustomIcon
              src="/forms/step-3/shield-tick.svg"
              size={16}
              className="size-4.5 text-accent"
            />
          }
        >
          {t("sections.documents")}
        </ReviewSectionTitle>
        <div className="flex flex-wrap gap-3">
          {documentItems.map((item) => (
            <DocumentPreviewButton
              key={item.key}
              label={item.label}
              url={item.url}
              showExtension={
                item.key !== "employer_signature" &&
                item.key !== "worker_signature"
              }
              onPreview={() => setPreview(item)}
            />
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => onConfirmedChange(!confirmed)}
        aria-pressed={confirmed}
        className={cn(
          "flex w-full items-center gap-3 rounded-none bg-[#e8f4f6] px-4 py-3 text-start transition-colors hover:bg-[#dceef1]",
          !confirmed && "ring-1 ring-border/60",
        )}
      >
        {confirmed ? (
          <CustomIcon
            src="/icons/check-green.svg"
            size={20}
            className="size-5 shrink-0 text-[#22C55E]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="size-5 shrink-0 rounded-full border-2 border-[#c9d4d8] bg-transparent"
          />
        )}
        <span className="text-sm font-semibold text-black">
          {t("confirmation")}
        </span>
      </button>

      <Dialog
        open={Boolean(preview)}
        onOpenChange={(open) => {
          if (!open) setPreview(null)
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[85vh] w-full flex-col gap-5 overflow-hidden rounded-2xl p-5 sm:max-w-2xl"
        >
          <DialogHeader className="flex shrink-0 flex-row items-center justify-between gap-3 space-y-0 pe-0">
            <DialogTitle className="text-base font-bold text-black">
              {preview?.label ?? t("preview")}
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

          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border/70 bg-muted/20">
            {previewUrl && previewKind === "image" ? (
              <ImagePreview
                src={previewUrl}
                alt={preview?.label ?? t("preview")}
                errorMessage={t("fileLoadError")}
              />
            ) : previewUrl && previewKind === "pdf" ? (
              pdfStatus === "ready" && pdfBlobUrl ? (
                <iframe
                  src={pdfBlobUrl}
                  title={preview?.label ?? t("preview")}
                  className="h-[min(70vh,36rem)] w-full border-0 bg-white"
                />
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
                  <p
                    className={cn(
                      "text-sm",
                      pdfStatus === "error"
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {pdfStatus === "error"
                      ? t("fileLoadError")
                      : t("fileLoading")}
                  </p>
                  {pdfStatus === "error" ? (
                    <Button asChild variant="secondary" className="rounded-full">
                      <a href={previewUrl} target="_blank" rel="noreferrer">
                        {t("openFile")}
                      </a>
                    </Button>
                  ) : null}
                </div>
              )
            ) : previewUrl ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
                <p className="text-sm font-medium text-black">
                  {preview?.label ?? t("preview")}
                </p>
                <Button asChild variant="secondary" className="rounded-full">
                  <a href={previewUrl} target="_blank" rel="noreferrer">
                    {t("openFile")}
                  </a>
                </Button>
              </div>
            ) : null}
          </div>

          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="h-11 w-full shrink-0 rounded-full bg-muted text-base text-muted-foreground hover:bg-muted/80"
            >
              {t("close")}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
