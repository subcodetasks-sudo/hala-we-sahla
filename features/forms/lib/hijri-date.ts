import { getDateLib } from "react-day-picker/hijri"

const hijriDateLib = getDateLib({ numerals: "latn" })

export type HijriDateParts = {
  year: number
  month: number
  day: number
}

export function formatHijriDateValue(date: Date) {
  const day = hijriDateLib.format(date, "dd")
  const month = hijriDateLib.format(date, "MM")
  const year = hijriDateLib.format(date, "yyyy")
  return `${day} ${month} ${year}`
}

export function parseHijriDateValue(value: string) {
  const match = /^(\d{2}) (\d{2}) (\d{4})$/.exec(value.trim())
  if (!match) return undefined

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  if (
    !Number.isFinite(day) ||
    !Number.isFinite(month) ||
    !Number.isFinite(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 30
  ) {
    return undefined
  }

  return hijriDateLib.newDate(year, month - 1, day)
}

export function getHijriDateParts(date: Date): HijriDateParts {
  return {
    year: Number(hijriDateLib.format(date, "yyyy")),
    month: Number(hijriDateLib.format(date, "MM")),
    day: Number(hijriDateLib.format(date, "dd")),
  }
}

/** Compare two Hijri calendar dates by year, then month, then day. */
export function compareHijriDateParts(a: HijriDateParts, b: HijriDateParts) {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  return a.day - b.day
}

export function compareHijriDateValues(a: string, b: string) {
  const dateA = parseHijriDateValue(a)
  const dateB = parseHijriDateValue(b)
  if (!dateA || !dateB) return undefined
  return compareHijriDateParts(getHijriDateParts(dateA), getHijriDateParts(dateB))
}

/** True when birth date is at least `minAge` full Hijri years before today. */
export function isAtLeastHijriAge(
  birthDateValue: string,
  minAge: number,
  today: Date = new Date(),
) {
  const birthDate = parseHijriDateValue(birthDateValue)
  if (!birthDate) return false

  const birth = getHijriDateParts(birthDate)
  const now = getHijriDateParts(today)

  let age = now.year - birth.year
  if (
    now.month < birth.month ||
    (now.month === birth.month && now.day < birth.day)
  ) {
    age -= 1
  }

  return age >= minAge
}
