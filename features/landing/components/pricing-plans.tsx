"use client"

import Image from "next/image"
import { ArrowLeft, SaudiRiyal } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PlanView } from "@/features/landing/services/plans"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

type PricingPlansProps = {
  plans: PlanView[]
  priceSuffix: string
}

function PlanIcon({
  plan,
  accentClass,
}: {
  plan: PlanView
  accentClass: string
}) {
  if (plan.iconIsRemote) {
    return (
      <div className="flex size-14 shrink-0 items-center justify-center">
        <Image
          src={plan.iconSrc}
          alt=""
          width={56}
          height={56}
          unoptimized
          className="size-14 object-contain"
          aria-hidden="true"
        />
      </div>
    )
  }

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
      <CustomIcon
        size={24}
        src={plan.iconSrc}
        className={cn("size-6", accentClass)}
        aria-hidden="true"
      />
    </div>
  )
}

export default function PricingPlans({
  plans,
  priceSuffix,
}: PricingPlansProps) {
  const shouldReduceMotion = useReducedMotion()

  const gridVariants: Variants = {
    hidden: {},
    show: {
      transition: shouldReduceMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  }

  const cardVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: EASE,
      },
    },
  }

  return (
    <motion.div
      className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2"
      variants={gridVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {plans.map((plan) => {
        const isGreen = plan.variant === "green"
        const accentText = isGreen ? "text-custom-green" : "text-primary"
        const ringFrom = isGreen ? "from-custom-green" : "from-primary"

        return (
          <motion.div
            key={plan.id}
            variants={cardVariants}
            className={cn(
              "rounded-4xl bg-linear-to-b to-transparent p-px",
              ringFrom,
            )}
          >
            <Card
              className={cn(
                "flex h-full flex-col rounded-4xl p-6",
                isGreen ? "bg-green-50" : "bg-background",
              )}
            >
              <div className="flex flex-col items-center gap-6 px-6 pt-8 pb-6 text-center">
                <PlanIcon plan={plan} accentClass={accentText} />
                <h3 className="font-heading text-lg font-bold">{plan.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <p
                  className={cn(
                    "mt-4 flex items-center gap-2 font-clash text-4xl font-bold",
                    accentText,
                  )}
                >
                  {plan.price} <SaudiRiyal className="size-6" />
                </p>
                <p className="text-xs text-muted-foreground">
                  / {priceSuffix}
                </p>
              </div>

              <ul className="mx-auto flex w-fit flex-col items-start gap-3 px-6 pb-6 text-start">
                {plan.advantages.map((advantage) => (
                  <li
                    key={advantage}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CustomIcon
                      size={16}
                      src="/icons/check-green.svg"
                      className="size-4 shrink-0 text-custom-green"
                      aria-hidden="true"
                    />
                    <span>{advantage}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "mt-auto h-12! w-full gap-1.5 rounded-full text-base!",
                  isGreen &&
                    "bg-custom-green text-white hover:bg-custom-green/90!",
                )}
                asChild
              >
                {plan.ctaExternal ? (
                  <a
                    href={plan.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CustomIcon
                      size={16}
                      src={plan.ctaIconSrc}
                      className="size-4 shrink-0 text-white"
                      aria-hidden="true"
                    />
                    {plan.ctaLabel}
                    <ArrowLeft className="ltr:rotate-180" />
                  </a>
                ) : (
                  <Link href={plan.ctaHref}>
                    <CustomIcon
                      size={16}
                      src={plan.ctaIconSrc}
                      className="size-4 shrink-0 text-white"
                      aria-hidden="true"
                    />
                    {plan.ctaLabel}
                    <ArrowLeft className="ltr:rotate-180" />
                  </Link>
                )}
              </Button>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
