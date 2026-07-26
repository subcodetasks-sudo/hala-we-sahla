import { z } from "zod"

const ACCEPTED_MIME_TYPES = ["image/png", "application/pdf", "image/jpeg"]

type DocumentsStepMessages = {
  nationalIdImageRequired: string
  iqamaImageRequired: string
  passportImageRequired: string
  exitReentryVisaRequired: string
  fileTypeInvalid: string
  salaryRequired: string
  salaryInvalid: string
}

function createFileSchema(requiredMessage: string, typeInvalidMessage: string) {
  return z
    .union([z.instanceof(File), z.null()])
    .refine((value): value is File => value instanceof File, {
      message: requiredMessage,
    })
    .refine((file) => ACCEPTED_MIME_TYPES.includes(file.type), {
      message: typeInvalidMessage,
    })
}

export function createDocumentsStepSchema(messages: DocumentsStepMessages) {
  return z.object({
    national_id_image: createFileSchema(
      messages.nationalIdImageRequired,
      messages.fileTypeInvalid,
    ),
    iqama_image: createFileSchema(
      messages.iqamaImageRequired,
      messages.fileTypeInvalid,
    ),
    passport_image: createFileSchema(
      messages.passportImageRequired,
      messages.fileTypeInvalid,
    ),
    exit_reentry_visa: createFileSchema(
      messages.exitReentryVisaRequired,
      messages.fileTypeInvalid,
    ),
    salary: z
      .string()
      .trim()
      .min(1, { message: messages.salaryRequired })
      .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
        message: messages.salaryInvalid,
      }),
  })
}

export type DocumentsStepValues = {
  national_id_image: File | null
  iqama_image: File | null
  passport_image: File | null
  exit_reentry_visa: File | null
  salary: string
}

export const DOCUMENTS_DEFAULT_VALUES: DocumentsStepValues = {
  national_id_image: null,
  iqama_image: null,
  passport_image: null,
  exit_reentry_visa: null,
  salary: "0.00",
}
