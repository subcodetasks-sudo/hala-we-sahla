"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { citiesQueryOptions } from "@/features/forms/services/cities"

export function useCities(locale?: string) {
  const currentLocale = useLocale()
  const resolvedLocale = locale ?? currentLocale

  return useQuery(citiesQueryOptions(resolvedLocale))
}
