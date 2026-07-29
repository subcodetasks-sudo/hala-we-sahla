"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { passportIssuePlacesQueryOptions } from "@/features/forms/services/passport-issue-places"

export function usePassportIssuePlaces(country: string, locale?: string) {
  const currentLocale = useLocale()
  const resolvedLocale = locale ?? currentLocale

  return useQuery(passportIssuePlacesQueryOptions(resolvedLocale, country))
}
