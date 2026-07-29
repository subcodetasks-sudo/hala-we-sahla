export function parseGregorianDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return undefined
  }

  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined
  }

  return date
}

export function compareGregorianDateValues(a: string, b: string) {
  const dateA = parseGregorianDateValue(a)
  const dateB = parseGregorianDateValue(b)
  if (!dateA || !dateB) return undefined
  return dateA.getTime() - dateB.getTime()
}

export function isAtLeastGregorianAge(
  birthDateValue: string,
  minAge: number,
  today: Date = new Date(),
) {
  const birthDate = parseGregorianDateValue(birthDateValue)
  if (!birthDate) return false

  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const todayDay = today.getDate()

  let age = todayYear - birthDate.getUTCFullYear()
  if (
    todayMonth < birthDate.getUTCMonth() ||
    (todayMonth === birthDate.getUTCMonth() &&
      todayDay < birthDate.getUTCDate())
  ) {
    age -= 1
  }

  return age >= minAge
}

/** Latest calendar date that still meets `years` of age (same month/day as today). */
export function getDateYearsBeforeToday(
  years: number,
  today: Date = new Date(),
) {
  return new Date(
    today.getFullYear() - years,
    today.getMonth(),
    today.getDate(),
  )
}
