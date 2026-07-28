"use client"

import { motion, type Variants } from "motion/react"

import StepCard from "@/features/landing/components/step-card"

type StepItem = {
  key: string
  label: string
  image: string
  imageAlt: string
  arrowPlacement: "top" | "bottom"
  tone: "accent" | "success"
}

type AnimatedStepsGridProps = {
  items: StepItem[]
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
}

export default function AnimatedStepsGrid({ items }: AnimatedStepsGridProps) {
  return (
    <motion.div
      className="mt-12 grid grid-cols-1 items-start gap-10 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-4 lg:gap-6 xl:gap-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items.map((item) => (
        <motion.div key={item.key} variants={itemVariants}>
          <StepCard
            label={item.label}
            image={item.image}
            imageAlt={item.imageAlt}
            arrowPlacement={item.arrowPlacement}
            tone={item.tone}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
