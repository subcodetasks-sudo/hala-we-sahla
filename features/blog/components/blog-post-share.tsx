"use client"

import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

import CustomIcon from "@/components/custom-icon";
import { cn } from "@/lib/utils";

type BlogPostShareProps = {
  title: string
  className?: string
}

const SHARE_BUTTON_CLASS =
  "flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-opacity hover:opacity-80 sm:size-10"

export default function BlogPostShare({ title, className }: BlogPostShareProps) {
  const t = useTranslations("Blog.post.share")

  function getShareUrl() {
    if (typeof window === "undefined") {
      return ""
    }

    return window.location.href
  }

  function handleXShare() {
    const url = encodeURIComponent(getShareUrl())
    const text = encodeURIComponent(title)
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  function handleLinkedInShare() {
    const url = encodeURIComponent(getShareUrl())
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  async function handleNativeShare() {
    const url = getShareUrl()

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // User cancelled or share failed — fall through to clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard may be unavailable; ignore silently.
    }
  }

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <p className="text-sm text-muted-foreground">{t("label")}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleXShare}
          className={SHARE_BUTTON_CLASS}
          aria-label={t("x")}
        >
          <CustomIcon src="/icons/x.svg" size={16} className="size-4" />
        </button>

        <button
          type="button"
          onClick={handleLinkedInShare}
          className={SHARE_BUTTON_CLASS}
          aria-label={t("linkedin")}
        >
          <CustomIcon src="/icons/linkedin.svg" size={16} className="size-4" />
        </button>

        <button
          type="button"
          onClick={handleNativeShare}
          className={SHARE_BUTTON_CLASS}
          aria-label={t("native")}
        >
          <Share2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
