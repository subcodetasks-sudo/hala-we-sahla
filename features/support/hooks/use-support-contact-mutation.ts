"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import type { SupportInquiryValues } from "@/features/support/schemas/support-inquiry"
import { submitSupportContact } from "@/features/support/services/support"

export function useSupportContactMutation() {
  const locale = useLocale()

  return useMutation({
    mutationKey: ["support", "contact", locale],
    mutationFn: (values: SupportInquiryValues) =>
      submitSupportContact(locale, values),
  })
}
