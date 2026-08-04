"use client"

import { useMutation } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import { formsKeys } from "@/features/forms/query-keys"
import {
  verifyForgotRequestOtp,
  type ForgotRequestVerifyOtpPayload,
} from "@/features/forms/services/forgot-request"

export function useVerifyForgotRequestOtp() {
  const locale = useLocale()

  return useMutation({
    mutationKey: formsKeys.forgotRequestVerifyOtp(),
    mutationFn: (payload: ForgotRequestVerifyOtpPayload) =>
      verifyForgotRequestOtp(locale, payload),
  })
}
