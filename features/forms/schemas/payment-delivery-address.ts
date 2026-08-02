import { z } from "zod"

import { SAUDI_PHONE_PATTERN } from "@/features/forms/lib/input-filters"

type PaymentDeliveryAddressMessages = {
  homeAddressRequired: string
  nationalAddressRequired: string
  buildingNumberRequired: string
  floorRequired: string
  nameRequired: string
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
      .min(1, { message: messages.nationalAddressRequired }),
    buildingNumber: z
      .string()
      .trim()
      .min(1, { message: messages.buildingNumberRequired }),
    floor: z.string().trim().min(1, { message: messages.floorRequired }),
    description: z.string().trim(),
    name: z.string().trim().min(1, { message: messages.nameRequired }),
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
