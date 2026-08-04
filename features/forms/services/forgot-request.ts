import { toTrackOrderApiPhone } from "@/features/forms/services/track-order"
import { api } from "@/lib/api"

export type ForgotRequestSendOtpData = {
  phone: string
  expires_in: number
  otp?: string
}

type ForgotRequestSendOtpResponse = {
  success: boolean
  message: string
  data: ForgotRequestSendOtpData
}

export type ForgotRequestSendOtpResult = {
  message: string
  data: ForgotRequestSendOtpData
}

export type ForgotRequestListFilter = {
  value: string
  label: string
  count: number
}

export type ForgotRequestPrimaryAction = {
  type: string
  label: string
}

export type ForgotRequestItemActions = {
  can_copy_number: boolean
  copy_number_label: string
  primary: ForgotRequestPrimaryAction | null
}

export type ForgotRequestItem = {
  id: number
  request_number: string
  delivery_method: string
  delivery_method_label: string
  status: string
  status_label: string
  status_color: string
  worker_name: string
  avatar_initial: string
  description: string
  submitted_at: string | null
  submitted_date: string | null
  submitted_date_label: string
  actions: ForgotRequestItemActions
  final_contract_url: string | null
}

export type ForgotRequestVerifyOtpData = {
  lookup_token: string
  phone: string
  page: {
    title: string
    subtitle: string
  }
  filter: string
  search: string | null
  total: number
  total_label: string
  filters: ForgotRequestListFilter[]
  requests: ForgotRequestItem[]
}

type ForgotRequestVerifyOtpResponse = {
  success: boolean
  message: string
  data: ForgotRequestVerifyOtpData
}

export type ForgotRequestVerifyOtpResult = {
  message: string
  data: ForgotRequestVerifyOtpData
}

export type ForgotRequestVerifyOtpPayload = {
  phone: string
  otp: string
}

export async function sendForgotRequestOtp(
  locale: string,
  phone: string,
): Promise<ForgotRequestSendOtpResult> {
  const response = await api.post<ForgotRequestSendOtpResponse>(
    "/website/forgot-request/send-otp",
    {
      language: locale,
      body: {
        phone: toTrackOrderApiPhone(phone),
      },
    },
  )

  return {
    message: response.message,
    data: response.data,
  }
}

export async function verifyForgotRequestOtp(
  locale: string,
  payload: ForgotRequestVerifyOtpPayload,
): Promise<ForgotRequestVerifyOtpResult> {
  const response = await api.post<ForgotRequestVerifyOtpResponse>(
    "/website/forgot-request/verify-otp",
    {
      language: locale,
      body: {
        phone: toTrackOrderApiPhone(payload.phone),
        otp: payload.otp,
      },
    },
  )

  return {
    message: response.message,
    data: response.data,
  }
}
