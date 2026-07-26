import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import CustomIcon from "@/components/custom-icon";
import { Button } from "@/components/ui/button";
import StepCard from "@/features/landing/components/step-card";
import { Link } from "@/i18n/navigation";

const STEP_ITEMS = [
  {
    key: "upload",
    image: "/landing/step-1.png",
    arrowPlacement: "top",
    tone: "accent",
  },
  {
    key: "verification",
    image: "/landing/step-2.png",
    arrowPlacement: "bottom",
    tone: "accent",
  },
  {
    key: "payment",
    image: "/landing/step-3.png",
    arrowPlacement: "top",
    tone: "accent",
  },
  {
    key: "contract",
    image: "/landing/step-4.png",
    arrowPlacement: "bottom",
    tone: "accent",
  },
] as const;

export default async function Steps() {
  const t = await getTranslations("Steps");
  const s = await getTranslations("Footer");



  return (
    <section id="steps" className="bg-footer py-10 lg:py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">{t("eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-balance md:text-4xl">
            {t.rich("heading", {
              primary: (chunks) => (
                <span className="mt-1 block text-primary">{chunks}</span>
              ),
            })}
          </h2>
          <p className="mx-auto mt-4 text-muted-foreground sm:text-lg lg:w-2/3">
            {t("description")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {STEP_ITEMS.map(({ key, image, arrowPlacement, tone }) => (
            <StepCard
              key={key}
              label={t(`items.${key}.label`)}
              image={image}
              imageAlt={t(`items.${key}.imageAlt`)}
              arrowPlacement={arrowPlacement}
              tone={tone}
            />
          ))}
        </div>

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
  );
}
