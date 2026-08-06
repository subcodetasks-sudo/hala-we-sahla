"use client"

import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { useTranslations } from "next-intl"
import ReactCountryFlag from "react-country-flag"
import { ArrowLeft, Loader2, X } from "lucide-react"
import { toast } from "sonner"

import { keepDigitsOnlyInput, keepSaudiPhoneInput } from "@/features/forms/lib/input-filters"
import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
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
import { Textarea } from "@/components/ui/textarea"
import {
  createSupportInquirySchema,
  type SupportInquiryValues,
} from "@/features/support/schemas/support-inquiry"
import { useSupportContactMutation } from "@/features/support/hooks/use-support-contact-mutation"
import type { InquiryTypeView } from "@/features/support/services/support"
import { getApiErrorMessages } from "@/lib/api"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const
const SAUDI_COUNTRY_CODE = "+966"

const pillInputGroupClassName =
  "h-12 rounded-full border-border/70 bg-white shadow-none focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20"

const pillAddonStartClassName =
  "gap-0 border-e border-border/70 pe-3 ps-4"

type SupportInquiryFormProps = {
  formTitleHtml?: string | null
  formTitle: string
  formDescription: string
  inquiryTypes: InquiryTypeView[]
}

export default function SupportInquiryForm({
  formTitleHtml,
  formTitle,
  formDescription,
  inquiryTypes,
}: SupportInquiryFormProps) {
  const t = useTranslations("Support.form")
  const tCommon = useTranslations("Common.errors")
  const shouldReduceMotion = useReducedMotion()
  const contactMutation = useSupportContactMutation()

  const inquiryTypeIds = useMemo(
    () => inquiryTypes.map((type) => type.id),
    [inquiryTypes],
  )

  const schema = useMemo(
    () =>
      createSupportInquirySchema(
        {
          fullNameRequired: t("errors.fullNameRequired"),
          phoneInvalid: t("errors.phoneInvalid"),
          inquiryTypeRequired: t("errors.inquiryTypeRequired"),
          messageRequired: t("errors.messageRequired"),
        },
        inquiryTypeIds,
      ),
    [t, inquiryTypeIds],
  )

  const form = useForm<SupportInquiryValues>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      orderNumber: "",
      inquiryType: undefined,
      message: "",
    },
  })

  const orderNumber = form.watch("orderNumber")
  const isSubmitting =
    contactMutation.isPending || form.formState.isSubmitting

  async function onSubmit(values: SupportInquiryValues) {
    try {
      const result = await contactMutation.mutateAsync(values)
      toast.success(result.message || t("success"))
      form.reset()
    } catch (error) {
      const message =
        getApiErrorMessages(error, {
          network: tCommon("network"),
          timeout: tCommon("timeout"),
          unknown: t("submitError"),
        })[0] ?? t("submitError")

      toast.error(message)
    }
  }

  const variants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: EASE,
      },
    },
  }

  return (
    <motion.section
      className="mx-auto max-w-4xl pb-12 md:pb-16"
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      <div className="mx-auto max-w-xl text-center">
        {formTitleHtml ? (
          <h2
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl [&_strong]:font-bold [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: formTitleHtml }}
          />
        ) : (
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formTitle}
          </h2>
        )}
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {formDescription}
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 rounded-3xl border border-primary/10 bg-primary/10 p-5 sm:p-8 md:p-10"
        noValidate
      >
        <FieldGroup className="gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel
                    htmlFor="fullName"
                    className="text-primary"
                  >
                    {t("fields.fullName.label")}
                    <span className="text-accent">*</span>
                  </FieldLabel>
                  <InputGroup className={pillInputGroupClassName}>
                    <InputGroupAddon
                      align="inline-start"
                      className={pillAddonStartClassName}
                    >
                      <CustomIcon
                        src="/icons/user.svg"
                        size={16}
                        className="size-4 text-muted-foreground"
                      />
                    </InputGroupAddon >
                    <InputGroupInput
                      {...field}
                      id="fullName"
                      value={field.value ?? ""}
                      placeholder={t("fields.fullName.placeholder")}
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
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="phone" className="text-primary">
                    {t("fields.phone.label")}
                    <span className="text-accent">*</span>
                  </FieldLabel>
                  <InputGroup
                    className={pillInputGroupClassName}
                    dir="ltr"
                  >
                    <InputGroupAddon
                      align="inline-start"
                      className={pillAddonStartClassName}
                    >
                      <InputGroupText className="gap-2 font-semibold text-foreground ">
                      <div className="flex items-center gap-2 bg-footer rounded-full px-2 py-1 ">

                        <ReactCountryFlag
                          countryCode="SA"
                          svg
                          style={{
                            width: "1rem",
                            height: ".75rem",
                            borderRadius: "2px",
                          }}
                          aria-hidden="true"
                        />
                        <span className="text-xs">{SAUDI_COUNTRY_CODE}</span>
                      </div>
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      value={field.value ?? ""}
                      placeholder={t("fields.phone.placeholder")}
                      aria-invalid={fieldState.invalid}
                      className="pe-4"
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

          <Controller
            name="orderNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="orderNumber" className="text-primary">
                  {t("fields.orderNumber.label")}
                </FieldLabel>
                <InputGroup className={pillInputGroupClassName} dir="ltr">
                  <InputGroupAddon
                    align="inline-start"
                    className={pillAddonStartClassName}
                  >
                    <CustomIcon
                      src="/icons/file.svg"
                      size={18}
                      className="size-5 text-muted-foreground"
                    />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="orderNumber"
                    type="tel"
                    inputMode="numeric"
                    value={field.value ?? ""}
                    autoComplete="off"
                    placeholder={t("fields.orderNumber.placeholder")}
                    aria-invalid={fieldState.invalid}
                    className="pe-2 placeholder:text-muted-foreground"
                    onChange={(event) =>
                      field.onChange(keepDigitsOnlyInput(event.target.value))
                    }
                  />
                  <InputGroupAddon align="inline-end" className="pe-4">
                    <InputGroupButton
                      type="button"
                      size="icon-xs"
                      aria-label={t("fields.orderNumber.clear")}
                      disabled={!orderNumber}
                      className={cn(
                        "text-muted-foreground",
                        !orderNumber && "pointer-events-none opacity-40",
                      )}
                      onClick={() =>
                        form.setValue("orderNumber", "", {
                          shouldDirty: true,
                          shouldTouch: true,
                        })
                      }
                    >
                      <X className="size-3.5" />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )}
          />

          <Controller
            name="inquiryType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="inquiryType" className="text-primary">
                  {t("fields.inquiryType.label")}
                  <span className="text-accent">*</span>
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="inquiryType"
                    className="h-12! w-full rounded-full border-border/70 bg-white px-0 pe-3 shadow-none"
                    aria-invalid={fieldState.invalid}
                  >
                    <span className="flex min-w-0 flex-1 items-center">
                      <span className="flex h-full items-center border-e border-border/70 px-4">
                        <CustomIcon
                          src="/icons/flag.svg"
                          size={14}
                          className="size-3.5 text-muted-foreground"
                        />
                      </span>
                      <span className="min-w-0 flex-1 px-3 text-start">
                        <SelectValue
                          placeholder={t("fields.inquiryType.placeholder")}
                        />
                      </span>
                    </span>
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    className="w-(--radix-select-trigger-width)"
                    position="popper"
                  >
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
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
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="message" className="text-primary">
                  {t("fields.message.label")}
                  <span className="text-accent">*</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id="message"
                  rows={5}
                  value={field.value ?? ""}
                  placeholder={t("fields.message.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className="min-h-32 rounded-xl border-border/70 bg-white px-4 py-3 shadow-none"
                />
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 gap-2 rounded-full px-8 text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
                {t("submitting")}
              </>
            ) : (
              <>
                {t("submit")}
                <ArrowLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
              </>
            )}
          </Button>
          <p className="max-w-lg text-center text-xs text-muted-foreground sm:text-sm">
            {t("note")}
          </p>
        </div>
      </form>
    </motion.section>
  )
}
