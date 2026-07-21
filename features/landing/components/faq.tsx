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
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-24">
                <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-start">
                    <p className="text-sm font-semibold text-accent">
                        {t("eyebrow")}
                    </p>
                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl">
                        {t.rich("heading", {
                            primary: (chunks) => (
                                <span className="mt-1 block text-primary">
                                    {chunks}
                                </span>
                            ),
                        })}
                    </h2>
                    <p className="mt-1 text-muted-foreground">
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
