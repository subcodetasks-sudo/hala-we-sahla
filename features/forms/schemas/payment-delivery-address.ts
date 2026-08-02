import { z } from "zod"

import {
  DIGITS_ONLY_PATTERN,
  NAME_TEXT_PATTERN,
  SAUDI_PHONE_PATTERN,
} from "@/features/forms/lib/input-filters"

type PaymentDeliveryAddressMessages = {
  homeAddressRequired: string
  nationalAddressRequired: string
  nationalAddressInvalid: string
  buildingNumberRequired: string
  buildingNumberInvalid: string
  floorRequired: string
  floorInvalid: string
  nameRequired: string
  nameInvalid: string
  phoneInvalid: string
}

export function createPaymentDeliveryAddressSchema(
  messages: PaymentDeliveryAddressMessages,
) {
  return z.object({
    homeAddress: z
      .string()
      .trim()
      .min(1, { message: messages.homeAddressRequired }),
    nationalAddress: z
      .string()
      .trim()
      .min(1, { message: messages.nationalAddressRequired })
      .regex(DIGITS_ONLY_PATTERN, { message: messages.nationalAddressInvalid }),
    buildingNumber: z
      .string()
      .trim()
      .min(1, { message: messages.buildingNumberRequired })
      .regex(DIGITS_ONLY_PATTERN, { message: messages.buildingNumberInvalid }),
    floor: z
      .string()
      .trim()
      .min(1, { message: messages.floorRequired })
      .regex(DIGITS_ONLY_PATTERN, { message: messages.floorInvalid }),
    description: z.string().trim(),
    name: z
      .string()
      .trim()
      .min(1, { message: messages.nameRequired })
      .regex(NAME_TEXT_PATTERN, { message: messages.nameInvalid }),
    phone: z
      .string()
      .trim()
      .regex(SAUDI_PHONE_PATTERN, { message: messages.phoneInvalid }),
  })
}

export type PaymentDeliveryAddressValues = z.infer<
  ReturnType<typeof createPaymentDeliveryAddressSchema>
>

export const PAYMENT_DELIVERY_ADDRESS_DEFAULT_VALUES: PaymentDeliveryAddressValues =
  {
    homeAddress: "",
    nationalAddress: "",
    buildingNumber: "",
    floor: "",
    description: "",
    name: "",
    phone: "",
  }
