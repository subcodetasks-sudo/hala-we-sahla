import { getLocale, getTranslations } from "next-intl/server"
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query"
import { faqQueryOptions } from "@/features/landing/services/faq"
import FaqList from "@/features/landing/components/faq-list"

export default async function Faq() {
    const t = await getTranslations("Faq")
    const locale = await getLocale()

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery(faqQueryOptions(locale))

    return (
        <section className="container py-10 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-start">
                    <p className="text-sm font-semibold text-accent">
                        {t("eyebrow")}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                        {t.rich("heading", {
                            primary: (chunks) => (
                                <span className="text-primary">{chunks}</span>
                            ),
                        })}
                    </h2>
                    <p className="text-muted-foreground">
                        {t("description")}
                    </p>
                </div>

                <HydrationBoundary state={dehydrate(queryClient)}>
                    <FaqList />
                </HydrationBoundary>
            </div>
        </section>
    )
}
