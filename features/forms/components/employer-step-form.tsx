"use client"

import { Controller, type Control } from "react-hook-form"
import { useLocale, useTranslations } from "next-intl"
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
import { useCities } from "@/features/forms/hooks/use-cities"
import { usePassportIssuePlaces } from "@/features/forms/hooks/use-passport-issue-places"
import type { EmployerStepValues } from "@/features/forms/schemas/employer-step"
import {
  keepArabicNameInput,
  keepEnglishNameInput,
  keepNationalIdInput,
} from "@/features/forms/lib/input-filters"
import { getCityLabel } from "@/features/forms/services/cities"
import {
  EMPLOYER_PASSPORT_ISSUE_COUNTRY,
  getPassportIssuePlaceLabel,
} from "@/features/forms/services/passport-issue-places"
import { cn } from "@/lib/utils"

const SAUDI_COUNTRY_CODE = "+966"

const fieldShellClassName =
  "h-12 rounded-full border-border/70 bg-footer shadow-none"

const inputGroupClassName = cn(
  fieldShellClassName,
  "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20 ",
)

const selectTriggerClassName = cn(
  fieldShellClassName,
  "w-full! h-12! rounded-full px-0 pe-3 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 [&>svg]:text-accent!",
)

const addonStartClassName = "gap-0 border-e border-border/70 pe-3 ps-4"

const selectIconWrapClassName =
  "flex h-full items-center border-e border-border/70 px-4"

type EmployerStepFormProps = {
  control: Control<EmployerStepValues, unknown, EmployerStepValues>
  className?: string
}

export default function EmployerStepForm({
  control,
  className,
}: EmployerStepFormProps) {
  const t = useTranslations("Forms.renewal.wizard.employer")
  const locale = useLocale()
  const { data: cities = [], isPending, isError } = useCities(locale)
  const {
    data: passportIssuePlaces = [],
    isPending: isPassportPlacesPending,
    isError: isPassportPlacesError,
  } = usePassportIssuePlaces(EMPLOYER_PASSPORT_ISSUE_COUNTRY, locale)

  return (
    <FieldGroup className={cn("gap-5", className)}>
      <div className="grid gap-5 md:grid-cols-2">
        <Controller
          name="national_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="national_id">
                <MutedParensText text={t("fields.national_id.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName}>
                <InputGroupAddon
                
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <CustomIcon
                    src="/forms/step-1/personalcard.svg"
                    size={18}
                    className="size-4.5 text-muted-foreground"
                  />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="national_id"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={10}
                  value={field.value ?? ""}
                  placeholder={t("fields.national_id.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                  onChange={(event) =>
                    field.onChange(keepNationalIdInput(event.target.value))
                  }
                />
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="phone">
                <MutedParensText text={t("fields.phone.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName} dir="ltr">
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <InputGroupText className="gap-2 font-semibold text-foreground">
                    <span className="flex items-center gap-2 rounded-full bg-white px-2 py-1">
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
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={field.value ?? ""}
                  placeholder={t("fields.phone.placeholder")}
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
          name="employer_name_ar"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="employer_name_ar">
                <MutedParensText text={t("fields.employer_name_ar.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName}>
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <CustomIcon
                    src="/forms/step-1/user.svg"
                    size={18}
                    className="size-4.5 text-muted-foreground"
                  />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="employer_name_ar"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(keepArabicNameInput(event.target.value))
                  }
                  placeholder={t("fields.employer_name_ar.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                  lang="ar"
                  inputMode="text"
                />
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="employer_name_en"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="employer_name_en">
                <MutedParensText text={t("fields.employer_name_en.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <InputGroup className={inputGroupClassName}>
                <InputGroupAddon
                  align="inline-start"
                  className={addonStartClassName}
                >
                  <CustomIcon
                    src="/forms/step-1/user.svg"
                    size={18}
                    className="size-4.5 text-muted-foreground"
                  />
                </InputGroupAddon>
                <InputGroupInput
                  {...field}
                  id="employer_name_en"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(keepEnglishNameInput(event.target.value))
                  }
                  placeholder={t("fields.employer_name_en.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="pe-4"
                  lang="en"
                
                  inputMode="text"
                />
              </InputGroup>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="city_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="city_id">
                <MutedParensText text={t("fields.city_id.label")} />
                <span className="text-accent">*</span>
              </FieldLabel>
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
                disabled={isPending || isError}
              >
                <SelectTrigger
                  id="city_id"
                  aria-invalid={fieldState.invalid}
                  className={selectTriggerClassName}
                >
                  <span className="flex min-w-0 flex-1 items-center">
                    <span className={selectIconWrapClassName}>
                      <CustomIcon
                        src="/forms/step-1/location.svg"
                        size={18}
                        className="size-4.5 text-muted-foreground"
                      />
                    </span>
                    <span className="min-w-0 flex-1 px-3 text-start">
                      <SelectValue
                        placeholder={
                          isPending
                            ? t("fields.city_id.loading")
                            : isError
                              ? t("fields.city_id.loadError")
                              : t("fields.city_id.placeholder")
                        }
                      />
                    </span>
                  </span>
                </SelectTrigger>
                <SelectContent
                  align="start"
                  className="w-(--radix-select-trigger-width) max-h-72"
                  position="popper"
                >
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {getCityLabel(city, locale)}
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
                disabled={isPassportPlacesPending || isPassportPlacesError}
              >
                <SelectTrigger
                  id="passport_issue_place_id"
                  aria-invalid={fieldState.invalid}
                  className={selectTriggerClassName}
                >
                  <span className="flex min-w-0 flex-1 items-center">
                    <span className={selectIconWrapClassName}>
                      <CustomIcon
                        src="/forms/step-1/location.svg"
                        size={18}
                        className="size-4.5 text-muted-foreground"
                      />
                    </span>
                    <span className="min-w-0 flex-1 px-3 text-start">
                      <SelectValue
                        placeholder={
                          isPassportPlacesPending
                            ? t("fields.passport_issue_place_id.loading")
                            : isPassportPlacesError
                              ? t("fields.passport_issue_place_id.loadError")
                              : t("fields.passport_issue_place_id.placeholder")
                        }
                      />
                    </span>
                  </span>
                </SelectTrigger>
                <SelectContent
                  align="start"
                  className="w-(--radix-select-trigger-width) max-h-72"
                  position="popper"
                >
                  {passportIssuePlaces.map((place) => (
                    <SelectItem key={place.id} value={String(place.id)}>
                      {getPassportIssuePlaceLabel(place, locale)}
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
      </div>
    </FieldGroup>
  )
}
