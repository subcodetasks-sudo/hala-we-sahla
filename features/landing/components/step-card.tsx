import Image from "next/image"

import CustomIcon from "@/components/custom-icon"
import { cn } from "@/lib/utils"

type StepCardProps = {
  label: string
  image: string
  imageAlt: string
  arrowPlacement: "top" | "bottom"
  tone: "accent" | "success"
}

export default function StepCard({
  label,
  image,
  imageAlt,
  arrowPlacement,
  tone,
}: StepCardProps) {
  const toneClass = tone === "success" ? "text-emerald-500" : "text-accent"

  const labelBlock = (
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
      <CustomIcon
        src="/landing/icons/step-arrow.svg"
        width={57}
        height={48}
        className={cn(
          "shrink-0",
          toneClass,
          "ltr:-scale-x-100",
          arrowPlacement === "bottom" && "rotate-180",
        )}
      />
    </div>
  )

  return (
    <article className="flex h-full flex-col items-center">
      <div className="flex min-h-20 w-full items-end justify-center pb-1">
        {arrowPlacement === "top" ? labelBlock : null}
      </div>

      <Image
        src={image}
        alt={imageAlt}
        width={1404}
        height={1816}
        className="h-auto w-full"
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 22vw"
      />

      <div className="flex min-h-20 w-full items-start justify-end pt-1">
        {arrowPlacement === "bottom" ? labelBlock : null}
      </div>
    </article>
  )
}
