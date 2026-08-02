"use client"

import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useTranslations } from "next-intl"
import ReactCountryFlag from "react-country-flag"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { keepDigitsOnlyInput, keepNameTextInput, keepSaudiPhoneInput } from "@/features/forms/lib/input-filters"
import {
  createPaymentDeliveryAddressSchema,
  PAYMENT_DELIVERY_ADDRESS_DEFAULT_VALUES,
  type PaymentDeliveryAddressValues,
} from "@/features/forms/schemas/payment-delivery-address"
import { cn } from "@/lib/utils"

const SAUDI_COUNTRY_CODE = "+966"

const fieldClassName =
  "h-12 rounded-full border-border/70 bg-custom-gray px-4 shadow-none placeholder:text-muted-foreground"

const inputGroupClassName = cn(
  fieldClassName,
  "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
)

type PaymentDeliveryAddressFormProps = {
  defaultValues?: PaymentDeliveryAddressValues
  onSaved?: (values: PaymentDeliveryAddressValues) => void
  className?: string
}

export default function PaymentDeliveryAddressForm({
  defaultValues = PAYMENT_DELIVERY_ADDRESS_DEFAULT_VALUES,
  onSaved,
  className,
}: PaymentDeliveryAddressFormProps) {
  const t = useTranslations("Forms.trackOrders.detail.payment.address")
  const schema = useMemo(
    () =>
      createPaymentDeliveryAddressSchema({
        homeAddressRequired: t("errors.homeAddressRequired"),
        nationalAddressRequired: t("errors.nationalAddressRequired"),
        nationalAddressInvalid: t("errors.nationalAddressInvalid"),
        buildingNumberRequired: t("errors.buildingNumberRequired"),
        buildingNumberInvalid: t("errors.buildingNumberInvalid"),
        floorRequired: t("errors.floorRequired"),
        floorInvalid: t("errors.floorInvalid"),
        nameRequired: t("errors.nameRequired"),
        nameInvalid: t("errors.nameInvalid"),
        phoneInvalid: t("errors.phoneInvalid"),
      }),
    [t],
  )

  const form = useForm<PaymentDeliveryAddressValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues,
    mode: "onSubmit",
  })

  function onSubmit(values: PaymentDeliveryAddressValues) {
    onSaved?.(values)
    toast.success(t("saved"))
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className={cn(
        "mt-8 space-y-6 border-t border-border/60 pt-6",
        className,
      )}
    >
      <h3 className="text-sm font-bold text-primary sm:text-base">
        {t("title")}
      </h3>

      <Controller
        name="homeAddress"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <Input
              {...field}
              value={field.value ?? ""}
              placeholder={t("homePlaceholder")}
              aria-invalid={fieldState.invalid}
              className={fieldClassName}
            />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-primary sm:text-base">
          {t("infoTitle")}
        </h3>

        <div className="grid gap-3 sm:grid-cols-3">
          <Controller
            name="nationalAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  inputMode="numeric"
                  placeholder={t("nationalPlaceholder")}
                  aria-invalid={fieldState.invalid}
                  className={fieldClassName}
                  onChange={(event) =>
                    field.onChange(keepDigitsOnlyInput(event.target.value, 20))
                  }
                />
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )}
          />
          <Controller
            name="buildingNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  inputMode="numeric"
                  placeholder={t("buildingPlaceholder")}
                  aria-invalid={fieldState.invalid}
                  className={fieldClassName}
                  onChange={(event) =>
                    field.onChange(keepDigitsOnlyInput(event.target.value, 10))
                  }
                />
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )}
          />
          <Controller
            name="floor"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  inputMode="numeric"
                  placeholder={t("floorPlaceholder")}
                  aria-invalid={fieldState.invalid}
                  className={fieldClassName}
                  onChange={(event) =>
                    field.onChange(keepDigitsOnlyInput(event.target.value, 5))
                  }
                />
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )}
          />
        </div>

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <Textarea
                {...field}
                value={field.value ?? ""}
                placeholder={t("descriptionPlaceholder")}
                rows={4}
                aria-invalid={fieldState.invalid}
                className="min-h-16 rounded-2xl border-border/70 bg-custom-gray px-4 py-3 shadow-none"
              />
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-primary sm:text-base">
          {t("contactTitle")}
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <InputGroup className={inputGroupClassName}>
                  <InputGroupAddon className="ps-4">
                    <CustomIcon
                      src="/icons/user.svg"
                      size={16}
                      className="size-4 text-muted-foreground"
                    />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    value={field.value ?? ""}
                    placeholder={t("namePlaceholder")}
                    aria-invalid={fieldState.invalid}
                    className="placeholder:text-muted-foreground"
                    onChange={(event) =>
                      field.onChange(keepNameTextInput(event.target.value))
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
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <InputGroup dir="ltr" className={inputGroupClassName}>
                  <InputGroupAddon
                    align="inline-start"
                    className="gap-0 border-e border-border/70 pe-3 ps-3"
                  >
                    <InputGroupText className="font-sans text-foreground">
                      <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5">
                        <ReactCountryFlag
                          countryCode="SA"
                          svg
                          style={{
                            width: "1rem",
                            height: "0.75rem",
                            borderRadius: "2px",
                          }}
                          aria-hidden
                        />
                        <span
                          dir="ltr"
                          className="font-clash text-xs font-medium tabular-nums"
                        >
                          {SAUDI_COUNTRY_CODE}
                        </span>
                      </span>
                    </InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    value={field.value ?? ""}
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder={t("phonePlaceholder")}
                    aria-invalid={fieldState.invalid}
                    className=" placeholder:text-muted-foreground font-clash"
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
        </div>
      </div>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-12 w-full rounded-full bg-[#003143] text-sm font-semibold text-white hover:bg-[#003143]/90"
      >
        {t("save")}
      </Button>
    </form>
  )
}
