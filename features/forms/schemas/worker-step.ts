import { z } from "zod"

import {
  ARABIC_NAME_PATTERN,
  ARABIC_PASSPORT_PATTERN,
  ENGLISH_NAME_PATTERN,
  HIJRI_DATE_PATTERN,
  SAUDI_PHONE_PATTERN,
} from "@/features/forms/lib/input-filters"

type WorkerStepMessages = {
  workerNameArRequired: string
  workerNameArInvalid: string
  workerNameEnRequired: string
  workerNameEnInvalid: string
  workerPhoneInvalid: string
  birthDateRequired: string
  birthDateInvalid: string
  philippinesAddressRequired: string
  passportIssuePlaceRequired: string
  passportNumberRequired: string
  passportNumberInvalid: string
  passportIssueDateRequired: string
  passportIssueDateInvalid: string
  passportExpiryDateRequired: string
  passportExpiryDateInvalid: string
}

export function createWorkerStepSchema(messages: WorkerStepMessages) {
  return z.object({
    worker_name_ar: z
      .string()
      .trim()
      .min(2, { message: messages.workerNameArRequired })
      .regex(ARABIC_NAME_PATTERN, { message: messages.workerNameArInvalid }),
    worker_name_en: z
      .string()
      .trim()
      .min(2, { message: messages.workerNameEnRequired })
      .regex(ENGLISH_NAME_PATTERN, { message: messages.workerNameEnInvalid }),
    worker_phone: z
      .string()
      .trim()
      .regex(SAUDI_PHONE_PATTERN, { message: messages.workerPhoneInvalid }),
    birth_date: z
      .string()
      .min(1, { message: messages.birthDateRequired })
      .regex(HIJRI_DATE_PATTERN, { message: messages.birthDateInvalid }),
    philippines_address: z
      .string()
      .trim()
      .min(3, { message: messages.philippinesAddressRequired }),
    passport_issue_place_id: z
      .string()
      .min(1, { message: messages.passportIssuePlaceRequired }),
    passport_number: z
      .string()
      .trim()
      .min(5, { message: messages.passportNumberRequired })
      .regex(ARABIC_PASSPORT_PATTERN, {
        message: messages.passportNumberInvalid,
      }),
    passport_issue_date: z
      .string()
      .min(1, { message: messages.passportIssueDateRequired })
      .regex(HIJRI_DATE_PATTERN, { message: messages.passportIssueDateInvalid }),
    passport_expiry_date: z
      .string()
      .min(1, { message: messages.passportExpiryDateRequired })
      .regex(HIJRI_DATE_PATTERN, {
        message: messages.passportExpiryDateInvalid,
      }),
  })
}

export type WorkerStepValues = z.infer<
  ReturnType<typeof createWorkerStepSchema>
>

export const WORKER_DEFAULT_VALUES: WorkerStepValues = {
  worker_name_ar: "",
  worker_name_en: "",
  worker_phone: "",
  birth_date: "",
  philippines_address: "",
  passport_issue_place_id: "",
  passport_number: "",
  passport_issue_date: "",
  passport_expiry_date: "",
}
