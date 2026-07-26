import { getDateLib } from "react-day-picker/hijri"

const hijriDateLib = getDateLib({ numerals: "latn" })

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
