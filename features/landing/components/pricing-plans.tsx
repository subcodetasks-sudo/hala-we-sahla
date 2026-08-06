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
  shouldReduceMotion,
}: {
  plan: PlanView
  accentClass: string
  shouldReduceMotion: boolean | null
}) {
  const isWhatsapp = plan.type === "whatsapp"
  const pulseBorder = isWhatsapp ? "border-custom-green" : "border-primary"

  if (plan.iconIsRemote) {
    return (
      <div className="relative inline-flex size-20 shrink-0 items-center justify-center">
        {isWhatsapp && !shouldReduceMotion ? (
          <motion.span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full border-2",
              pulseBorder,
            )}
            animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ) : null}
        <div
          className={cn(
            "relative flex size-full items-center justify-center overflow-hidden rounded-full",
            isWhatsapp && "border-2 border-custom-green",
          )}
        >
          <Image
            src={plan.iconSrc}
            alt=""
            width={80}
            height={80}
            unoptimized
            className={cn(
              "size-full object-contain",
              !isWhatsapp && "p-1.5",
            )}
            aria-hidden="true"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative inline-flex size-16 shrink-0 items-center justify-center">
      {isWhatsapp && !shouldReduceMotion ? (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full border-2",
            pulseBorder,
          )}
          animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ) : null}
      <div
        className={cn(
          "relative flex size-full items-center justify-center rounded-full shadow-sm",
          isWhatsapp ? "border-2 border-custom-green" : "bg-white",
        )}
      >
        <CustomIcon
          size={isWhatsapp ? 36 : 28}
          src={plan.iconSrc}
          className={cn(isWhatsapp ? "size-9" : "size-7", accentClass)}
          aria-hidden="true"
        />
      </div>
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
                <PlanIcon
                  plan={plan}
                  accentClass={accentText}
                  shouldReduceMotion={shouldReduceMotion}
                />
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
