import { z } from "zod"

import { SAUDI_PHONE_PATTERN } from "@/features/forms/lib/input-filters"

type ForgotRequestNumberMessages = {
  phoneInvalid: string
}

export function createForgotRequestNumberSchema(
  messages: ForgotRequestNumberMessages,
) {
  return z.object({
    phone: z
      .string()
      .trim()
      .regex(SAUDI_PHONE_PATTERN, { message: messages.phoneInvalid }),
  })
}

export type ForgotRequestNumberValues = z.infer<
  ReturnType<typeof createForgotRequestNumberSchema>
>

export const FORGOT_REQUEST_NUMBER_DEFAULT_VALUES: ForgotRequestNumberValues = {
  phone: "",
}
