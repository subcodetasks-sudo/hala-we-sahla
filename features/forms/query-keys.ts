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
  renewalRequestSubmit: () =>
    [...formsKeys.renewalRequests(), "submit"] as const,
}
