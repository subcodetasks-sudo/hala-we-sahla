"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, useReducedMotion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"

import ChatHeader from "@/features/chat/components/chat-header"
import ChatInput from "@/features/chat/components/chat-input"
import ChatMessages from "@/features/chat/components/chat-messages"
import type { ChatFaqSuggestion, ChatMessage } from "@/features/chat/types"
import {
  faqQueryOptions,
  getFallbackFaqs,
} from "@/features/landing/services/faq"
import { cn } from "@/lib/utils"

type ChatPanelProps = {
  logoSrc: string
  logoAlt?: string
  onClose: () => void
  className?: string
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function buildWelcomeMessages(lines: string[]): ChatMessage[] {
  const now = Date.now()
  return lines.map((content, index) => ({
    id: `welcome-${index}`,
    role: "assistant" as const,
    content,
    createdAt: new Date(now + index * 1000),
  }))
}

const FAQ_PAGE_SIZE = 3

function toFaqSuggestions(
  items: Array<{ id: string; question: string; answer: string }>,
): ChatFaqSuggestion[] {
  return items.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer.replace(/<[^>]*>/g, "").trim(),
  }))
}

export default function ChatPanel({
  logoSrc,
  logoAlt = "",
  onClose,
  className,
}: ChatPanelProps) {
  const t = useTranslations("Chat")
  const locale = useLocale()
  const shouldReduceMotion = useReducedMotion()
  const titleId = "chat-panel-title"

  const faqsQuery = useQuery({
    ...faqQueryOptions(locale),
    placeholderData: getFallbackFaqs(locale),
  })

  const allFaqs = toFaqSuggestions(faqsQuery.data ?? getFallbackFaqs(locale))

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    buildWelcomeMessages([
      t("messages.welcome1"),
      t("messages.welcome2"),
      t("messages.welcome3"),
    ]),
  )
  const [answeredFaqIds, setAnsweredFaqIds] = useState<string[]>([])
  const [faqPage, setFaqPage] = useState(0)

  const pageFaqs = allFaqs.slice(
    faqPage * FAQ_PAGE_SIZE,
    faqPage * FAQ_PAGE_SIZE + FAQ_PAGE_SIZE,
  )
  const faqSuggestions = pageFaqs.filter(
    (faq) => !answeredFaqIds.includes(faq.id),
  )

  function resetConversation() {
    setMessages(
      buildWelcomeMessages([
        t("messages.welcome1"),
        t("messages.welcome2"),
        t("messages.welcome3"),
      ]),
    )
    setAnsweredFaqIds([])
    setFaqPage(0)
  }

  function appendAssistantReply(content: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "assistant",
        content,
        createdAt: new Date(),
      },
    ])
  }

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "user",
        content: text,
        createdAt: new Date(),
      },
    ])

    window.setTimeout(() => {
      appendAssistantReply(t("messages.fallbackReply"))
    }, 450)
  }

  function handleFaqSelect(faq: ChatFaqSuggestion) {
    const nextAnswered = answeredFaqIds.includes(faq.id)
      ? answeredFaqIds
      : [...answeredFaqIds, faq.id]

    setAnsweredFaqIds(nextAnswered)

    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "user",
        content: faq.question,
        createdAt: new Date(),
      },
    ])

    window.setTimeout(() => {
      appendAssistantReply(faq.answer)

      const pageDone = pageFaqs.every((item) =>
        nextAnswered.includes(item.id),
      )
      const hasNextPage =
        (faqPage + 1) * FAQ_PAGE_SIZE < allFaqs.length

      if (pageDone && hasNextPage) {
        setFaqPage((page) => page + 1)
      }
    }, 350)
  }

  return (
    <motion.section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        shouldReduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.96 }
      }
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className={cn(
        "flex h-[min(36rem,calc(100dvh-5.5rem))] w-[min(100vw-2rem,22.5rem)] flex-col overflow-hidden rounded-3xl border border-border/70 bg-white shadow-[0_16px_48px_rgba(0,49,67,0.16)]",
        className,
      )}
    >
      <h2 id={titleId} className="sr-only">
        {t("title")}
      </h2>
      <ChatHeader
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        onClose={onClose}
        onReset={resetConversation}
      />
      <ChatMessages
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        messages={messages}
        faqSuggestions={faqSuggestions}
        onFaqSelect={handleFaqSelect}
      />
      <ChatInput onSend={handleSend} />
    </motion.section>
  )
}
