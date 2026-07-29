import { queryOptions } from "@tanstack/react-query"

import { formsKeys } from "@/features/forms/query-keys"
import { api } from "@/lib/api"

export type NamedEntity = {
  id: number
  name_ar: string
  name_en: string
}

export type RenewalReviewEmployer = {
  employer_name_ar: string
  employer_name_en: string
  national_id: string
  phone: string
  city_id: number
  city: NamedEntity | null
  passport_issue_place_id: number | null
  passport_issue_place: NamedEntity | null
}

export type RenewalReviewWorker = {
  worker_name_ar: string
  worker_name_en: string
  worker_phone: string
  birth_date: string
  philippines_address: string
  passport_number: string
  passport_issue_date: string
  passport_expiry_date: string
  worker_passport_issue_place_id?: number | null
  worker_passport_issue_place?: NamedEntity | null
  passport_issue_place_id?: number | null
  passport_issue_place?: NamedEntity | null
}

export type RenewalReviewDocuments = {
  national_id_image: string | null
  iqama_image: string | null
  passport_image: string | null
  exit_reentry_visa: string | null
  worker_signature: string | null
  employer_signature: string | null
  salary: string | null
}

export type RenewalReview = {
  id: number
  current_step: number
  status: string
  status_label: string
  is_submitted: boolean
  request_number: string | null
  employer: RenewalReviewEmployer
  worker: RenewalReviewWorker
  documents: RenewalReviewDocuments
}

type RenewalReviewApiResponse = {
  success: boolean
  message: string
  data: RenewalReview
}

export function formatBilingualLabel(
  nameAr?: string | null,
  nameEn?: string | null,
  empty = "—",
) {
  const arabic = nameAr?.trim()
  const english = nameEn?.trim()

  if (arabic && english) return `${arabic} / ${english}`
  return arabic || english || empty
}

export function formatNamedEntityLabel(
  entity?: Pick<NamedEntity, "name_ar" | "name_en"> | null,
  empty = "—",
) {
  if (!entity) return empty
  return formatBilingualLabel(entity.name_ar, entity.name_en, empty)
}

export async function fetchRenewalReview(
  locale: string,
  requestId: number,
): Promise<RenewalReview> {
  const response = await api.get<RenewalReviewApiResponse>(
    `/website/renewal-requests/${requestId}/review`,
    {
      language: locale,
    },
  )

  return response.data
}

export function renewalReviewQueryOptions(locale: string, requestId: number) {
  return queryOptions({
    queryKey: formsKeys.renewalRequestReview(requestId, locale),
    queryFn: () => fetchRenewalReview(locale, requestId),
    staleTime: 1000 * 30,
  })
}
