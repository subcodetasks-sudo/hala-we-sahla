"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Eye, Phone, SaudiRiyal } from "lucide-react"
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
import {
  CITY_OPTIONS,
  PASSPORT_ISSUE_PLACE_OPTIONS,
} from "@/features/forms/constants/employer-options"
import type { DocumentsStepValues } from "@/features/forms/schemas/documents-step"
import type { EmployerStepValues } from "@/features/forms/schemas/employer-step"
import type { WorkerStepValues } from "@/features/forms/schemas/worker-step"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

type ReviewStepProps = {
  employer: EmployerStepValues
  worker: WorkerStepValues
  documents: DocumentsStepValues
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
}

type DocumentItem = {
  key: keyof DocumentsStepValues
  label: string
  file: File | null
}

function formatSaudiPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10 && digits.startsWith("05")) {
    return `+966 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }
  return phone
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
      <h3 className="text-base font-bold shrink-0">{children}</h3>
      <div className="border-t border-border/60 grow" />
    </div>
  )
}

function ReviewFieldCell({ field }: { field: ReviewFieldItem }) {
  return (
    <div className="flex min-w-0 flex-col  gap-1.5 px-2  sm:px-3">
      <span className="flex size-5 items-center justify-center">{field.icon}</span>
      <p className="text-xs font-medium text-muted-foreground sm:text-sm">
        {field.label}
      </p>
      <p className="inline-flex max-w-full  gap-1 text-sm font-bold wrap-break-word text-[#1a3d4d] sm:text-base">
        <span className="min-w-0">{field.value}</span>
        {field.valueSuffix}
      </p>
    </div>
  )
}

function ReviewFieldsRow({
  fields,
  columnsClassName,
}: {
  fields: ReviewFieldItem[]
  columnsClassName: string
}) {
  return (
    <div className={cn("grid gap-y-6", columnsClassName)}>
      {fields.map((field, index) => (
        <div key={field.key} className="relative min-w-0">
          {index > 0 ? (
            <span
              aria-hidden="true"
              className="absolute inset-s-0 top-1/2 hidden h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-[#d7d7d7] sm:block rtl:translate-x-1/2"
            />
          ) : null}
          <ReviewFieldCell field={field} />
        </div>
      ))}
    </div>
  )
}

function DocumentPreviewButton({
  label,
  file,
  showExtension = true,
  onPreview,
}: {
  label: string
  file: File | null
  showExtension?: boolean
  onPreview: () => void
}) {
  if (!file) return null

  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : file.type === "application/pdf"
      ? ".pdf"
      : file.type.startsWith("image/")
        ? ".png"
        : ""

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

export default function ReviewStep({
  employer,
  worker,
  documents,
  confirmed,
  onConfirmedChange,
  className,
}: ReviewStepProps) {
  const t = useTranslations("Forms.renewal.wizard.review")
  const tEmployer = useTranslations("Forms.renewal.wizard.employer")
  const tWorker = useTranslations("Forms.renewal.wizard.worker")
  const locale = useLocale()
  const [preview, setPreview] = useState<DocumentItem | null>(null)

  const empty = t("empty")

  const cityLabel =
    CITY_OPTIONS.find((option) => option.id === employer.city_id)?.labelKey ??
    null
  const employerIssueLabel =
    PASSPORT_ISSUE_PLACE_OPTIONS.find(
      (option) => option.id === employer.passport_issue_place_id,
    )?.labelKey ?? null
  const workerIssueLabel =
    PASSPORT_ISSUE_PLACE_OPTIONS.find(
      (option) => option.id === worker.passport_issue_place_id,
    )?.labelKey ?? null

  const employerTopFields: ReviewFieldItem[] = [
    {
      key: "employerName",
      label: t("fields.employerName"),
      value: employer.employer_name_ar || empty,
      icon: <FieldIcon src="/forms/step-1/user.svg" />,
    },
    {
      key: "nationalId",
      label: t("fields.nationalId"),
      value: employer.national_id || empty,
      icon: <FieldIcon src="/forms/step-1/personalcard.svg" />,
    },
    {
      key: "phone",
      label: t("fields.phone"),
      value: employer.phone ? formatSaudiPhone(employer.phone) : empty,
      icon: <Phone className="size-3.5 text-muted-foreground" />,
    },
  ]

  const employerBottomFields: ReviewFieldItem[] = [
    {
      key: "employerIssuePlace",
      label: t("fields.employerIssuePlace"),
      value: employerIssueLabel
        ? tEmployer(`options.issuePlaces.${employerIssueLabel}`)
        : empty,
      icon: <FieldIcon src="/icons/global.svg" />,
    },
    {
      key: "city",
      label: t("fields.city"),
      value: cityLabel
        ? tEmployer(`options.cities.${cityLabel}`)
        : empty,
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
      key: "workerName",
      label: t("fields.workerName"),
      value: worker.worker_name_ar || empty,
      icon: <FieldIcon src="/forms/step-2/user.svg" />,
    },
    {
      key: "workerPhone",
      label: t("fields.phone"),
      value: worker.worker_phone
        ? formatSaudiPhone(worker.worker_phone)
        : empty,
      icon: <Phone className="size-3.5 text-muted-foreground" />,
    },
    {
      key: "passportNumber",
      label: t("fields.passportNumber"),
      value: worker.passport_number || empty,
      icon: <FieldIcon src="/forms/step-1/id.svg" />,
    },
    {
      key: "passportIssueDate",
      label: t("fields.passportIssueDate"),
      value: worker.passport_issue_date || empty,
      icon: <FieldIcon src="/forms/step-2/calendar.svg" />,
    },
    {
      key: "passportExpiryDate",
      label: t("fields.passportExpiryDate"),
      value: worker.passport_expiry_date || empty,
      icon: <FieldIcon src="/forms/step-2/calendar.svg" />,
    },
  ]

  const workerFieldsBottom: ReviewFieldItem[] = [
    {
      key: "birthDate",
      label: t("fields.birthDate"),
      value: worker.birth_date || empty,
      icon: <FieldIcon src="/forms/step-2/calendar.svg" />,
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
      value: workerIssueLabel
        ? tWorker(`options.issuePlaces.${workerIssueLabel}`)
        : empty,
      icon: <FieldIcon src="/forms/step-2/location.svg" />,
    },
    {
      key: "salary",
      label: t("fields.salary"),
      value: salaryValue,
      icon: <FieldIcon src="/forms/step-3/money-recive.svg" />,
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
      file: documents.national_id_image,
    },
    {
      key: "iqama_image",
      label: t("documents.iqama_image"),
      file: documents.iqama_image,
    },
    {
      key: "passport_image",
      label: t("documents.passport_image"),
      file: documents.passport_image,
    },
    {
      key: "exit_reentry_visa",
      label: t("documents.exit_reentry_visa"),
      file: documents.exit_reentry_visa,
    },
    {
      key: "employer_signature",
      label: t("documents.employer_signature"),
      file: documents.employer_signature,
    },
    {
      key: "worker_signature",
      label: t("documents.worker_signature"),
      file: documents.worker_signature,
    },
  ]

  const previewIsImage = Boolean(preview?.file?.type.startsWith("image/"))
  const previewIsPdf =
    preview?.file?.type === "application/pdf" ||
    Boolean(preview?.file?.name.toLowerCase().endsWith(".pdf"))

  const previewUrl = useMemo(() => {
    if (!preview?.file || (!previewIsImage && !previewIsPdf)) return null
    return URL.createObjectURL(preview.file)
  }, [preview, previewIsImage, previewIsPdf])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <h2 className="text-xl font-bold text-black sm:text-2xl">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <section >
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
          <ReviewFieldsRow
            fields={employerTopFields}
            columnsClassName="sm:grid-cols-3"
          />
          <ReviewFieldsRow
            fields={employerBottomFields}
            columnsClassName="sm:grid-cols-2"
          />
        </div>
      </section>


      <section >
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
          <ReviewFieldsRow
            fields={workerFieldsTop}
            columnsClassName="grid-cols-2 sm:grid-cols-3 xl:grid-cols-5"
          />
          <ReviewFieldsRow
            fields={workerFieldsBottom}
            columnsClassName="grid-cols-2 sm:grid-cols-2 xl:grid-cols-4"
          />
        </div>
      </section>


      <section >
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
              file={item.file}
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
          "flex w-full  items-center  gap-3 rounded-none bg-[#e8f4f6] px-4 py-3 text-start transition-colors hover:bg-[#dceef1]",
          !confirmed && "ring-1 ring-border/60",
        )}
      >
        <CustomIcon
          src="/icons/check-green.svg"
          size={20}
          className={cn(
            "size-5 shrink-0",
            confirmed ? "opacity-100 text-green-600/80   " : "opacity-35 grayscale",
          )}
        />
        <span className="text-sm font-semibold text-black">{t("confirmation")}</span>
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
            {previewUrl && previewIsImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={preview?.label ?? t("preview")}
                className="mx-auto h-auto max-h-[calc(85vh-10rem)] w-full object-contain"
              />
            ) : previewUrl && previewIsPdf ? (
              <iframe
                src={previewUrl}
                title={preview?.label ?? t("preview")}
                className="h-[min(70vh,36rem)] w-full border-0 bg-white"
              />
            ) : preview?.file ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <p className="text-sm font-medium text-black">
                  {preview.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {preview.file.type || t("preview")}
                </p>
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
