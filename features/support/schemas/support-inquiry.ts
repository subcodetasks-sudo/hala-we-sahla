import { z } from "zod"

import { DIGITS_ONLY_PATTERN, SAUDI_PHONE_PATTERN } from "@/features/forms/lib/input-filters"

export const INQUIRY_TYPE_KEYS = [
  "orderStatus",
  "payment",
  "documents",
  "technical",
  "other",
] as const

export type InquiryType = (typeof INQUIRY_TYPE_KEYS)[number]

type SupportInquiryMessages = {
  fullNameRequired: string
  phoneInvalid: string
  inquiryTypeRequired: string
  messageRequired: string
}

export function createSupportInquirySchema(
  messages: SupportInquiryMessages,
  inquiryTypeIds: string[],
) {
  const inquiryTypeSchema =
    inquiryTypeIds.length > 0
      ? z.enum(inquiryTypeIds as [string, ...string[]], {
          error: () => messages.inquiryTypeRequired,
        })
      : z.string().min(1, { message: messages.inquiryTypeRequired })

  return z.object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: messages.fullNameRequired }),
    phone: z
      .string()
      .trim()
      .regex(SAUDI_PHONE_PATTERN, { message: messages.phoneInvalid }),
    orderNumber: z
      .string()
      .trim()
      .refine((value) => value === "" || DIGITS_ONLY_PATTERN.test(value)),
    inquiryType: inquiryTypeSchema,
    message: z
      .string()
      .trim()
      .min(10, { message: messages.messageRequired }),
  })
}

export type SupportInquiryValues = z.infer<
  ReturnType<typeof createSupportInquirySchema>
>
