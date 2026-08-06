import Image from "next/image"

import { isRemoteAsset } from "@/features/landing/services/settings"

type SiteLogoProps = {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function SiteLogo({
  src,
  alt,
  width = 120,
  height = 40,
  className,
  priority,
}: SiteLogoProps) {
  const isRemote = isRemoteAsset(src)

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={isRemote}
    />
  )
}
