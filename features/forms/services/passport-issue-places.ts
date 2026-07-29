import { queryOptions } from "@tanstack/react-query"

import { formsKeys } from "@/features/forms/query-keys"
import { api } from "@/lib/api"

export type PassportIssuePlace = {
  id: number
  name_ar: string
  name_en: string
  country: string
}

export const EMPLOYER_PASSPORT_ISSUE_COUNTRY = "sa"
export const WORKER_PASSPORT_ISSUE_COUNTRY = "ph"

type PassportIssuePlacesApiResponse = {
  success: boolean
  message: string
  data: PassportIssuePlace[]
}

export function getPassportIssuePlaceLabel(
  place: PassportIssuePlace,
  locale: string,
) {
  return locale === "en" ? place.name_en : place.name_ar
}

export async function fetchPassportIssuePlaces(
  locale: string,
  country: string,
): Promise<PassportIssuePlace[]> {
  const response = await api.get<PassportIssuePlacesApiResponse>(
    "/website/passport-issue-places",
    {
      language: locale,
      query: { country },
    },
  )

  return response.data
}

export function passportIssuePlacesQueryOptions(
  locale: string,
  country: string,
) {
  return queryOptions({
    queryKey: formsKeys.passportIssuePlacesList(locale, country),
    queryFn: () => fetchPassportIssuePlaces(locale, country),
    staleTime: 1000 * 60 * 30,
  })
}
