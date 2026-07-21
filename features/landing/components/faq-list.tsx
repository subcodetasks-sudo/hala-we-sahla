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
        <Accordion type="single" collapsible className="w-full">
            {data.map((item) => (
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
