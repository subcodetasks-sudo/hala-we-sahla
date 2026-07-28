import { z } from "zod"

import { DECIMAL_AMOUNT_PATTERN } from "@/features/forms/lib/input-filters"

const ACCEPTED_DOCUMENT_MIME_TYPES = [
  "image/png",
  "application/pdf",
  "image/jpeg",
]

const ACCEPTED_IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"]

type DocumentsStepMessages = {
  nationalIdImageRequired: string
  iqamaImageRequired: string
  passportImageRequired: string
  exitReentryVisaRequired: string
  fileTypeInvalid: string
  imageTypeInvalid: string
  employerSignatureRequired: string
  workerSignatureRequired: string
  salaryRequired: string
  salaryInvalid: string
}

function createFileSchema(
  requiredMessage: string,
  typeInvalidMessage: string,
  acceptedMimeTypes: string[],
) {
  return z
    .union([z.instanceof(File), z.null()])
    .refine((value): value is File => value instanceof File, {
      message: requiredMessage,
    })
    .refine(
      (value) =>
        !(value instanceof File) || acceptedMimeTypes.includes(value.type),
      { message: typeInvalidMessage },
    )
}

export function createDocumentsStepSchema(messages: DocumentsStepMessages) {
  return z.object({
    national_id_image: createFileSchema(
      messages.nationalIdImageRequired,
      messages.fileTypeInvalid,
      ACCEPTED_DOCUMENT_MIME_TYPES,
    ),
    iqama_image: createFileSchema(
      messages.iqamaImageRequired,
      messages.fileTypeInvalid,
      ACCEPTED_DOCUMENT_MIME_TYPES,
    ),
    passport_image: createFileSchema(
      messages.passportImageRequired,
      messages.fileTypeInvalid,
      ACCEPTED_DOCUMENT_MIME_TYPES,
    ),
    exit_reentry_visa: createFileSchema(
      messages.exitReentryVisaRequired,
      messages.fileTypeInvalid,
      ACCEPTED_DOCUMENT_MIME_TYPES,
    ),
    employer_signature: createFileSchema(
      messages.employerSignatureRequired,
      messages.imageTypeInvalid,
      ACCEPTED_IMAGE_MIME_TYPES,
    ),
    worker_signature: createFileSchema(
      messages.workerSignatureRequired,
      messages.imageTypeInvalid,
      ACCEPTED_IMAGE_MIME_TYPES,
    ),
    salary: z
      .string()
      .trim()
      .min(1, { message: messages.salaryRequired })
      .regex(DECIMAL_AMOUNT_PATTERN, { message: messages.salaryInvalid })
      .refine((value) => Number(value) >= 0, {
        message: messages.salaryInvalid,
      }),
  })
}

export type DocumentsStepValues = {
  national_id_image: File | null
  iqama_image: File | null
  passport_image: File | null
  exit_reentry_visa: File | null
  employer_signature: File | null
  worker_signature: File | null
  salary: string
}

export const DOCUMENTS_DEFAULT_VALUES: DocumentsStepValues = {
  national_id_image: null,
  iqama_image: null,
  passport_image: null,
  exit_reentry_visa: null,
  employer_signature: null,
  worker_signature: null,
  salary: "",
}
