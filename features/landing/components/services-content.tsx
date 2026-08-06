"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import type { ServiceItemView } from "@/features/landing/services/services"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

type ServicesContentProps = {
  eyebrow: string
  titleHtml: string | null
  titleFallback: ReactNode
  description: string
  items: ServiceItemView[]
}

export default function ServicesContent({
  eyebrow,
  titleHtml,
  titleFallback,
  description,
  items,
}: ServicesContentProps) {
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

  const listVariants: Variants = {
    hidden: {},
    show: {
      transition: shouldReduceMotion
        ? { staggerChildren: 0 }
        : { staggerChildren: 0.14, delayChildren: 0.08 },
    },
  }

  const rowVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 28 },
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
    <section className="w-full py-16 lg:py-24">
      <div>
        <motion.div
          className="container mx-auto max-w-xl text-center"
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="text-sm font-semibold text-accent">{eyebrow}</p>
          {titleHtml ? (
            <h2
              className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl [&_strong]:font-bold [&_p]:m-0 [&_br]:block"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />
          ) : (
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              {titleFallback}
            </h2>
          )}
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col gap-8 lg:mt-20"
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {items.map((item) => {
            const toneText =
              item.tone === "accent" ? "text-accent" : "text-primary"
            const isWhatsapp = item.tone === "whatsapp"

            const textBlock = (
              <div
                key="text"
                className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-start"
              >
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full bg-primary/20",
                    isWhatsapp && "bg-primary/40",
                  )}
                >
                  {isWhatsapp ? (
                    <CustomIcon
                      size={22}
                      src="/icons/message.svg"
                      className="size-5 text-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <CustomIcon
                      size={22}
                      src={item.iconSrc}
                      className="size-5 text-black"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <h3 className="text-2xl font-bold sm:text-3xl">
                  {item.titleLine1 && item.titleLine2 ? (
                    <>
                      <span className="block">{item.titleLine1}</span>
                      <span className={cn("block", toneText)}>
                        {item.titleLine2}
                      </span>
                    </>
                  ) : (
                    <span className={cn("block", toneText)}>
                      {item.titleLine1 || item.title}
                    </span>
                  )}
                </h3>

                <p className="max-w-sm">{item.description}</p>

                <Button
                  className={cn(
                    "h-12! gap-1.5 rounded-full text-base! text-white",
                    item.tone === "accent" && "bg-accent hover:bg-accent/80!",
                    isWhatsapp && "bg-[#0DB38B] hover:bg-[#0DB38B]/80!",
                  )}
                  asChild
                >
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CustomIcon
                        size={16}
                        src={item.iconSrc}
                        className="size-4 shrink-0 text-white"
                        aria-hidden="true"
                      />
                      {item.ctaLabel}
                      <ArrowLeft className="ltr:rotate-180" />
                    </a>
                  ) : (
                    <Link href={item.href}>
                      <CustomIcon
                        size={16}
                        src={item.iconSrc}
                        className="size-4 shrink-0 text-white"
                        aria-hidden="true"
                      />
                      {item.ctaLabel}
                      <ArrowLeft className="ltr:rotate-180" />
                    </Link>
                  )}
                </Button>
              </div>
            )

            const imageBlock = (
              <div key="image" className="mx-auto w-full grow">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={844}
                  height={538}
                  unoptimized={item.imageIsRemote}
                  className="h-auto w-full"
                />
              </div>
            )

            return (
              <motion.div
                key={item.id}
                variants={rowVariants}
                className={cn(isWhatsapp && "bg-footer py-10")}
              >
                <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  {item.imageFirst
                    ? [imageBlock, textBlock]
                    : [textBlock, imageBlock]}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
