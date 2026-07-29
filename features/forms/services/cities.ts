import { queryOptions } from "@tanstack/react-query"

import { formsKeys } from "@/features/forms/query-keys"
import { api } from "@/lib/api"

export type City = {
  id: number
  name_ar: string
  name_en: string
}

type CitiesApiResponse = {
  success: boolean
  message: string
  data: City[]
}

export function getCityLabel(city: City, locale: string) {
  return locale === "en" ? city.name_en : city.name_ar
}

export async function fetchCities(locale: string): Promise<City[]> {
  const response = await api.get<CitiesApiResponse>("/website/cities", {
    language: locale,
  })

  return response.data
}

export function citiesQueryOptions(locale: string) {
  return queryOptions({
    queryKey: formsKeys.citiesList(locale),
    queryFn: () => fetchCities(locale),
    staleTime: 1000 * 60 * 30,
  })
}
