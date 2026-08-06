import { cache } from "react"
import { queryOptions } from "@tanstack/react-query"

import { settingsKeys } from "@/features/landing/query-keys"
import { api } from "@/lib/api"

export type SocialMediaKey =
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "snapchat"
  | "whatsapp"

export type SocialMediaApi = Partial<Record<SocialMediaKey, string>>

export type SettingsApiData = {
  description: string
  phone: string
  email: string
  social_media: SocialMediaApi
  logo: string
  commercial_register: string
  tax_number: string
  tax_amount: number
}

type SettingsApiResponse = {
  success: boolean
  message: string
  data: SettingsApiData
}

export type SocialLinkView = {
  key: SocialMediaKey
  href: string
  iconSrc: string | null
}

export type SiteSettingsView = {
  description: string
  phone: string
  phoneDisplay: string
  phoneHref: string
  email: string
  emailHref: string
  logoSrc: string
  logoFooterSrc: string
  logoIsRemote: boolean
  commercialRegister: string
  taxNumber: string
  taxAmount: number
  socialLinks: SocialLinkView[]
  whatsappHref: string
  source: "api" | "fallback"
}

export type SiteSettingsFallback = {
  description: string
  phone: string
  email: string
  logoSrc: string
  logoFooterSrc: string
  commercialRegister: string
  taxNumber: string
  taxAmount: number
  socialMedia: SocialMediaApi
}

const SOCIAL_DISPLAY_ORDER: SocialMediaKey[] = [
  "snapchat",
  "instagram",
  "tiktok",
  "whatsapp",
  "twitter",
  "facebook",
  "linkedin",
  "youtube",
]

const SOCIAL_ICONS: Partial<Record<SocialMediaKey, string>> = {
  twitter: "/icons/x.svg",
  instagram: "/icons/instagram.svg",
  linkedin: "/icons/linkedin.svg",
  tiktok: "/icons/tiktok.svg",
  snapchat: "/icons/snapchat.svg",
  whatsapp: "/icons/whatsapp.svg",
  facebook: "/icons/facebook.svg",
  youtube: "/icons/youtube.svg",
}

export const DEFAULT_WHATSAPP_HREF = "https://wa.me/96670006741"

export function resolveWhatsappHref(
  socialMedia: SocialMediaApi | undefined,
  fallback = DEFAULT_WHATSAPP_HREF,
) {
  return socialMedia?.whatsapp?.trim() || fallback
}

export function buildSiteIcons(logoSrc: string) {
  return {
    icon: logoSrc,
    shortcut: logoSrc,
    apple: logoSrc,
  }
}

export function isRemoteAsset(src: string) {
  return /^https?:\/\//i.test(src.trim())
}

export function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "")

  if (digits.startsWith("966") && digits.length === 12) {
    const local = digits.slice(3)
    return `+966 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`
  }

  if (digits.startsWith("966") && digits.length === 11) {
    const local = digits.slice(3)
    return `+966 ${local.slice(0, 4)} ${local.slice(4)}`
  }

  return phone.trim()
}

export function toTelHref(phone: string) {
  const digits = phone.replace(/\D/g, "")
  return digits ? `tel:+${digits.startsWith("966") ? digits : `966${digits.replace(/^0/, "")}`}` : "tel:"
}

export function toMailtoHref(email: string) {
  return `mailto:${email.trim()}`
}

function buildSocialLinks(socialMedia: SocialMediaApi | undefined) {
  return SOCIAL_DISPLAY_ORDER.flatMap((key) => {
    const href = socialMedia?.[key]?.trim()

    if (!href || href === "#") {
      return []
    }

    return [
      {
        key,
        href,
        iconSrc: SOCIAL_ICONS[key] ?? null,
      } satisfies SocialLinkView,
    ]
  })
}

function mapSettings(
  data: SettingsApiData,
  fallback: SiteSettingsFallback,
  source: "api" | "fallback",
): SiteSettingsView {
  const phone = data.phone?.trim() || fallback.phone
  const email = data.email?.trim() || fallback.email
  const logo = data.logo?.trim() || fallback.logoSrc
  const socialMedia = data.social_media ?? fallback.socialMedia

  return {
    description: data.description?.trim() || fallback.description,
    phone,
    phoneDisplay: formatPhoneDisplay(phone),
    phoneHref: toTelHref(phone),
    email,
    emailHref: toMailtoHref(email),
    logoSrc: logo,
    logoFooterSrc: logo || fallback.logoFooterSrc,
    logoIsRemote: isRemoteAsset(logo),
    commercialRegister:
      data.commercial_register?.trim() || fallback.commercialRegister,
    taxNumber: data.tax_number?.trim() || fallback.taxNumber,
    taxAmount: Number(data.tax_amount) || fallback.taxAmount,
    socialLinks: buildSocialLinks(socialMedia),
    whatsappHref: resolveWhatsappHref(
      socialMedia,
      fallback.socialMedia.whatsapp?.trim() || DEFAULT_WHATSAPP_HREF,
    ),
    source,
  }
}

export async function fetchSettings(locale: string) {
  const response = await api.get<SettingsApiResponse>("/website/settings", {
    language: locale,
  })

  return response.data
}

export function settingsQueryOptions(locale: string) {
  return queryOptions({
    queryKey: settingsKeys.list(locale),
    queryFn: () => fetchSettings(locale),
    staleTime: 5 * 60 * 1000,
  })
}

export const getSiteSettings = cache(
  async (locale: string, fallback: SiteSettingsFallback): Promise<SiteSettingsView> => {
    try {
      const data = await fetchSettings(locale)

      if (!data?.phone?.trim() && !data?.email?.trim()) {
        throw new Error("Settings payload is empty")
      }

      return mapSettings(data, fallback, "api")
    } catch {
      return mapSettings(
        {
          description: fallback.description,
          phone: fallback.phone,
          email: fallback.email,
          social_media: fallback.socialMedia,
          logo: fallback.logoSrc,
          commercial_register: fallback.commercialRegister,
          tax_number: fallback.taxNumber,
          tax_amount: fallback.taxAmount,
        },
        fallback,
        "fallback",
      )
    }
  },
)
