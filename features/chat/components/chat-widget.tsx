"use client"

import { useState } from "react"
import { AnimatePresence } from "motion/react"

import ChatLauncher from "@/features/chat/components/chat-launcher"
import ChatPanel from "@/features/chat/components/chat-panel"
import { cn } from "@/lib/utils"

type ChatWidgetProps = {
  logoSrc: string
  logoAlt?: string
  className?: string
}

export default function ChatWidget({
  logoSrc,
  logoAlt = "",
  className,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        // end = bottom-left in RTL (ar), bottom-right in LTR (en)
        "pointer-events-none fixed bottom-5 end-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:end-6",
        className,
      )}
    >
      <div className="pointer-events-auto">
        <AnimatePresence mode="wait">
          {open ? (
            <ChatPanel
              key="panel"
              logoSrc={logoSrc}
              logoAlt={logoAlt}
              onClose={() => setOpen(false)}
            />
          ) : (
            <ChatLauncher
              key="launcher"
              logoSrc={logoSrc}
              logoAlt={logoAlt}
              onOpen={() => setOpen(true)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
