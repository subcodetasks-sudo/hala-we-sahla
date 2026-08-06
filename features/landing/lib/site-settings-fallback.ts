import type { SiteSettingsFallback } from "@/features/landing/services/settings"

export function buildSiteSettingsFallback(input: {
  description: string
}): SiteSettingsFallback {
  return {
    description: input.description,
    phone: "+96670006741",
    email: "info@halawasahla.com",
    logoSrc: "/logo.svg",
    logoFooterSrc: "/images/logo-mono.png",
    commercialRegister: "7000000001",
    taxNumber: "7000000006",
    taxAmount: 15,
    socialMedia: {
      snapchat: "#",
      instagram: "#",
      tiktok: "#",
      whatsapp: "https://wa.me/96670006741",
    },
  }
}
