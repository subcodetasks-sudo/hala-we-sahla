"use client"

import { useQuery } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import {
  resolveWhatsappHref,
  settingsQueryOptions,
} from "@/features/landing/services/settings"

export function useWhatsappHref() {
  const locale = useLocale()
  const settingsQuery = useQuery(settingsQueryOptions(locale))

  return resolveWhatsappHref(settingsQuery.data?.social_media)
}
