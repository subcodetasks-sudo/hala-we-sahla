import { z } from "zod"

import { SAUDI_PHONE_PATTERN } from "@/features/forms/lib/input-filters"

type TrackOrderMessages = {
  requestNumberRequired: string
  requestNumberInvalid: string
  phoneInvalid: string
}

export function createTrackOrderSchema(messages: TrackOrderMessages) {
  return z.object({
    request_number: z
      .string()
      .trim()
      .min(1, { message: messages.requestNumberRequired })
      .regex(/^[A-Za-z0-9-]{3,32}$/, {
        message: messages.requestNumberInvalid,
      }),
    phone: z
      .string()
      .trim()
      .regex(SAUDI_PHONE_PATTERN, { message: messages.phoneInvalid }),
    remember_me: z.boolean(),
  })
}

export type TrackOrderValues = z.infer<
  ReturnType<typeof createTrackOrderSchema>
>

export const TRACK_ORDER_DEFAULT_VALUES: TrackOrderValues = {
  request_number: "",
  phone: "",
  remember_me: false,
}
