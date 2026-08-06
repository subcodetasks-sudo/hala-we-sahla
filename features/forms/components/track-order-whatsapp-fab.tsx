"use client"

import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { useWhatsappHref } from "@/features/landing/hooks/use-whatsapp-href"

export default function TrackOrderWhatsappFab() {
  const t = useTranslations("Forms.trackOrders")
  const whatsappHref = useWhatsappHref()

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappFab")}
      className="fixed  bottom-6 inset-s-6 z-50 md:flex hidden size-14 items-center justify-center rounded-full bg-custom-green text-white shadow-[0_8px_24px_rgba(42,126,143,0.35)] transition-transform hover:scale-105 hover:bg-custom-green/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:bottom-8 sm:inset-e-8 sm:size-16"
    >
      <CustomIcon
        src="/icons/whatsapp.svg"
        size={28}
        className="size-7 text-white sm:size-8"
      />
    </a>
  )
}
