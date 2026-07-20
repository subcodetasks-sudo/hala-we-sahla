"use client"

import { useLocale, useTranslations } from "next-intl"
import { useFaqs } from "@/features/landing/hooks/use-faqs"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqList() {
    const locale = useLocale()
    const t = useTranslations("Faq")
    const { data, isLoading, isError } = useFaqs(locale)

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">{t("loading")}</p>
    }

    if (isError || !data) {
        return <p className="text-sm text-destructive">{t("error")}</p>
    }

    return (
        <Accordion
            type="single"
            collapsible
            className="rounded-2xl bg-card px-4 sm:px-6"
        >
            {data.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-base font-medium">
                        {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
