"use client"

import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { ArrowLeft, X } from "lucide-react"
import { useTranslations } from "next-intl"
import ReactCountryFlag from "react-country-flag"

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
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  keepRequestNumberInput,
  keepSaudiPhoneInput,
} from "@/features/forms/lib/input-filters"
import {
  createTrackOrderSchema,
  TRACK_ORDER_DEFAULT_VALUES,
  type TrackOrderValues,
} from "@/features/forms/schemas/track-order"
import { getTrackOrderPaymentStorageKey } from "@/features/forms/hooks/use-track-order-payment"
import { Link, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const SAUDI_COUNTRY_CODE = "+966"
const WHATSAPP_HREF = "https://wa.me/96670006741"
const TRACK_ORDER_STORAGE_KEY = "hala-track-order-remember"

const fieldShellClassName =
  "h-12 rounded-full border-border/70 bg-footer shadow-none"

const inputGroupClassName = cn(
  fieldShellClassName,
  "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
)

const addonStartClassName = "gap-0 border-e border-border/70 pe-3 ps-4"

function readRememberedValues(): TrackOrderValues | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(TRACK_ORDER_STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return null

    const data = parsed as Record<string, unknown>
    return {
      request_number:
        typeof data.request_number === "string" ? data.request_number : "",
      phone: typeof data.phone === "string" ? data.phone : "",
      remember_me: true,
    }
  } catch {
    return null
  }
}

function isRequestPaid(requestNumber: string) {
  if (typeof window === "undefined") return false

  const raw = window.sessionStorage.getItem(
    getTrackOrderPaymentStorageKey(requestNumber),
  )
  if (!raw) return false
  const parsed = Number(raw)
  return Number.isFinite(parsed)
}

function isRequestCancelled(requestNumber: string) {
  if (typeof window === "undefined") return false
  return (
    window.sessionStorage.getItem(
      `hala-track-order-cancelled:${requestNumber}`,
    ) != null
  )
}

function writeRememberedValues(values: TrackOrderValues) {
  if (typeof window === "undefined") return

  try {
    if (!values.remember_me) {
      window.localStorage.removeItem(TRACK_ORDER_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(
      TRACK_ORDER_STORAGE_KEY,
      JSON.stringify({
        request_number: values.request_number,
        phone: values.phone,
      }),
    )
  } catch {
    // Ignore storage failures (private mode / quota).
  }
}

export default function TrackOrderForm() {
  const t = useTranslations("Forms.trackOrders")
  const router = useRouter()
  const schema = useMemo(
    () =>
      createTrackOrderSchema({
        requestNumberRequired: t("errors.requestNumberRequired"),
        requestNumberInvalid: t("errors.requestNumberInvalid"),
        phoneInvalid: t("errors.phoneInvalid"),
      }),
    [t],
  )

  const form = useForm<TrackOrderValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: TRACK_ORDER_DEFAULT_VALUES,
    mode: "onChange",
  })

  const requestNumber = form.watch("request_number")

  useEffect(() => {
    const remembered = readRememberedValues()
    if (!remembered) return
    form.reset(remembered)
  }, [form])

  function onSubmit(values: TrackOrderValues) {
    writeRememberedValues(values)
    const encoded = encodeURIComponent(values.request_number)
    const isCompleted =
      isRequestPaid(values.request_number) &&
      !isRequestCancelled(values.request_number)

    router.push(
      isCompleted
        ? `/track-orders/${encoded}/completed`
        : `/track-orders/${encoded}`,
    )
  }

  return (
      <Card className="gap-0 rounded-[28px] max-w-lg mx-auto  bg-card  py-8 sm:rounded-[32px] sm:px-8 sm:py-10">
        <div className="flex flex-col items-center text-center">
            <CustomIcon
              src="/icons/receipt-search.svg"
              size={50}
              className="size-7 text-primary"
            />

          <h2 className="mt-10 text-xl font-bold text-primary sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground ">
            {t("description")}
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 p-6"
          noValidate
        >
          <FieldGroup className="gap-5">
            <Controller
              name="request_number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel
                    htmlFor="request_number"
                    className="text-primary"
                  >
                    {t("fields.requestNumber.label")}
                    <span className="text-accent">*</span>
                  </FieldLabel>
                  <InputGroup className={inputGroupClassName} dir="ltr">
                    <InputGroupAddon
                      align="inline-start"
                      className={addonStartClassName}
                    >
                      <CustomIcon
                        src="/icons/file.svg"
                        size={18}
                        className="size-4.5 text-muted-foreground"
                      />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="request_number"
                      value={field.value ?? ""}
                      autoComplete="off"
                      placeholder={t("fields.requestNumber.placeholder")}
                      aria-invalid={fieldState.invalid}
                      className="pe-2 font-clash"
                      onChange={(event) =>
                        field.onChange(
                          keepRequestNumberInput(event.target.value),
                        )
                      }
                    />
                    <InputGroupAddon align="inline-end" className="pe-3">
                      <InputGroupButton
                        type="button"
                        size="icon-xs"
                        aria-label={t("fields.requestNumber.clear")}
                        disabled={!requestNumber}
                        className={cn(
                          "text-muted-foreground",
                          !requestNumber && "pointer-events-none opacity-40",
                        )}
                        onClick={() =>
                          form.setValue("request_number", "", {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
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
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="track_phone" className="text-primary">
                    {t("fields.phone.label")}
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
                          <span className="text-xs font-clash">{SAUDI_COUNTRY_CODE}</span>
                        </span>
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="track_phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      value={field.value ?? ""}
                      placeholder={t("fields.phone.placeholder")}
                      aria-invalid={fieldState.invalid}
                      className="pe-4 font-clash"
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

            <div className="flex items-center justify-between gap-3 mt-4">
              <Controller
                name="remember_me"
                control={form.control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      aria-label={t("rememberMe")}
                    />
                    <span>{t("rememberMe")}</span>
                  </label>
                )}
              />

              <Link
                href="/track-orders/forgot"
                className="text-sm font-semibold text-accent transition-opacity hover:opacity-80"
              >
                {t("forgotRequestNumber")}
              </Link>
            </div>

            <Button
              type="submit"
              className="mt-1 mx-auto h-12 w-fit justify-between gap-3 rounded-full px-6 text-base font-bold text-white sm:px-8"
            >
              <CustomIcon
                src="/icons/search.svg"
                size={18}
                className="size-4.5 shrink-0 text-white"
              />
              <span>{t("submit")}</span>
              <ArrowLeft
                className="size-4 shrink-0 ltr:rotate-180"
                aria-hidden="true"
              />
            </Button>
          </FieldGroup>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("help.prefix")}{" "}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-custom-green transition-opacity hover:opacity-80"
          >
            {t("help.link")}
          </a>
        </p>
      </Card>
  )
}
