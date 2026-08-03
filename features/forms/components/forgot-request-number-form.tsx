"use client"

import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useTranslations } from "next-intl"
import ReactCountryFlag from "react-country-flag"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { keepSaudiPhoneInput } from "@/features/forms/lib/input-filters"
import { FORGOT_PHONE_STORAGE_KEY } from "@/features/forms/lib/forgot-request-storage"
import {
  createForgotRequestNumberSchema,
  FORGOT_REQUEST_NUMBER_DEFAULT_VALUES,
  type ForgotRequestNumberValues,
} from "@/features/forms/schemas/forgot-request-number"
import { useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const SAUDI_COUNTRY_CODE = "+966"

const cardClassName =
  "mx-auto max-w-lg gap-0 rounded-[28px] border-none bg-card px-6 py-10 shadow-[0_12px_40px_rgba(40,130,150,0.1)] ring-0 sm:rounded-[32px] sm:px-10 sm:py-12"

const fieldShellClassName =
  "h-12 rounded-full border-[#d7e0e3] bg-[#f3f5f6] shadow-none"

const inputGroupClassName = cn(
  fieldShellClassName,
  "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
)

const addonStartClassName = "gap-0 border-e border-[#d7e0e3] pe-3 ps-2"

export default function ForgotRequestNumberForm() {
  const t = useTranslations("Forms.trackOrders.forgot")
  const router = useRouter()
  const schema = useMemo(
    () =>
      createForgotRequestNumberSchema({
        phoneInvalid: t("errors.phoneInvalid"),
      }),
    [t],
  )

  const form = useForm<ForgotRequestNumberValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: FORGOT_REQUEST_NUMBER_DEFAULT_VALUES,
    mode: "onChange",
  })

  function onSubmit(values: ForgotRequestNumberValues) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(FORGOT_PHONE_STORAGE_KEY, values.phone)
    }
    toast.success(t("success"))
    router.push("/track-orders/forgot/verify")
  }

  return (
    <Card className={cardClassName}>
      <div className="flex flex-col items-center text-center">
        <CustomIcon
          src="/icons/forget-number.svg"
          size={58}
          className="size-14.5 text-primary"
        />
        <h2 className="mt-8 text-xl font-bold text-primary sm:mt-9 sm:text-2xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {t("description")}
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10"
        noValidate
      >
        <FieldGroup className="gap-8">
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="forgot_phone" className="text-primary">
                  {t("fields.phone.label")}
                  <span className="text-accent">*</span>
                </FieldLabel>
                <InputGroup dir="ltr" className={inputGroupClassName}>
                  <InputGroupAddon
                    align="inline-start"
                    className={addonStartClassName}
                  >
                    <InputGroupText className="font-sans text-foreground">
                      <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
                        <ReactCountryFlag
                          countryCode="SA"
                          svg
                          style={{
                            width: "1.05rem",
                            height: "0.8rem",
                            borderRadius: "2px",
                          }}
                          aria-hidden
                        />
                        <span
                          dir="ltr"
                          className="font-clash text-xs font-semibold tabular-nums text-foreground"
                        >
                          {SAUDI_COUNTRY_CODE}
                        </span>
                      </span>
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="forgot_phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    value={field.value ?? ""}
                    placeholder={t("fields.phone.placeholder")}
                    aria-invalid={fieldState.invalid}
                    className="pe-5 font-clash tracking-wide"
                    onChange={(event) =>
                      field.onChange(keepSaudiPhoneInput(event.target.value))
                    }
                  />
                </InputGroup>
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="mx-auto h-12 w-full max-w-70 gap-3 rounded-full px-8 text-base font-bold text-white shadow-[0_8px_24px_rgba(40,130,150,0.35)] sm:w-fit"
          >
            <span>{t("submit")}</span>
            <CustomIcon
              src="/icons/arrows.svg"
              width={28}
              height={16}
              className="shrink-0 text-white ltr:rotate-180"
            />
          </Button>
        </FieldGroup>
      </form>
    </Card>
  )
}
