import { formsKeys } from "@/features/forms/query-keys"
import type { DocumentsStepValues } from "@/features/forms/schemas/documents-step"
import { api } from "@/lib/api"

export type EmployerStepPayload = {
  employer_name_ar: string
  employer_name_en: string
  national_id: string
  phone: string
  city_id: number
  passport_issue_place_id: number
}

export type WorkerStepPayload = {
  worker_name_ar: string
  worker_name_en: string
  worker_phone: string
  birth_date: string
  philippines_address: string
  worker_passport_issue_place_id: number
  passport_number: string
  passport_issue_date: string
  passport_expiry_date: string
}

export type DocumentsStepPayload = {
  national_id_image: File
  iqama_image: File
  passport_image: File
  exit_reentry_visa: File
  salary: string
  worker_signature: File
  employer_signature: File
}

export type RenewalRequestStepResult = {
  id: number
  current_step: number
  status?: string
  status_label?: string
  is_submitted?: boolean
}

export type RenewalSubmitResult = {
  id: number
  request_number: string
  current_step: number
  status: string
  status_label: string
  is_submitted: boolean
  submitted_at?: string
  expected_completion_date?: string
}

type RenewalRequestStepApiResponse = {
  success: boolean
  message: string
  data: RenewalRequestStepResult
}

type RenewalSubmitApiResponse = {
  success: boolean
  message: string
  data: RenewalSubmitResult
}

function toDocumentsStepPayload(
  values: DocumentsStepValues,
): DocumentsStepPayload {
  if (
    !(values.national_id_image instanceof File) ||
    !(values.iqama_image instanceof File) ||
    !(values.passport_image instanceof File) ||
    !(values.exit_reentry_visa instanceof File) ||
    !(values.worker_signature instanceof File) ||
    !(values.employer_signature instanceof File)
  ) {
    throw new Error("Documents step is missing required files")
  }

  return {
    national_id_image: values.national_id_image,
    iqama_image: values.iqama_image,
    passport_image: values.passport_image,
    exit_reentry_visa: values.exit_reentry_visa,
    salary: values.salary,
    worker_signature: values.worker_signature,
    employer_signature: values.employer_signature,
  }
}

function buildDocumentsFormData(payload: DocumentsStepPayload) {
  const formData = new FormData()

  formData.append("national_id_image", payload.national_id_image)
  formData.append("iqama_image", payload.iqama_image)
  formData.append("passport_image", payload.passport_image)
  formData.append("exit_reentry_visa", payload.exit_reentry_visa)
  formData.append("salary", payload.salary)
  formData.append("worker_signature", payload.worker_signature)
  formData.append("employer_signature", payload.employer_signature)

  return formData
}

export async function submitEmployerStep(
  locale: string,
  payload: EmployerStepPayload,
): Promise<RenewalRequestStepResult> {
  const response = await api.post<RenewalRequestStepApiResponse>(
    "/website/renewal-requests/step-1",
    {
      language: locale,
      body: payload,
    },
  )

  return response.data
}

export async function submitWorkerStep(
  locale: string,
  requestId: number,
  payload: WorkerStepPayload,
): Promise<RenewalRequestStepResult> {
  const response = await api.post<RenewalRequestStepApiResponse>(
    `/website/renewal-requests/${requestId}/step-2`,
    {
      language: locale,
      body: payload,
    },
  )

  return response.data
}

export async function submitDocumentsStep(
  locale: string,
  requestId: number,
  values: DocumentsStepValues,
): Promise<RenewalRequestStepResult> {
  const payload = toDocumentsStepPayload(values)
  const response = await api.post<RenewalRequestStepApiResponse>(
    `/website/renewal-requests/${requestId}/step-3`,
    {
      language: locale,
      body: buildDocumentsFormData(payload),
    },
  )

  return response.data
}

export async function submitRenewalRequest(
  locale: string,
  requestId: number,
): Promise<RenewalSubmitResult> {
  const response = await api.post<RenewalSubmitApiResponse>(
    `/website/renewal-requests/${requestId}/submit`,
    {
      language: locale,
    },
  )

  return response.data
}

export function submitEmployerStepMutationOptions(locale: string) {
  return {
    mutationKey: formsKeys.renewalRequestStep(1),
    mutationFn: (payload: EmployerStepPayload) =>
      submitEmployerStep(locale, payload),
  }
}

export function submitWorkerStepMutationOptions(locale: string) {
  return {
    mutationKey: formsKeys.renewalRequestStep(2),
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: number
      payload: WorkerStepPayload
    }) => submitWorkerStep(locale, requestId, payload),
  }
}

export function submitDocumentsStepMutationOptions(locale: string) {
  return {
    mutationKey: formsKeys.renewalRequestStep(3),
    mutationFn: ({
      requestId,
      values,
    }: {
      requestId: number
      values: DocumentsStepValues
    }) => submitDocumentsStep(locale, requestId, values),
  }
}

export function submitRenewalRequestMutationOptions(locale: string) {
  return {
    mutationKey: formsKeys.renewalRequestSubmit(),
    mutationFn: (requestId: number) => submitRenewalRequest(locale, requestId),
  }
}
