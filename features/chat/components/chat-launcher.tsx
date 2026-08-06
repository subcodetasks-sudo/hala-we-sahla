"use client"

import { motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { cn } from "@/lib/utils"

type ChatLauncherProps = {
  logoSrc: string
  logoAlt?: string
  onOpen: () => void
  className?: string
}

export default function ChatLauncher({
  logoSrc,
  logoAlt = "",
  onOpen,
  className,
}: ChatLauncherProps) {
  const t = useTranslations("Chat")
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={t("openLabel")}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      className={cn(
        "group flex flex-col items-end gap-2 overflow-visible text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Bubble
        variant="outline"
        className="pointer-events-none relative mb-1 max-w-[min(100%,17.5rem)] overflow-visible shadow-[0_8px_28px_rgba(0,49,67,0.12)] *:data-[slot=bubble-content]:overflow-visible *:data-[slot=bubble-content]:border-transparent *:data-[slot=bubble-content]:bg-white *:data-[slot=bubble-content]:px-4 *:data-[slot=bubble-content]:py-3 *:data-[slot=bubble-content]:text-center *:data-[slot=bubble-content]:text-sm *:data-[slot=bubble-content]:font-medium *:data-[slot=bubble-content]:leading-relaxed *:data-[slot=bubble-content]:text-black *:data-[slot=bubble-content]:rounded-2xl"
      >
        <BubbleContent>{t("welcomeBubble")}</BubbleContent>
        <span
          aria-hidden
          className="absolute -bottom-1.5 end-6 size-3 rotate-45 rounded-sm bg-white shadow-[2px_2px_4px_rgba(0,49,67,0.06)]"
        />
      </Bubble>

      <span className="relative inline-flex size-14 shrink-0 sm:size-16">
        {!shouldReduceMotion ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.4], opacity: [0.65, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ) : null}
        <Avatar
          className="relative size-full border-2 border-primary bg-white shadow-[0_8px_24px_rgba(0,49,67,0.16)] transition-transform after:hidden group-hover:scale-[1.03] data-[size=default]:size-full"
        >
          <AvatarImage
            src={logoSrc}
            alt={logoAlt}
            className="object-contain p-1.5"
          />
          <AvatarFallback className="bg-white text-base text-primary">
            ه
          </AvatarFallback>
        </Avatar>
      </span>
    </motion.button>
  )
}
