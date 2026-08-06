import Image from "next/image"
import {
  BadgeCheck,
  CreditCard,
  FileCheck2,
  FileUp,
  type LucideIcon,
} from "lucide-react"

import StepArrow from "@/features/landing/components/step-arrow"
import { cn } from "@/lib/utils"

const STEP_ICONS: LucideIcon[] = [FileUp, BadgeCheck, CreditCard, FileCheck2]

type StepCardProps = {
  label: string
  title?: string
  image: string
  imageAlt: string
  imageIsRemote?: boolean
  titlePlacement: "top" | "bottom"
  iconIndex?: number
  tone: "accent" | "success"
  /** When false, image is a full composite (fallback PNGs). */
  framed?: boolean
}

function TitleBlock({
  title,
  Icon,
}: {
  title: string
  Icon: LucideIcon
}) {
  return (
    <div className="flex w-full flex-col items-start gap-2 text-start">
      <Icon
        className="size-7 shrink-0 text-primary sm:size-8"
        strokeWidth={1.75}
        aria-hidden
      />
      <h3 className="text-lg font-bold leading-snug text-foreground sm:text-xl">
        {title}
      </h3>
    </div>
  )
}

function LabelBlock({
  label,
  tone,
  arrowPlacement,
}: {
  label: string
  tone: "accent" | "success"
  arrowPlacement: "top" | "bottom"
}) {
  const toneClass = tone === "success" ? "text-emerald-500" : "text-accent"

  return (
    <div
      className={cn(
        "flex items-start gap-1.5",
        toneClass,
        arrowPlacement === "bottom" && "flex-row-reverse items-end",
      )}
    >
      <span className="pt-0.5 text-sm font-bold tracking-tight [text-shadow:0_2px_3px_rgba(0,0,0,0.12)]">
        {label}
      </span>
      <StepArrow
        className={cn(
          "shrink-0",
          toneClass,
          "ltr:-scale-x-100",
          arrowPlacement === "bottom" && "rotate-180",
        )}
      />
    </div>
  )
}

export default function StepCard({
  label,
  title,
  image,
  imageAlt,
  imageIsRemote = false,
  titlePlacement,
  iconIndex = 0,
  tone,
  framed = true,
}: StepCardProps) {
  const Icon = STEP_ICONS[iconIndex % STEP_ICONS.length] ?? FileUp
  const arrowPlacement = titlePlacement === "top" ? "bottom" : "top"

  if (!framed) {
    return (
      <article className="flex h-full flex-col">
        <Image
          src={image}
          alt={imageAlt}
          width={1404}
          height={1816}
          className="h-auto w-full"
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw"
        />
      </article>
    )
  }

  const titleBlock =
    title ? <TitleBlock title={title} Icon={Icon} /> : null

  const labelBlock = (
    <LabelBlock label={label} tone={tone} arrowPlacement={arrowPlacement} />
  )

  return (
    <div className="flex h-full flex-col">
      {arrowPlacement === "top" ? (
        <div className="flex min-h-20 w-full items-end justify-center pb-1">
          {labelBlock}
        </div>
      ) : null}

      <article className="flex flex-1 flex-col gap-5 rounded-[2rem] bg-background p-5 sm:gap-6 sm:rounded-[2.5rem] sm:p-6 lg:p-7">
        {titlePlacement === "top" ? titleBlock : null}

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Image
            src={image}
            alt={imageAlt}
            width={1404}
            height={1816}
            unoptimized={imageIsRemote}
            className="h-auto w-full object-contain"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw"
          />
        </div>

        {titlePlacement === "bottom" ? titleBlock : null}
      </article>

      {arrowPlacement === "bottom" ? (
        <div className="flex min-h-20 w-full items-start justify-end pt-1">
          {labelBlock}
        </div>
      ) : null}
    </div>
  )
}
