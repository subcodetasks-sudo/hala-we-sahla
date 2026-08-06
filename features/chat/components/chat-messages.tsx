"use client"

import { useLocale, useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import type { ChatFaqSuggestion, ChatMessage } from "@/features/chat/types"
import { cn } from "@/lib/utils"

type ChatMessagesProps = {
  logoSrc: string
  logoAlt?: string
  messages: ChatMessage[]
  faqSuggestions?: ChatFaqSuggestion[]
  onFaqSelect?: (faq: ChatFaqSuggestion) => void
  className?: string
}

function formatTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

export default function ChatMessages({
  logoSrc,
  logoAlt = "",
  messages,
  faqSuggestions = [],
  onFaqSelect,
  className,
}: ChatMessagesProps) {
  const t = useTranslations("Chat")
  const locale = useLocale()

  return (
    <MessageScrollerProvider>
      <MessageScroller className={cn("min-h-0 flex-1", className)}>
        <MessageScrollerViewport className="px-4 py-4">
          <MessageScrollerContent className="gap-4">
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant"
              const prev = messages[index - 1]
              const showAvatar =
                isAssistant && (!prev || prev.role !== "assistant")
              const next = messages[index + 1]
              const isLastInGroup = !next || next.role !== message.role

              return (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === "user"}
                >
                  <Message align={isAssistant ? "start" : "end"}>
                    {isAssistant ? (
                      <MessageAvatar
                        className={cn(
                          "bg-transparent",
                          !showAvatar && "invisible",
                        )}
                      >
                        <Avatar size="sm" className="size-8 bg-white">
                          <AvatarImage
                            src={logoSrc}
                            alt={logoAlt}
                            className="object-contain p-1"
                          />
                          <AvatarFallback className="bg-white text-primary">
                            ه
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                    ) : null}

                    <MessageContent className="gap-1">
                      <Bubble
                        variant={isAssistant ? "muted" : "default"}
                        align={isAssistant ? "start" : "end"}
                        className={cn(
                          "max-w-[85%]",
                          isAssistant &&
                            "*:data-[slot=bubble-content]:bg-[#F3F5F7] *:data-[slot=bubble-content]:text-black",
                          !isAssistant &&
                            "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground",
                        )}
                      >
                        <BubbleContent className="rounded-2xl px-3.5 py-2.5 text-[0.8125rem] leading-relaxed">
                          {message.content}
                        </BubbleContent>
                      </Bubble>
                      {isLastInGroup ? (
                        <MessageFooter className="px-1 pt-0.5 text-[0.6875rem] font-normal text-muted-foreground">
                          {formatTime(message.createdAt, locale)}
                        </MessageFooter>
                      ) : null}
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )
            })}

            {faqSuggestions.length > 0 ? (
              <MessageScrollerItem messageId="faq-suggestions">
                <div className="flex flex-col items-stretch gap-2 ps-10">
                  <p className="px-1 text-xs font-medium text-muted-foreground">
                    {t("keywordsTitle")}
                  </p>
                  {faqSuggestions.map((faq) => (
                    <Bubble
                      key={faq.id}
                      variant="outline"
                      align="start"
                      className="max-w-full *:data-[slot=bubble-content]:border-primary/30 *:data-[slot=bubble-content]:bg-white *:data-[slot=bubble-content]:text-black"
                    >
                      <BubbleContent
                        asChild
                        className="w-full cursor-pointer rounded-2xl px-3.5 py-2.5 text-start text-[0.8125rem] leading-relaxed hover:bg-primary/5"
                      >
                        <button type="button" onClick={() => onFaqSelect?.(faq)}>
                          {faq.question}
                        </button>
                      </BubbleContent>
                    </Bubble>
                  ))}
                </div>
              </MessageScrollerItem>
            ) : null}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton aria-label={t("scrollToLatest")} />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
