import { z } from "zod"

type TrackOrderCancelMessages = {
  reasonRequired: string
  otherRequired: string
}

type TrackOrderCancelSchemaOptions = {
  getOtherReasonIds: () => number[]
}

export function createTrackOrderCancelSchema(
  messages: TrackOrderCancelMessages,
  options: TrackOrderCancelSchemaOptions,
) {
  return z
    .object({
      cancel_status_id: z
        .string()
        .trim()
        .min(1, { message: messages.reasonRequired }),
      other_reason: z.string().optional(),
      notes: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      const isOther = options
        .getOtherReasonIds()
        .includes(Number(values.cancel_status_id))

      if (isOther && !values.other_reason?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["other_reason"],
          message: messages.otherRequired,
        })
      }
    })
}

export type TrackOrderCancelValues = z.infer<
  ReturnType<typeof createTrackOrderCancelSchema>
>

export const TRACK_ORDER_CANCEL_DEFAULT_VALUES: TrackOrderCancelValues = {
  cancel_status_id: "",
  other_reason: "",
  notes: "",
}
