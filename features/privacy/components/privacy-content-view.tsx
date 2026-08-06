"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

import LegalSectionCard from "@/components/shared/legal-section-card"
import LegalSidebar from "@/components/shared/legal-sidebar"
import type { PrivacyContentView as PrivacyData } from "@/features/privacy/services/privacy"

const EASE = [0.22, 1, 0.36, 1] as const

type PrivacyContentSectionProps = {
  privacy: PrivacyData
  tocTitle: string
}

export default function PrivacyContentSection({
  privacy,
  tocTitle,
}: PrivacyContentSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  const sidebarItems = privacy.sections.map((section) => ({
    id: section.id,
    label: section.title,
  }))

  const sidebarVariants: Variants = {
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
    hidden: {},
    show: {
      transition: shouldReduceMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.1, delayChildren: 0.06 },
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
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: EASE,
      },
    },
  }

  return (
    <div className="bg-primary/20 py-16">
      <section className="container">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-8">
          <motion.div
            className="flex flex-col gap-4 md:gap-5"
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {privacy.sections.map((section, index) => (
              <motion.div key={section.id} variants={cardVariants}>
                <LegalSectionCard
                  id={section.id}
                  number={String(index + 1).padStart(2, "0")}
                  title={section.title}
                  subtitle={section.subtitle}
                  body={section.body}
                  contentHtml={section.contentHtml}
                  items={section.items}
                  note={section.note}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.aside
            className="order-first lg:sticky lg:top-28 lg:order-0 lg:self-start"
            variants={sidebarVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <LegalSidebar title={tocTitle} items={sidebarItems} />
          </motion.aside>
        </div>
      </section>
    </div>
  )
}
