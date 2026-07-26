import { z } from "zod"

import {
  ARABIC_NAME_PATTERN,
  ENGLISH_NAME_PATTERN,
  SAUDI_PHONE_PATTERN,
  keepArabicNameInput,
  keepEnglishNameInput,
} from "@/features/forms/lib/input-filters"

export { keepArabicNameInput, keepEnglishNameInput }

type EmployerStepMessages = {
  employerNameArRequired: string
  employerNameArInvalid: string
  employerNameEnRequired: string
  employerNameEnInvalid: string
  nationalIdInvalid: string
  phoneInvalid: string
  cityRequired: string
}

export function createEmployerStepSchema(messages: EmployerStepMessages) {
  return z.object({
    employer_name_ar: z
      .string()
      .trim()
      .min(2, { message: messages.employerNameArRequired })
      .regex(ARABIC_NAME_PATTERN, {
        message: messages.employerNameArInvalid,
      }),
    employer_name_en: z
      .string()
      .trim()
      .min(2, { message: messages.employerNameEnRequired })
      .regex(ENGLISH_NAME_PATTERN, {
        message: messages.employerNameEnInvalid,
      }),
    national_id: z
      .string()
      .trim()
      .regex(/^[12]\d{9}$/, { message: messages.nationalIdInvalid }),
    phone: z
      .string()
      .trim()
      .regex(SAUDI_PHONE_PATTERN, { message: messages.phoneInvalid }),
    city_id: z.string().min(1, { message: messages.cityRequired }),
    passport_issue_place_id: z.string(),
  })
}

export type EmployerStepValues = z.infer<
  ReturnType<typeof createEmployerStepSchema>
>

export const EMPLOYER_DEFAULT_VALUES: EmployerStepValues = {
  employer_name_ar: "",
  employer_name_en: "",
  national_id: "",
  phone: "",
  city_id: "",
  passport_issue_place_id: "",
}
