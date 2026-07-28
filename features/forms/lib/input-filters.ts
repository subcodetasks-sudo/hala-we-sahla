export function keepArabicNameInput(value: string) {
  return value.replace(/[^\u0600-\u06FF\s]/g, "")
}

export function keepEnglishNameInput(value: string) {
  return value.replace(/[^A-Za-z\s.'&-]/g, "")
}

const WESTERN_TO_ARABIC_DIGITS: Record<string, string> = {
  "0": "٠",
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
}

export function keepArabicPassportInput(value: string) {
  return value
    .replace(/[0-9]/g, (digit) => WESTERN_TO_ARABIC_DIGITS[digit] ?? digit)
    .replace(/[^\u0600-\u06FF\u0660-\u0669\s]/g, "")
}

export function keepSaudiPhoneInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 10)
}

export function keepNationalIdInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 10)
}

export function keepPassportNumberInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 20)
}

/** Digits only, optional single decimal point (e.g. salary amounts). */
export function keepDecimalInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "")
  const dotIndex = cleaned.indexOf(".")
  if (dotIndex === -1) return cleaned

  const whole = cleaned.slice(0, dotIndex) || "0"
  const fraction = cleaned
    .slice(dotIndex + 1)
    .replace(/\./g, "")
    .slice(0, 2)

  if (cleaned.endsWith(".") && fraction.length === 0) {
    return `${whole}.`
  }

  return fraction.length > 0 ? `${whole}.${fraction}` : whole
}

export const ARABIC_NAME_PATTERN = /^[\u0600-\u06FF\s]+$/
export const ENGLISH_NAME_PATTERN = /^[A-Za-z\s.'&-]+$/
export const ARABIC_PASSPORT_PATTERN = /^[\u0600-\u06FF\u0660-\u0669\s]+$/
export const PASSPORT_NUMBER_PATTERN = /^\d{5,20}$/
export const HIJRI_DATE_PATTERN =
  /^(0[1-9]|[12]\d|3[01]) (0[1-9]|1[0-2]) \d{4}$/
export const GREGORIAN_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
export const SAUDI_PHONE_PATTERN = /^05\d{8}$/
export const NATIONAL_ID_PATTERN = /^[12]\d{9}$/
export const DECIMAL_AMOUNT_PATTERN = /^\d+(\.\d{0,2})?$/
