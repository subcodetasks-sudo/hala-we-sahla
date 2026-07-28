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
  className?: string
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
      size={14}
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
      <h3 className="text-base font-bold">{children}</h3>
    </div>
  )
}

function ReviewFieldsGrid({
  fields,
  columns = 3,
}: {
  fields: ReviewFieldItem[]
  columns?: 2 | 3
}) {
  return (
    <div
      className={cn(
        "grid gap-x-0 gap-y-6",
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {fields.map((field, index) => {
        const isRowStart = index % columns === 0
        return (
          <div
            key={field.key}
            className={cn(
              "min-w-0 px-0 sm:px-4",
              !isRowStart && "sm:border-s sm:border-border/70",
              index < columns && "sm:pt-0",
              field.className,
            )}
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {field.icon}
              <span className="text-xs font-medium">{field.label}</span>
            </div>
            <p className="mt-1.5 text-sm font-bold wrap-break-word text-foreground">
              {field.value}
            </p>
          </div>
        )
      })}
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
      className="inline-flex h-11 max-w-full items-center gap-2 rounded-full bg-[#e8f4f6] px-4 text-sm font-semibold text-foreground transition-colors hover:bg-[#dceef1]"
    >
      <Eye className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <span className="truncate">
        {label}
        {showExtension ? extension : ""}
      </span>
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

  const employerFields: ReviewFieldItem[] = [
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
    {
      key: "city",
      label: t("fields.city"),
      value: cityLabel
        ? tEmployer(`options.cities.${cityLabel}`)
        : empty,
      icon: <FieldIcon src="/forms/step-1/location.svg" />,
    },
    {
      key: "employerIssuePlace",
      label: t("fields.employerIssuePlace"),
      value: employerIssueLabel
        ? tEmployer(`options.issuePlaces.${employerIssueLabel}`)
        : empty,
      icon: <FieldIcon src="/icons/global.svg" />,
      className: "sm:col-span-2",
    },
  ]

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
  ]

  const workerFieldsDates: ReviewFieldItem[] = [
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
      className: "sm:col-span-1",
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
  ]

  const salaryValue = documents.salary
    ? `${formatNumber(Number(documents.salary), locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`
    : empty

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

  const previewUrl = useMemo(() => {
    if (!preview?.file || !preview.file.type.startsWith("image/")) return null
    return URL.createObjectURL(preview.file)
  }, [preview])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <section>
        <ReviewSectionTitle
          icon={
            <CustomIcon
              src="/forms/step-1/user.svg"
              size={18}
              className="size-4.5 text-accent"
            />
          }
        >
          {t("sections.employer")}
        </ReviewSectionTitle>
        <ReviewFieldsGrid fields={employerFields} />
      </section>

      <div className="border-t border-border/60" />

      <section>
        <ReviewSectionTitle
          icon={
            <CustomIcon
              src="/forms/step-2/user-tick.svg"
              size={18}
              className="size-4.5 text-accent"
            />
          }
        >
          {t("sections.worker")}
        </ReviewSectionTitle>
        <div className="flex flex-col gap-6">
          <ReviewFieldsGrid fields={workerFieldsTop} />
          <ReviewFieldsGrid fields={workerFieldsDates} columns={2} />
          <ReviewFieldsGrid fields={workerFieldsBottom} />
          <div className="sm:max-w-1/3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FieldIcon src="/forms/step-3/money-recive.svg" />
              <span className="text-xs font-medium">{t("fields.salary")}</span>
            </div>
            <p className="mt-1.5 flex items-center gap-1 text-sm font-bold text-foreground">
              {salaryValue}
              {documents.salary ? (
                <SaudiRiyal className="size-3.5" aria-hidden="true" />
              ) : null}
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-border/60" />

      <section>
        <ReviewSectionTitle
          icon={
            <CustomIcon
              src="/forms/step-3/shield-tick.svg"
              size={18}
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
          "flex w-full items-center gap-3 rounded-2xl bg-[#e8f4f6] px-4 py-3.5 text-start transition-colors hover:bg-[#dceef1]",
          !confirmed && "ring-1 ring-border/60",
        )}
      >
        <CustomIcon
          src="/icons/check-green.svg"
          size={20}
          className={cn(
            "size-5 shrink-0",
            confirmed ? "opacity-100" : "opacity-35 grayscale",
          )}
        />
        <span className="text-sm font-semibold text-foreground">
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
          className="gap-5 rounded-2xl p-5 sm:max-w-md"
        >
          <DialogHeader className="flex-row items-center justify-between gap-3 space-y-0 pe-0">
            <DialogTitle className="text-base font-bold text-foreground">
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

          <div className="overflow-hidden">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={preview?.label ?? t("preview")}
                className="h-auto w-full object-contain"
              />
            ) : preview?.file ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-border/70 bg-muted/20 px-4 py-10 text-center">
                <p className="text-sm font-medium text-foreground">
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
