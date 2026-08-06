"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { FaqItem } from "@/features/landing/services/faq"

type FaqListProps = {
  items?: FaqItem[]
}

export default function FaqList({ items = [] }: FaqListProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-border/70"
        >
          <AccordionTrigger className="gap-4 py-5 text-start text-base font-medium text-foreground hover:no-underline sm:text-[17px]">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
