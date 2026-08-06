"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { ArrowUpLeft, ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

/** Starts after the navbar entrance (~0.85s) so the sequence feels intentional. */
const NAVBAR_DELAY = .85
const EASE = [0.22, 1, 0.36, 1] as const

type HeroContentProps = {
  badge: string
  titleHtml: string | null
  titleFallback: ReactNode
  descriptionHtml: string | null
  descriptionText: string | null
  primaryCta: string
  secondaryCta: string
  imageSrc: string
  imageAlt: string
}

export default function HeroContent({
  badge,
  titleHtml,
  titleFallback,
  descriptionHtml,
  descriptionText,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
}: HeroContentProps) {
  const shouldReduceMotion = useReducedMotion()
  const isRemoteImage = /^https?:\/\//i.test(imageSrc)

  const textContainer: Variants = {
    hidden: {},
    show: {
      transition: shouldReduceMotion
        ? { staggerChildren: 0, delayChildren: 0 }
        : {
            delayChildren: NAVBAR_DELAY,
            staggerChildren: 0.14,
          },
    },
  }

  const textItem: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.75,
        ease: EASE,
      },
    },
  }

  const imageVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 1,
        ease: EASE,
        delay: shouldReduceMotion ? 0 : NAVBAR_DELAY + 0.35,
      },
    },
  }

  return (
    <section className="container grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <motion.div
        className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-start"
        variants={textContainer}
        initial="hidden"
        animate="show"
      >
        <motion.span
          variants={textItem}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 py-1.5 ps-1.5 pe-4 text-sm font-medium"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CustomIcon
              src="/icons/file-2.svg"
              size={16}
              className="size-4"
            />
          </span>
          {badge}
          🚀
        </motion.span>

        <motion.div variants={textItem}>
          {titleHtml ? (
            <h1
              className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:max-w-lg lg:text-5xl [&_strong]:font-bold [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />
          ) : (
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:max-w-lg lg:text-5xl">
              {titleFallback}
            </h1>
          )}
        </motion.div>

        <motion.div variants={textItem}>
          {descriptionHtml ? (
            <div
              className="max-w-lg text-balance text-muted-foreground sm:text-lg [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <p className="max-w-lg text-balance text-muted-foreground sm:text-lg">
              {descriptionText}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={textItem}
          className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
        >
          <Button
            className="h-fit! gap-1.5 rounded-full bg-black p-3 text-base! shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:bg-accent!"
            asChild
          >
            <Link href="/renewal">
              <CustomIcon
                size={22}
                src="/icons/receipt-edit.svg"
                className="size-4"
              />
              {primaryCta}
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
                <ArrowUpRight className="rtl:-rotate-90" />
              </div>
            </Link>
          </Button>
          <Button
            className="h-12! gap-1.5 bg-transparent! text-lg! text-black"
            asChild
          >
            <Link href="/track-orders">
              <CustomIcon src="/icons/box-time.svg" className="size-4" />
              {secondaryCta}
              <ArrowUpLeft className="ltr:rotate-180" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mx-auto hidden w-full max-w-lg md:block lg:max-w-none"
        variants={imageVariants}
        initial="hidden"
        animate="show"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={799}
          height={677}
          priority
          unoptimized={isRemoteImage}
          className="h-auto w-full"
        />
      </motion.div>
    </section>
  )
}
