import { ArrowLeft } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import AnimatedStepsGrid from "@/features/landing/components/animated-steps-grid"
import AnimatedStepsIntro from "@/features/landing/components/animated-steps-intro"
import {
  getStepsContent,
  type StepItemView,
} from "@/features/landing/services/steps"
import { Link } from "@/i18n/navigation"

const FALLBACK_META = [
  {
    key: "upload",
    image: "/landing/step-1.png",
    titlePlacement: "bottom" as const,
    tone: "accent" as const,
  },
  {
    key: "verification",
    image: "/landing/step-2.png",
    titlePlacement: "top" as const,
    tone: "accent" as const,
  },
  {
    key: "payment",
    image: "/landing/step-3.png",
    titlePlacement: "bottom" as const,
    tone: "accent" as const,
  },
  {
    key: "contract",
    image: "/landing/step-4.png",
    titlePlacement: "top" as const,
    tone: "success" as const,
  },
]

export default async function Steps() {
  const t = await getTranslations("Steps")
  const s = await getTranslations("Footer")
  const locale = await getLocale()

  const fallbackItems: StepItemView[] = FALLBACK_META.map((item, index) => ({
    key: item.key,
    label: t(`items.${item.key}.label`),
    title: t(`items.${item.key}.imageAlt`),
    description: "",
    image: item.image,
    imageAlt: t(`items.${item.key}.imageAlt`),
    imageIsRemote: false,
    titlePlacement: item.titlePlacement,
    iconIndex: index,
    // Local PNGs already include mint chrome + titles
    framed: false,
    tone: item.tone,
  }))

  const steps = await getStepsContent(locale, {
    eyebrow: t("eyebrow"),
    description: t("description"),
    items: fallbackItems,
  })

  return (
    <section id="steps" className="bg-footer py-10 lg:py-16">
      <div className="container">
        <AnimatedStepsIntro
          eyebrow={steps.eyebrow}
          titleHtml={steps.titleHtml}
          heading={t.rich("heading", {
            primary: (chunks) => (
              <span key="primary" className="mt-1 block text-primary">
                {chunks}
              </span>
            ),
          })}
          description={steps.description}
        />

        <AnimatedStepsGrid items={steps.items} />

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
