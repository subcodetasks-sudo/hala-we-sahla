import { z } from "zod"

import {
  compareGregorianDateValues,
  isAtLeastGregorianAge,
} from "@/features/forms/lib/gregorian-date"
import {
  ARABIC_NAME_PATTERN,
  GREGORIAN_DATE_PATTERN,
  ENGLISH_NAME_PATTERN,
  PASSPORT_NUMBER_PATTERN,
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
        .regex(GREGORIAN_DATE_PATTERN, { message: messages.birthDateInvalid }),
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
        .regex(PASSPORT_NUMBER_PATTERN, {
          message: messages.passportNumberInvalid,
        }),
      passport_issue_date: z
        .string()
        .min(1, { message: messages.passportIssueDateRequired })
        .regex(GREGORIAN_DATE_PATTERN, {
          message: messages.passportIssueDateInvalid,
        }),
      passport_expiry_date: z
        .string()
        .min(1, { message: messages.passportExpiryDateRequired })
        .regex(GREGORIAN_DATE_PATTERN, {
          message: messages.passportExpiryDateInvalid,
        }),
    })
    .superRefine((values, ctx) => {
      if (
        GREGORIAN_DATE_PATTERN.test(values.birth_date) &&
        !isAtLeastGregorianAge(values.birth_date, MIN_WORKER_AGE)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["birth_date"],
          message: messages.birthDateMinAge,
        })
      }

      if (
        GREGORIAN_DATE_PATTERN.test(values.birth_date) &&
        GREGORIAN_DATE_PATTERN.test(values.passport_issue_date)
      ) {
        const issueVsBirth = compareGregorianDateValues(
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
        GREGORIAN_DATE_PATTERN.test(values.passport_issue_date) &&
        GREGORIAN_DATE_PATTERN.test(values.passport_expiry_date)
      ) {
        const expiryVsIssue = compareGregorianDateValues(
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
