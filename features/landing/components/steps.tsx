import { ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import AnimatedStepsGrid from "@/features/landing/components/animated-steps-grid"
import AnimatedStepsIntro from "@/features/landing/components/animated-steps-intro"
import { Link } from "@/i18n/navigation"

const STEP_ITEMS = [
  {
    key: "upload",
    image: "/landing/step-1.png",
    arrowPlacement: "top" as const,
    tone: "accent" as const,
  },
  {
    key: "verification",
    image: "/landing/step-2.png",
    arrowPlacement: "bottom" as const,
    tone: "accent" as const,
  },
  {
    key: "payment",
    image: "/landing/step-3.png",
    arrowPlacement: "top" as const,
    tone: "accent" as const,
  },
  {
    key: "contract",
    image: "/landing/step-4.png",
    arrowPlacement: "bottom" as const,
    tone: "success" as const,
  },
]

export default async function Steps() {
  const t = await getTranslations("Steps")
  const s = await getTranslations("Footer")

  const items = STEP_ITEMS.map((item) => ({
    ...item,
    label: t(`items.${item.key}.label`),
    imageAlt: t(`items.${item.key}.imageAlt`),
  }))

  return (
    <section id="steps" className="bg-footer py-10 lg:py-16">
      <div className="container">
        <AnimatedStepsIntro
          eyebrow={t("eyebrow")}
          heading={t.rich("heading", {
            primary: (chunks) => (
              <span key="primary" className="mt-1 block text-primary">
                {chunks}
              </span>
            ),
          })}
          description={t("description")}
        />

        <AnimatedStepsGrid items={items} />

        <div className="mt-10 flex justify-center">
          <Button
            className="h-12! gap-1.5 rounded-full text-base! text-white"
            asChild
          >
            <Link href="/renewal">
              <CustomIcon
                src="/icons/receipt-edit.svg"
                size={16}
                className="size-4 shrink-0"
              />
              {s("cta")}
              <ArrowLeft className="ltr:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
