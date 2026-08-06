"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"
import { Clock } from "lucide-react"

import BreadcrumbNav from "@/components/shared/breadcrumb-nav"
import type { TermsContentView } from "@/features/terms/services/terms"

const EASE = [0.22, 1, 0.36, 1] as const

type TermsHeaderViewProps = {
  breadcrumbHome: string
  breadcrumbCurrent: string
  lastUpdatedLabel: string
  terms: TermsContentView
}

export default function TermsHeaderView({
  breadcrumbHome,
  breadcrumbCurrent,
  lastUpdatedLabel,
  terms,
}: TermsHeaderViewProps) {
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
    <header className="container py-6 md:py-10">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="show"
      >
        <BreadcrumbNav
          items={[
            { label: breadcrumbHome, href: "/" },
            { label: breadcrumbCurrent },
          ]}
        />
      </motion.div>

      <motion.div
        className="mt-8 max-w-2xl md:mt-10"
        variants={variants}
        initial="hidden"
        animate="show"
        transition={{ delay: shouldReduceMotion ? 0 : 0.08 }}
      >
        <p className="text-sm font-semibold text-accent">{terms.eyebrow}</p>

        {terms.titleHtml ? (
          <h1
            className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl [&_strong]:font-bold [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: terms.titleHtml }}
          />
        ) : (
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {terms.title}
          </h1>
        )}

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {terms.description}
        </p>

        <p className="mt-5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4 shrink-0" aria-hidden="true" />
          <span>{lastUpdatedLabel}</span>
        </p>
      </motion.div>
    </header>
  )
}
