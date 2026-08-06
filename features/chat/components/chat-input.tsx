"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { SendHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { useDirection } from "@/components/ui/direction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ChatInputProps = {
  onSend: (text: string) => void
  disabled?: boolean
  className?: string
}

export default function ChatInput({
  onSend,
  disabled,
  className,
}: ChatInputProps) {
  const t = useTranslations("Chat")
  const direction = useDirection()
  const [value, setValue] = useState("")

  function submit() {
    const next = value.trim()
    if (!next || disabled) return
    onSend(next)
    setValue("")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    submit()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2 px-4 pb-4 pt-1", className)}
    >
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("placeholder")}
        disabled={disabled}
        aria-label={t("placeholder")}
        className="h-11 flex-1 rounded-full border-accent/70 bg-white px-4 text-sm text-black placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent/20"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
        aria-label={t("sendLabel")}
        className="size-11 shrink-0 rounded-full bg-linear-to-br from-primary to-[#2A7E8F] text-white shadow-[0_6px_16px_rgba(69,152,172,0.35)] hover:from-primary/90 hover:to-[#2A7E8F]/90 disabled:opacity-50"
      >
        <SendHorizontal
          className={cn("size-4", direction === "rtl" && "rotate-180")}
          aria-hidden
        />
      </Button>
    </form>
  )
}
