"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

const EASE = [0.22, 1, 0.36, 1] as const

type SupportHeaderViewProps = {
  eyebrow: string
  titleHtml: string | null
  titleFallback: ReactNode
  description: string
}

export default function SupportHeaderView({
  eyebrow,
  titleHtml,
  titleFallback,
  description,
}: SupportHeaderViewProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants: Variants = {
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

  return (
    <header className="mx-auto max-w-2xl py-10 text-center md:py-16">
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>

        {titleHtml ? (
          <h1
            className="mt-3 text-3xl tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl [&_strong]:font-medium [&_p]:m-0 [&_span]:text-primary"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
        ) : (
          <h1 className="mt-3 text-3xl tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl">
            {titleFallback}
          </h1>
        )}

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </motion.div>
    </header>
  )
}
