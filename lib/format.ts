const INTL_LOCALES: Record<string, string> = {
    ar: "ar-SA",
    en: "en-US",
}

function toIntlLocale(locale: string) {
    return INTL_LOCALES[locale] ?? locale
}

export function formatNumber(
    value: number,
    locale: string,
    options?: Intl.NumberFormatOptions,
) {
    return new Intl.NumberFormat(toIntlLocale(locale), options).format(value)
}

export function formatCurrency(amount: number, currency: string, locale: string) {
    return new Intl.NumberFormat(toIntlLocale(locale), {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount)
}
