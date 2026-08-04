"use client"

import { useState } from "react"
import { CircleAlert, Trash2, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

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
import { useTrackOrderCancellation } from "@/features/forms/hooks/use-track-order-cancellation"
import { useTrackOrderTimeline } from "@/features/forms/hooks/use-track-order-timeline"
import {
  isTrackOrderCancellable,
  TRACK_ORDER_CURRENT_STAGE_INDEX,
} from "@/features/forms/lib/track-order-stages"
import { cn } from "@/lib/utils"

const CANCEL_RED = "#FF0A0E"

const CANCEL_REASON_KEYS = [
  "changedMind",
  "wrongData",
  "duplicate",
  "other",
] as const

type CancelReasonKey = (typeof CANCEL_REASON_KEYS)[number]

type TrackOrderCancelActionProps = {
  requestNumber?: string
  className?: string
}

export default function TrackOrderCancelAction({
  requestNumber,
  className,
}: TrackOrderCancelActionProps) {
  const t = useTranslations("Forms.trackOrders.detail.cancel")
  const timeline = useTrackOrderTimeline(
    TRACK_ORDER_CURRENT_STAGE_INDEX,
    requestNumber
      ? `hala-track-order-stages-started-at:${requestNumber}`
      : undefined,
  )
  const { isCancelled, cancelRequest } = useTrackOrderCancellation(requestNumber)
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<CancelReasonKey | "">("")
  const [otherReason, setOtherReason] = useState("")
  const [notes, setNotes] = useState("")
  const [reasonError, setReasonError] = useState<string | null>(null)
  const [otherReasonError, setOtherReasonError] = useState<string | null>(null)

  if (!isTrackOrderCancellable(timeline.currentStageIndex, isCancelled)) {
    return null
  }

  function resetForm() {
    setReason("")
    setOtherReason("")
    setNotes("")
    setReasonError(null)
    setOtherReasonError(null)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) resetForm()
  }

  function handleConfirm() {
    if (!reason) {
      setReasonError(t("reason.required"))
      return
    }

    if (reason === "other" && !otherReason.trim()) {
      setOtherReasonError(t("reason.other.required"))
      return
    }

    cancelRequest()
    toast.success(t("success"))
    handleOpenChange(false)
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
                className="absolute inset-e-4 top-1/2 size-7 -translate-y-1/2 rounded-lg bg-background text-[#5b7380] hover:bg-background/80 hover:text-[#5b7380]"
              >
                <X className="size-4" />
                <span className="sr-only">{t("back")}</span>
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="mx-auto h-px w-[90%] shrink-0 bg-border" />

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 scrollbar-hide sm:px-6">
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
              <Field data-invalid={reasonError ? true : undefined}>
                <FieldLabel className="font-semibold text-black">
                  {t("reason.label")}
                  <span style={{ color: CANCEL_RED }}>*</span>
                </FieldLabel>
                <Select
                  value={reason || undefined}
                  onValueChange={(value) => {
                    const nextReason = value as CancelReasonKey
                    setReason(nextReason)
                    setReasonError(null)
                    if (nextReason !== "other") {
                      setOtherReason("")
                      setOtherReasonError(null)
                    }
                  }}
                >
                  <SelectTrigger className="h-12! w-full rounded-full border-[#d7e0e3] bg-custom-gray px-4 shadow-none">
                    <SelectValue placeholder={t("reason.placeholder")} />
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    className="w-(--radix-select-trigger-width)"
                    position="popper"
                  >
                    {CANCEL_REASON_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {t(`reason.options.${key}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {reasonError ? <FieldError>{reasonError}</FieldError> : null}
              </Field>

              {reason === "other" ? (
                <Field data-invalid={otherReasonError ? true : undefined}>
                  <FieldLabel className="font-semibold text-black">
                    {t("reason.other.label")}
                    <span style={{ color: CANCEL_RED }}>*</span>
                  </FieldLabel>
                  <Input
                    value={otherReason}
                    onChange={(event) => {
                      setOtherReason(event.target.value)
                      setOtherReasonError(null)
                    }}
                    placeholder={t("reason.other.placeholder")}
                    className="h-12 rounded-full border-[#d7e0e3] bg-custom-gray px-4 shadow-none"
                  />
                  {otherReasonError ? (
                    <FieldError>{otherReasonError}</FieldError>
                  ) : null}
                </Field>
              ) : null}

              <Field>
                <FieldLabel className="font-semibold text-black">
                  {t("notes.label")}
                </FieldLabel>
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  placeholder={t("notes.placeholder")}
                  className="min-h-28 rounded-xl border-[#d7e0e3] bg-custom-gray px-4 py-3 shadow-none"
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleConfirm}
                className="h-12 w-full rounded-full text-sm font-bold text-white hover:opacity-90"
                style={{ backgroundColor: CANCEL_RED }}
              >
                {t("confirm")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleOpenChange(false)}
                className="h-12 w-full rounded-full bg-custom-gray text-sm font-semibold text-[#5b7380] hover:bg-[#eceff1]"
              >
                {t("back")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
