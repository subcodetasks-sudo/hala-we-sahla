"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { formsKeys } from "@/features/forms/query-keys"
import { sendForgotRequestOtp } from "@/features/forms/services/forgot-request"

export function useSendForgotRequestOtp() {
  const locale = useLocale()

  return useMutation({
    mutationKey: formsKeys.forgotRequestSendOtp(),
    mutationFn: (phone: string) => sendForgotRequestOtp(locale, phone),
  })
}
