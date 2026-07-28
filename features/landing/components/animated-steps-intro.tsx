"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

type AnimatedStepsIntroProps = {
  eyebrow: string
  heading: ReactNode
  description: string
}

export default function AnimatedStepsIntro({
  eyebrow,
  heading,
  description,
}: AnimatedStepsIntroProps) {
  return (
    <motion.div
      className="mx-auto max-w-2xl text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <p className="text-sm font-semibold text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-balance md:text-4xl">
        {heading}
      </h2>
      <p className="mx-auto mt-4 text-muted-foreground sm:text-lg lg:w-2/3">
        {description}
      </p>
    </motion.div>
  )
}
