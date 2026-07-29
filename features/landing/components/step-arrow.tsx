"use client"

import { useInView } from "motion/react"
import { useRef } from "react"

import CustomIcon from "@/components/custom-icon"
import { cn } from "@/lib/utils"

type StepArrowProps = {
  className?: string
}

export default function StepArrow({ className }: StepArrowProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <span ref={ref} className="inline-flex shrink-0">
      <CustomIcon
        src="/landing/icons/step-arrow.svg"
        width={57}
        height={48}
        className={cn("step-arrow", inView && "step-arrow-in", className)}
      />
    </span>
  )
}
