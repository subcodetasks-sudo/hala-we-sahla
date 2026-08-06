import Image, { type ImageProps } from "next/image"

type BlogImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string
  alt: string
}

export default function BlogImage({ src, alt, className, ...props }: BlogImageProps) {
  const isRemote = /^https?:\/\//i.test(src)

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      unoptimized={isRemote}
      {...props}
    />
  )
}
