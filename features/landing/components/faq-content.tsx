"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import FaqList from "@/features/landing/components/faq-list"
import type { FaqItem } from "@/features/landing/services/faq"

const EASE = [0.22, 1, 0.36, 1] as const

type FaqContentProps = {
  eyebrow: string
  titleHtml: string | null
  titleFallback: ReactNode
  description: string
  items: FaqItem[]
}

export default function FaqContent({
  eyebrow,
  titleHtml,
  titleFallback,
  description,
  items,
}: FaqContentProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: shouldReduceMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.12, delayChildren: 0.06 },
    },
  }

  const introVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: EASE,
      },
    },
  }

  const listVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 20 },
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
    <section id="faq" className="container py-10 lg:py-16">
      <motion.div
        className="flex flex-col items-center md:flex-row lg:gap-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div
          variants={introVariants}
          className="flex max-w-lg flex-col items-center gap-3 text-center lg:items-start lg:text-start"
        >
          <p className="text-sm font-semibold text-accent">{eyebrow}</p>
          {titleHtml ? (
            <h2
              className="text-3xl font-bold leading-tight tracking-tight text-balance md:text-5xl [&_strong]:font-bold [&_p]:m-0 [&_br]:block"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />
          ) : (
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-balance md:text-5xl">
              {titleFallback}
            </h2>
          )}
          <p className="mt-1 text-muted-foreground">{description}</p>
        </motion.div>

        <motion.div variants={listVariants} className="w-full flex-1">
          <FaqList items={items} />
        </motion.div>
      </motion.div>
    </section>
  )
}
