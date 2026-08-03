"use client"

import { Controller, useWatch, type Control } from "react-hook-form"
import { useTranslations } from "next-intl"
import ReactCountryFlag from "react-country-flag"

import CustomIcon from "@/components/custom-icon"
import MutedParensText from "@/components/shared/muted-parens-text"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
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
import GregorianDateField from "@/features/forms/components/gregorian-date-field"
import { usePassportIssuePlaces } from "@/features/forms/hooks/use-passport-issue-places"
import {
  getDateYearsBeforeToday,
  parseGregorianDateValue,
} from "@/features/forms/lib/gregorian-date"
import { MIN_WORKER_AGE } from "@/features/forms/schemas/worker-step"
import { WORKER_PASSPORT_ISSUE_COUNTRY } from "@/features/forms/services/passport-issue-places"
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
  "w-full focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
)

const addonStartClassName = "gap-0 border-e border-border/70 pe-3 ps-4"

type ComboboxOption = {
  value: string
  label: string
}

type WorkerStepFormProps = {
  control: Control<WorkerStepValues, unknown, WorkerStepValues>
  className?: string
}

export default function WorkerStepForm({
  control,
  className,
}: WorkerStepFormProps) {
  const t = useTranslations("Forms.renewal.wizard.worker")
  const maxBirthDate = getDateYearsBeforeToday(MIN_WORKER_AGE)
  const passportIssueDateValue = useWatch({
    control,
    name: "passport_issue_date",
  })
  const {
    data: passportIssuePlaces = [],
    isPending: isPassportPlacesPending,
    isError: isPassportPlacesError,
  } = usePassportIssuePlaces(WORKER_PASSPORT_ISSUE_COUNTRY, "en")

  const passportIssuePlaceOptions: ComboboxOption[] = passportIssuePlaces.map(
    (place) => ({
      value: String(place.id),
      label: place.name_en,
    }),
  )

  const passportIssuePlaceAnchor = useComboboxAnchor()

  const issueDate = parseGregorianDateValue(passportIssueDateValue ?? "")
  const minPassportExpiryDate = issueDate
    ? new Date(
        issueDate.getUTCFullYear(),
        issueDate.getUTCMonth(),
        issueDate.getUTCDate() + 1,
      )
    : undefined

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
                      <span className="font-clash text-xs">{SAUDI_COUNTRY_CODE}</span>
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
                  className="pe-4 font-clash"
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
                maxDate={maxBirthDate}
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
          render={({ field, fieldState }) => {
            const selected =
              passportIssuePlaceOptions.find(
                (option) => option.value === field.value,
              ) ?? null

            return (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="passport_issue_place_id">
                  <MutedParensText
                    text={t("fields.passport_issue_place_id.label")}
                  />
                  <span className="text-accent">*</span>
                </FieldLabel>
                <Combobox
                  items={passportIssuePlaceOptions}
                  value={selected}
                  onValueChange={(option) =>
                    field.onChange(option?.value ?? "")
                  }
                  itemToStringValue={(option) => option.label}
                  isItemEqualToValue={(item, value) =>
                    item.value === value.value
                  }
                  disabled={
                    isPassportPlacesPending || isPassportPlacesError
                  }
                >
                  <div ref={passportIssuePlaceAnchor} className="w-full">
                    <ComboboxInput
                      id="passport_issue_place_id"
                      placeholder={
                        isPassportPlacesPending
                          ? t("fields.passport_issue_place_id.loading")
                          : isPassportPlacesError
                            ? t("fields.passport_issue_place_id.loadError")
                            : t("fields.passport_issue_place_id.placeholder")
                      }
                      aria-invalid={fieldState.invalid}
                      className={inputGroupClassName}
                      showClear={Boolean(selected)}
                      dir="ltr"
                      lang="en"
                    >
                      <InputGroupAddon
                        align="inline-start"
                        className={addonStartClassName}
                      >
                        <CustomIcon
                          src="/forms/step-1/location.svg"
                          size={18}
                          className="size-4.5 text-muted-foreground"
                        />
                      </InputGroupAddon>
                    </ComboboxInput>
                  </div>
                  <ComboboxContent
                    anchor={passportIssuePlaceAnchor}
                    className="rounded-2xl"
                    dir="ltr"
                    lang="en"
                  >
                    <ComboboxEmpty>
                      {t("fields.passport_issue_place_id.empty")}
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(option) => (
                        <ComboboxItem key={option.value} value={option}>
                          {option.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )
          }}
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
                minDate={minPassportExpiryDate}
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
