"use client"

import { Controller, type Control } from "react-hook-form"
import { useLocale, useTranslations } from "next-intl"
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
  "w-full focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
)

const addonStartClassName = "gap-0 border-e border-border/70 pe-3 ps-4"

type ComboboxOption = {
  value: string
  label: string
}

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

  const cityOptions: ComboboxOption[] = cities.map((city) => ({
    value: String(city.id),
    label: getCityLabel(city, locale),
  }))

  const passportIssuePlaceOptions: ComboboxOption[] = passportIssuePlaces.map(
    (place) => ({
      value: String(place.id),
      label: getPassportIssuePlaceLabel(place, locale),
    }),
  )

  const cityAnchor = useComboboxAnchor()
  const passportIssuePlaceAnchor = useComboboxAnchor()

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
                      <span className="font-clash text-xs">{SAUDI_COUNTRY_CODE}</span>
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
          render={({ field, fieldState }) => {
            const selected =
              cityOptions.find((option) => option.value === field.value) ??
              null

            return (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="city_id">
                  <MutedParensText text={t("fields.city_id.label")} />
                  <span className="text-accent">*</span>
                </FieldLabel>
                <Combobox
                  items={cityOptions}
                  value={selected}
                  onValueChange={(option) =>
                    field.onChange(option?.value ?? "")
                  }
                  itemToStringValue={(option) => option.label}
                  isItemEqualToValue={(item, value) =>
                    item.value === value.value
                  }
                  disabled={isPending || isError}
                >
                  <div ref={cityAnchor} className="w-full">
                    <ComboboxInput
                      id="city_id"
                      placeholder={
                        isPending
                          ? t("fields.city_id.loading")
                          : isError
                            ? t("fields.city_id.loadError")
                            : t("fields.city_id.placeholder")
                      }
                      aria-invalid={fieldState.invalid}
                      className={inputGroupClassName}
                      showClear={Boolean(selected)}
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
                    anchor={cityAnchor}
                    className="rounded-2xl"
                  >
                    <ComboboxEmpty>
                      {t("fields.city_id.empty")}
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
      </div>
    </FieldGroup>
  )
}
