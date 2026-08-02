import { differenceInMinutes, format } from "date-fns"
import { ar, enUS } from "date-fns/locale"

export function formatTrackOrderCompletedDate(date: Date, locale: string) {
  return format(date, locale === "ar" ? "EEEE، d MMMM yyyy" : "EEEE, d MMMM yyyy", {
    locale: locale === "ar" ? ar : enUS,
  })
}

export function formatTrackOrderCompletedTime(date: Date, locale: string) {
  return format(date, "h:mm a", {
    locale: locale === "ar" ? ar : enUS,
  })
}

export function formatTrackOrderRelativeMinutes(
  date: Date,
  now: Date,
  locale: string,
) {
  const minutes = Math.max(0, differenceInMinutes(now, date))

  if (locale === "ar") {
    return `منذ ${minutes}د`
  }

  return `${minutes}m ago`
}
