"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { motion, useReducedMotion, type Variants } from "motion/react"

import CustomIcon from "@/components/custom-icon"
import { NumberTicker } from "@/components/ui/number-ticker"
import type { StatsItemView } from "@/features/landing/services/statistics"

const EASE = [0.22, 1, 0.36, 1] as const

type StatsContentProps = {
  eyebrow: string
  titleHtml: string | null
  titleFallback: ReactNode
  description: string
  items: StatsItemView[]
}

export default function StatsContent({
  eyebrow,
  titleHtml,
  titleFallback,
  description,
  items,
}: StatsContentProps) {
  const shouldReduceMotion = useReducedMotion()

  const headerVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: EASE,
      },
    },
  }

  const gridVariants: Variants = {
    hidden: {},
    show: {
      transition: shouldReduceMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.12, delayChildren: 0.1 },
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
    <section className="container py-10 lg:py-16">
      <motion.div
        className="mx-auto max-w-xl text-center"
        variants={headerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <p className="text-sm font-semibold text-accent">{eyebrow}</p>
        {titleHtml ? (
          <h2
            className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl [&_strong]:font-bold [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        ) : (
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            {titleFallback}
          </h2>
        )}
        <p className="mt-3 text-muted-foreground">{description}</p>
      </motion.div>

      <motion.div
        className="mt-10 grid gap-4 sm:grid-cols-3"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {items.map((item) => {
          const isRemoteImage = Boolean(
            item.imageSrc && /^https?:\/\//i.test(item.imageSrc),
          )

          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="rounded-4xl bg-linear-to-b from-primary to-transparent p-px"
            >
              <div className="flex w-full flex-col items-center gap-6 rounded-4xl bg-background px-6 py-10 text-center">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized={isRemoteImage}
                    className="size-12 object-contain"
                    aria-hidden="true"
                  />
                ) : item.iconSrc ? (
                  <CustomIcon
                    size={48}
                    src={item.iconSrc}
                    className="size-12 text-primary"
                    aria-hidden="true"
                  />
                ) : null}

                <span className="font-clash text-3xl font-bold text-primary">
                  <NumberTicker
                    value={item.value}
                    className="font-clash text-3xl font-bold text-primary"
                  />
                  {item.suffix}
                </span>
                <p className="text-sm font-medium text-foreground/80">
                  {item.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
