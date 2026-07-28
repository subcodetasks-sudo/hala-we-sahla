"use client"

import { Controller, type Control } from "react-hook-form"
import { useTranslations } from "next-intl"
import ReactCountryFlag from "react-country-flag"

import CustomIcon from "@/components/custom-icon"
import MutedParensText from "@/components/shared/muted-parens-text"
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
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import GregorianDateField from "@/features/forms/components/gregorian-date-field"
import { PASSPORT_ISSUE_PLACE_OPTIONS } from "@/features/forms/constants/employer-options"
import {
  keepArabicNameInput,
  keepEnglishNameInput,
  keepPassportNumberInput,
  keepSaudiPhoneInput,
} from "@/features/forms/lib/input-filters"
import type { WorkerStepValues } from "@/features/forms/schemas/worker-step"
import { cn } from "@/lib/utils"

const SAUDI_COUNTRY_CODE = "+966"

const fieldShellClassName =
  "h-12 rounded-full border-border/70 bg-footer shadow-none"

const inputGroupClassName = cn(
  fieldShellClassName,
  "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
)

const selectTriggerClassName = cn(
  fieldShellClassName,
  "w-full! h-12! rounded-full px-0 pe-3 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 [&>svg]:text-accent!",
)

const addonStartClassName = "gap-0 border-e border-border/70 pe-3 ps-4"

const selectIconWrapClassName =
  "flex h-full items-center border-e border-border/70 px-4"

type WorkerStepFormProps = {
  control: Control<WorkerStepValues, unknown, WorkerStepValues>
  className?: string
}

export default function WorkerStepForm({
  control,
  className,
}: WorkerStepFormProps) {
  const t = useTranslations("Forms.renewal.wizard.worker")

  return (
    <FieldGroup className={cn("gap-5", className)}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Controller
          name="worker_name_ar"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="worker_name_ar">
                <MutedParensText text={t("fields.worker_name_ar.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName}>
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <CustomIcon
                    src="/forms/step-2/user.svg"
                    size={18}
                    className="size-4.5 text-muted-foreground"
                  />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="worker_name_ar"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(keepArabicNameInput(event.target.value))
                  }
                  placeholder={t("fields.worker_name_ar.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                  lang="ar"
                />
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="worker_name_en"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="worker_name_en">
                <MutedParensText text={t("fields.worker_name_en.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName}>
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <CustomIcon
                    src="/forms/step-2/user.svg"
                    size={18}
                    className="size-4.5 text-muted-foreground"
                  />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="worker_name_en"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(keepEnglishNameInput(event.target.value))
                  }
                  placeholder={t("fields.worker_name_en.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                  lang="en"
                />
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="worker_phone"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="worker_phone">
                <MutedParensText text={t("fields.worker_phone.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName} dir="ltr">
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <InputGroupText className="gap-2 font-semibold text-foreground">
                    <span className="flex items-center gap-2 rounded-full bg-muted px-2 py-1">
                      <ReactCountryFlag
                        countryCode="SA"
                        svg
                        style={{
                          width: "1rem",
                          height: "0.75rem",
                          borderRadius: "2px",
                        }}
                        aria-hidden="true"
                      />
                      <span className="text-xs">{SAUDI_COUNTRY_CODE}</span>
                    </span>
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="worker_phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(keepSaudiPhoneInput(event.target.value))
                  }
                  placeholder={t("fields.worker_phone.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                />
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="birth_date"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="birth_date">
                <MutedParensText text={t("fields.birth_date.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <GregorianDateField
                id="birth_date"
                value={field.value ?? ""}
                onChange={field.onChange}
                invalid={fieldState.invalid}
              />
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="philippines_address"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="philippines_address">
                <MutedParensText text={t("fields.philippines_address.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName}>
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <CustomIcon
                    src="/forms/step-2/location.svg"
                    size={18}
                    className="size-4.5 text-muted-foreground"
                  />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="philippines_address"
                  value={field.value ?? ""}
                  placeholder={t("fields.philippines_address.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                />
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="passport_issue_place_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="passport_issue_place_id">
                <MutedParensText
                  text={t("fields.passport_issue_place_id.label")}
                />
                <span className="text-accent">*</span>
              </FieldLabel>
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="passport_issue_place_id"
                  aria-invalid={fieldState.invalid}
                  className={selectTriggerClassName}
                  dir="ltr"
                  lang="en"
                >
                  <span className="flex min-w-0 flex-1 items-center">
                    <span className={selectIconWrapClassName}>
                      <CustomIcon
                        src="/forms/step-2/calender.svg"
                        size={18}
                        className="size-4.5 text-muted-foreground"
                      />
                    </span>
                    <span className="min-w-0 flex-1 px-3 text-start" dir="ltr">
                      <SelectValue
                        placeholder={t(
                          "fields.passport_issue_place_id.placeholder",
                        )}
                      />
                    </span>
                  </span>
                </SelectTrigger>
                <SelectContent
                  align="start"
                  className="w-(--radix-select-trigger-width)"
                  position="popper"
                  dir="ltr"
                  lang="en"
                >
                  {PASSPORT_ISSUE_PLACE_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {t(`options.issuePlaces.${option.labelKey}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="passport_number"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="passport_number">
                <MutedParensText text={t("fields.passport_number.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName}>
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <CustomIcon
                    src="/forms/step-2/wallet.svg"
                    size={18}
                    className="size-4.5 text-muted-foreground"
                  />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="passport_number"
                  type="text"
                  inputMode="numeric"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(keepPassportNumberInput(event.target.value))
                  }
                  placeholder={t("fields.passport_number.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                  lang="en"
                />
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="passport_issue_date"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="passport_issue_date">
                <MutedParensText text={t("fields.passport_issue_date.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <GregorianDateField
                id="passport_issue_date"
                value={field.value ?? ""}
                onChange={field.onChange}
                invalid={fieldState.invalid}
              />
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="passport_expiry_date"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="passport_expiry_date">
                <MutedParensText
                  text={t("fields.passport_expiry_date.label")}
                />
                <span className="text-accent">*</span>
              </FieldLabel>
              <GregorianDateField
                id="passport_expiry_date"
                value={field.value ?? ""}
                onChange={field.onChange}
                invalid={fieldState.invalid}
              />
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  )
}
