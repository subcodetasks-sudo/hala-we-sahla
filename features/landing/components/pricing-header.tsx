"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

const EASE = [0.22, 1, 0.36, 1] as const

type PricingHeaderProps = {
  eyebrow: string
  titleHtml: string | null
  titleFallback: ReactNode
  description: string
}

export default function PricingHeader({
  eyebrow,
  titleHtml,
  titleFallback,
  description,
}: PricingHeaderProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className="mx-auto max-w-xl text-center"
      initial={
        shouldReduceMotion ? false : { opacity: 0, y: 20 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: EASE,
      }}
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
  )
}
