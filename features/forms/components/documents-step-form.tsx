"use client"

import { Controller, type Control } from "react-hook-form"
import { SaudiRiyal } from "lucide-react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import DocumentUploadField from "@/features/forms/components/document-upload-field"
import SignatureUploadButton from "@/features/forms/components/signature-upload-button"
import { keepDecimalInput } from "@/features/forms/lib/input-filters"
import type { DocumentsStepValues } from "@/features/forms/schemas/documents-step"
import { cn } from "@/lib/utils"

const fieldShellClassName =
  "h-12 rounded-full border-border/70 bg-footer shadow-none"

const inputGroupClassName = cn(
  fieldShellClassName,
  "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
)

const addonStartClassName = "gap-0 border-e border-border/70 pe-3 ps-4"

type DocumentsStepFormProps = {
  control: Control<DocumentsStepValues, unknown, DocumentsStepValues>
  className?: string
}

const UPLOAD_FIELDS = [
  {
    name: "national_id_image",
    labelKey: "national_id_image",
  },
  {
    name: "iqama_image",
    labelKey: "iqama_image",
  },
  {
    name: "passport_image",
    labelKey: "passport_image",
    showInfo: true,
    sampleSrc: "/forms/passport.png",
  },
  {
    name: "exit_reentry_visa",
    labelKey: "exit_reentry_visa",
  },
] as const

const SIGNATURE_FIELDS = [
  {
    name: "employer_signature",
    labelKey: "employer",
  },
  {
    name: "worker_signature",
    labelKey: "worker",
  },
] as const

export default function DocumentsStepForm({
  control,
  className,
}: DocumentsStepFormProps) {
  const t = useTranslations("Forms.renewal.wizard.documents")

  return (
    <FieldGroup className={cn("gap-5", className)}>
      <div className="grid gap-5">
        {UPLOAD_FIELDS.map((item) => (
          <Controller
            key={item.name}
            name={item.name}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <DocumentUploadField
                  id={item.name}
                  label={t(`fields.${item.labelKey}.label`)}
                  value={field.value instanceof File ? field.value : null}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                  showInfo={"showInfo" in item ? item.showInfo : false}
                  infoTitle={t("sampleTitle")}
                  sampleSrc={
                    "sampleSrc" in item ? item.sampleSrc : undefined
                  }
                />
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )}
          />
        ))}

        <Controller
          name="salary"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="salary">
                {t("fields.salary.label")}
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName}>
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <CustomIcon
                    src="/forms/step-3/money-recive.svg"
                    size={18}
                    className="size-4.5 text-muted-foreground"
                  />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="salary"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={field.value ?? ""}
                  placeholder={t("fields.salary.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                  onChange={(event) =>
                    field.onChange(keepDecimalInput(event.target.value))
                  }
                />
                <InputGroupAddon align="inline-end" className="pe-4">
                  <SaudiRiyal
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {SIGNATURE_FIELDS.map((item) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <SignatureUploadButton
                    id={item.name}
                    label={t(`signatures.${item.labelKey}`)}
                    value={field.value instanceof File ? field.value : null}
                    onChange={field.onChange}
                    invalid={fieldState.invalid}
                  />
                  {fieldState.error ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </Field>
              )}
            />
          ))}
        </div>
      </div>
    </FieldGroup>
  )
}
