"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocale } from "next-intl"
import { toast } from "sonner"

import { formsKeys } from "@/features/forms/query-keys"
import {
  cancelStatusQueryOptions,
  cancelTrackOrderRequest,
  type CancelRequestPayload,
} from "@/features/forms/services/cancel-status"

export function useCancelStatuses(locale?: string) {
  const currentLocale = useLocale()
  const resolvedLocale = locale ?? currentLocale

  return useQuery(cancelStatusQueryOptions(resolvedLocale))
}

export function useCancelRequest(locale?: string) {
  const currentLocale = useLocale()
  const resolvedLocale = locale ?? currentLocale
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: formsKeys.cancelRequest(),
    mutationFn: (payload: CancelRequestPayload) =>
      cancelTrackOrderRequest(resolvedLocale, payload),
    onSuccess: (result, variables) => {
      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)

      queryClient.setQueryData(
        formsKeys.trackOrderDetail(
          variables.request_number,
          variables.phone,
          resolvedLocale,
        ),
        result.data,
      )
      queryClient.invalidateQueries({
        queryKey: formsKeys.trackOrder(),
      })
    },
  })
}
