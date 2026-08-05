export const formsKeys = {
  all: ["forms"] as const,
  cities: () => [...formsKeys.all, "cities"] as const,
  citiesList: (locale: string) =>
    [...formsKeys.cities(), "list", locale] as const,
  passportIssuePlaces: () =>
    [...formsKeys.all, "passport-issue-places"] as const,
  passportIssuePlacesList: (locale: string, country: string) =>
    [...formsKeys.passportIssuePlaces(), "list", locale, country] as const,
  renewalRequests: () => [...formsKeys.all, "renewal-requests"] as const,
  renewalRequestStep: (step: number) =>
    [...formsKeys.renewalRequests(), "step", step] as const,
  renewalRequestReview: (requestId: number, locale: string) =>
    [...formsKeys.renewalRequests(), "review", requestId, locale] as const,
  renewalRequestSignatures: () =>
    [...formsKeys.renewalRequests(), "signatures"] as const,
  renewalRequestSubmit: () =>
    [...formsKeys.renewalRequests(), "submit"] as const,
  trackOrder: () => [...formsKeys.all, "track-order"] as const,
  trackOrderDetail: (requestNumber: string, phone: string, locale: string) =>
    [...formsKeys.trackOrder(), "detail", requestNumber, phone, locale] as const,
  forgotRequestSendOtp: () =>
    [...formsKeys.all, "forgot-request", "send-otp"] as const,
  forgotRequestVerifyOtp: () =>
    [...formsKeys.all, "forgot-request", "verify-otp"] as const,
  cancelStatuses: () => [...formsKeys.all, "cancel-statuses"] as const,
  cancelStatusesList: (locale: string) =>
    [...formsKeys.cancelStatuses(), "list", locale] as const,
  cancelRequest: () => [...formsKeys.all, "cancel-request"] as const,
}
