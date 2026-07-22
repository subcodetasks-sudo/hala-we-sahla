import { z } from "zod"

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

export function createSupportInquirySchema(messages: SupportInquiryMessages) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: messages.fullNameRequired }),
    phone: z
      .string()
      .trim()
      .regex(/^05\d{8}$/, { message: messages.phoneInvalid }),
    orderNumber: z.string().trim(),
    inquiryType: z.enum(INQUIRY_TYPE_KEYS, {
      error: () => messages.inquiryTypeRequired,
    }),
    message: z
      .string()
      .trim()
      .min(10, { message: messages.messageRequired }),
  })
}

export type SupportInquiryValues = z.infer<
  ReturnType<typeof createSupportInquirySchema>
>
