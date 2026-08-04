"use client"

import { useMemo, useRef, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { CircleAlert, Loader2, Trash2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  useCancelRequest,
  useCancelStatuses,
} from "@/features/forms/hooks/use-cancel-status"
import { useTrackOrderCancellation } from "@/features/forms/hooks/use-track-order-cancellation"
import { isTrackOrderCancellable } from "@/features/forms/lib/track-order-stages"
import {
  readTrackOrderSession,
  saveTrackOrderSession,
} from "@/features/forms/lib/track-order-session"
import {
  createTrackOrderCancelSchema,
  TRACK_ORDER_CANCEL_DEFAULT_VALUES,
  type TrackOrderCancelValues,
} from "@/features/forms/schemas/track-order-cancel"
import {
  getCancelStatusLabel,
  isOtherCancelStatus,
} from "@/features/forms/services/cancel-status"
import { getApiErrorMessages } from "@/lib/api"
import { cn } from "@/lib/utils"

const CANCEL_RED = "#FF0A0E"

type TrackOrderCancelActionProps = {
  requestNumber?: string
  currentStageIndex?: number
  className?: string
}

export default function TrackOrderCancelAction({
  requestNumber,
  currentStageIndex = 0,
  className,
}: TrackOrderCancelActionProps) {
  const t = useTranslations("Forms.trackOrders.detail.cancel")
  const tCommon = useTranslations("Common.errors")
  const locale = useLocale()
  const { isCancelled, cancelRequest: markCancelledLocally } =
    useTrackOrderCancellation(requestNumber)
  const cancelMutation = useCancelRequest()
  const { data: cancelStatuses = [], isLoading: isLoadingStatuses } =
    useCancelStatuses()
  const [open, setOpen] = useState(false)

  const otherReasonIds = useMemo(
    () =>
      cancelStatuses
        .filter((status) => isOtherCancelStatus(status))
        .map((status) => status.id),
    [cancelStatuses],
  )
  const otherReasonIdsRef = useRef(otherReasonIds)
  otherReasonIdsRef.current = otherReasonIds

  const schema = useMemo(
    () =>
      createTrackOrderCancelSchema(
        {
          reasonRequired: t("reason.required"),
          otherRequired: t("reason.other.required"),
        },
        {
          getOtherReasonIds: () => otherReasonIdsRef.current,
        },
      ),
    [t],
  )

  const form = useForm<TrackOrderCancelValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: TRACK_ORDER_CANCEL_DEFAULT_VALUES,
    mode: "onChange",
  })

  const reasonId = useWatch({
    control: form.control,
    name: "cancel_status_id",
  })

  const isOtherReason = otherReasonIds.includes(Number(reasonId))
  const isSubmitting =
    cancelMutation.isPending || form.formState.isSubmitting

  if (!requestNumber || !isTrackOrderCancellable(currentStageIndex, isCancelled)) {
    return null
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) return
    setOpen(nextOpen)
    if (!nextOpen) {
      form.reset(TRACK_ORDER_CANCEL_DEFAULT_VALUES)
      form.clearErrors()
    }
  }

  async function onSubmit(values: TrackOrderCancelValues) {
    if (!requestNumber) return

    const session = readTrackOrderSession(requestNumber)
    if (!session?.phone) {
      form.setError("root", { message: t("errors.sessionMissing") })
      return
    }

    const notesParts = [
      isOtherReason ? values.other_reason?.trim() : "",
      values.notes?.trim(),
    ].filter(Boolean)

    try {
      const result = await cancelMutation.mutateAsync({
        request_number: requestNumber,
        phone: session.phone,
        cancel_status_id: Number(values.cancel_status_id),
        cancellation_notes:
          notesParts.length > 0 ? notesParts.join(" — ") : undefined,
      })

      saveTrackOrderSession({
        request_number: result.data.request_number || requestNumber,
        phone: session.phone,
        data: result.data,
        fetchedAt: Date.now(),
      })

      markCancelledLocally(result.data.cancelled_at || Date.now())
      handleOpenChange(false)
    } catch (error) {
      const message =
        getApiErrorMessages(error, {
          network: tCommon("network"),
          timeout: tCommon("timeout"),
          unknown: t("errors.cancelFailed"),
        })[0] ?? t("errors.cancelFailed")
      form.setError("root", { message })
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4",
        className,
      )}
    >
      <p className="flex max-w-md items-start gap-2 text-xs font-semibold text-black sm:items-center sm:text-sm">
        <CircleAlert
          className="mt-0.5 size-4 shrink-0 text-black sm:mt-0"
          aria-hidden="true"
        />
        <span>{t("hint")}</span>
      </p>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setOpen(true)}
          className="h-11 gap-2 rounded-full bg-white px-4 text-sm font-semibold hover:bg-[#fff1f1]"
          style={{ color: CANCEL_RED }}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          {t("action")}
        </Button>

        <DialogContent
          showCloseButton={false}
          className="flex max-h-[90vh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-3xl border-0 bg-white p-0 ring-1 ring-black/5 sm:max-w-md"
        >
          <DialogHeader className="relative shrink-0 gap-0 px-5 py-6 sm:px-6">
            <DialogTitle className="pe-12 text-start text-base font-semibold text-[#4b626d]">
              {t("dialogTitle")}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={isSubmitting}
                className="absolute inset-e-4 top-1/2 size-7 -translate-y-1/2 rounded-lg bg-background text-[#5b7380] hover:bg-background/80 hover:text-[#5b7380]"
              >
                <X className="size-4" />
                <span className="sr-only">{t("back")}</span>
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="mx-auto h-px w-[90%] shrink-0 bg-border" />

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-h-0 flex-1 overflow-y-auto px-5 py-6 scrollbar-hide sm:px-6"
            noValidate
          >
            <div className="flex flex-col items-center text-center">
              <span
                className="flex size-18 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "color-mix(in srgb, #FF0A0E 10%, white)",
                }}
              >
                <CustomIcon
                  src="/icons/trach.svg"
                  size={40}
                  className="text-[#FF0A0E]"
                />
              </span>

              <DialogDescription asChild>
                <div className="mt-5 space-y-2">
                  <p className="text-lg font-bold text-black sm:text-xl md:text-3xl">
                    {t.rich("confirmTitle", {
                      highlight: (chunks) => (
                        <span
                          className="font-bold"
                          style={{ color: CANCEL_RED }}
                        >
                          {chunks}
                        </span>
                      ),
                    })}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t("confirmDescription")}
                  </p>
                </div>
              </DialogDescription>
            </div>

            <div className="mt-6 space-y-4">
              <Controller
                name="cancel_status_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel className="font-semibold text-black">
                      {t("reason.label")}
                      <span style={{ color: CANCEL_RED }}>*</span>
                    </FieldLabel>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.clearErrors()
                        if (!otherReasonIds.includes(Number(value))) {
                          form.setValue("other_reason", "")
                        }
                      }}
                      disabled={isLoadingStatuses || isSubmitting}
                    >
                      <SelectTrigger className="h-12! w-full rounded-full border-[#d7e0e3] bg-custom-gray px-4 shadow-none">
                        <SelectValue placeholder={t("reason.placeholder")} />
                      </SelectTrigger>
                      <SelectContent
                        align="start"
                        className="w-(--radix-select-trigger-width)"
                        position="popper"
                      >
                        {cancelStatuses.map((status) => (
                          <SelectItem key={status.id} value={String(status.id)}>
                            {getCancelStatusLabel(status, locale)}
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

              {isOtherReason ? (
                <Controller
                  name="other_reason"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel className="font-semibold text-black">
                        {t("reason.other.label")}
                        <span style={{ color: CANCEL_RED }}>*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder={t("reason.other.placeholder")}
                        disabled={isSubmitting}
                        className="h-12 rounded-full border-[#d7e0e3] bg-custom-gray px-4 shadow-none"
                      />
                      {fieldState.error ? (
                        <FieldError>{fieldState.error.message}</FieldError>
                      ) : null}
                    </Field>
                  )}
                />
              ) : null}

              <Controller
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="font-semibold text-black">
                      {t("notes.label")}
                    </FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={4}
                      placeholder={t("notes.placeholder")}
                      disabled={isSubmitting}
                      className="min-h-28 rounded-xl border-[#d7e0e3] bg-custom-gray px-4 py-3 shadow-none"
                    />
                  </Field>
                )}
              />

              {form.formState.errors.root?.message ? (
                <FieldError>{form.formState.errors.root.message}</FieldError>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full gap-2 rounded-full text-sm font-bold text-white hover:opacity-90"
                style={{ backgroundColor: CANCEL_RED }}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {t("confirm")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
                className="h-12 w-full rounded-full bg-custom-gray text-sm font-semibold text-[#5b7380] hover:bg-[#eceff1]"
              >
                {t("back")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
