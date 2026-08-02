import type { ReactNode } from "react"

import CustomIcon from "@/components/custom-icon"
import { cn } from "@/lib/utils"

type TrackOrderMetaFieldProps = {
  icon: string
  label: string
  value: ReactNode
  valueDir?: "ltr" | "rtl"
  className?: string
}

export default function TrackOrderMetaField({
  icon,
  label,
  value,
  valueDir,
  className,
}: TrackOrderMetaFieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <CustomIcon
        src={icon}
        size={16}
        className="size-4 text-muted-foreground"
      />
      <p className="text-xs font-normal leading-5 text-muted-foreground">
        {label}
      </p>
      <p
        className="text-sm font-bold leading-6 wrap-break-word text-black"
        dir={valueDir}
      >
        {value}
      </p>
    </div>
  )
}
