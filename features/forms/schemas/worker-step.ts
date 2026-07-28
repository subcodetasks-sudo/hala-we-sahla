import { z } from "zod"

import {
  compareHijriDateValues,
  isAtLeastHijriAge,
} from "@/features/forms/lib/hijri-date"
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
  birthDateMinAge: string
  philippinesAddressRequired: string
  passportIssuePlaceRequired: string
  passportNumberRequired: string
  passportNumberInvalid: string
  passportIssueDateRequired: string
  passportIssueDateInvalid: string
  passportIssueDateAfterBirth: string
  passportExpiryDateRequired: string
  passportExpiryDateInvalid: string
  passportExpiryDateAfterIssue: string
}

const MIN_WORKER_AGE = 18

export function createWorkerStepSchema(messages: WorkerStepMessages) {
  return z
    .object({
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
        .regex(HIJRI_DATE_PATTERN, {
          message: messages.passportIssueDateInvalid,
        }),
      passport_expiry_date: z
        .string()
        .min(1, { message: messages.passportExpiryDateRequired })
        .regex(HIJRI_DATE_PATTERN, {
          message: messages.passportExpiryDateInvalid,
        }),
    })
    .superRefine((values, ctx) => {
      if (
        HIJRI_DATE_PATTERN.test(values.birth_date) &&
        !isAtLeastHijriAge(values.birth_date, MIN_WORKER_AGE)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["birth_date"],
          message: messages.birthDateMinAge,
        })
      }

      if (
        HIJRI_DATE_PATTERN.test(values.birth_date) &&
        HIJRI_DATE_PATTERN.test(values.passport_issue_date)
      ) {
        const issueVsBirth = compareHijriDateValues(
          values.passport_issue_date,
          values.birth_date,
        )
        if (issueVsBirth !== undefined && issueVsBirth <= 0) {
          ctx.addIssue({
            code: "custom",
            path: ["passport_issue_date"],
            message: messages.passportIssueDateAfterBirth,
          })
        }
      }

      if (
        HIJRI_DATE_PATTERN.test(values.passport_issue_date) &&
        HIJRI_DATE_PATTERN.test(values.passport_expiry_date)
      ) {
        const expiryVsIssue = compareHijriDateValues(
          values.passport_expiry_date,
          values.passport_issue_date,
        )
        if (expiryVsIssue !== undefined && expiryVsIssue <= 0) {
          ctx.addIssue({
            code: "custom",
            path: ["passport_expiry_date"],
            message: messages.passportExpiryDateAfterIssue,
          })
        }
      }
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
