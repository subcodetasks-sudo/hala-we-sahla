"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

import SupportContactCard from "@/features/support/components/support-contact-card"
import type { SupportCardView } from "@/features/support/services/support"

const EASE = [0.22, 1, 0.36, 1] as const

type SupportContactCardsViewProps = {
  cards: SupportCardView[]
}

export default function SupportContactCardsView({
  cards,
}: SupportContactCardsViewProps) {
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
    <section className="pb-12 md:pb-16">
      <motion.div
        className="mx-auto grid max-w-4xl gap-4 sm:gap-6 md:grid-cols-2"
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            className="rounded-4xl bg-linear-to-b from-primary to-transparent p-px"
          >
            <SupportContactCard
              eyebrow={card.eyebrow}
              title={card.title}
              description={card.description}
              availability={card.availability}
              cta={card.cta}
              href={card.href}
              iconSrc={card.iconSrc}
              imageIsRemote={card.imageIsRemote}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
