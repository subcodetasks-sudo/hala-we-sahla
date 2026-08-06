import CustomIcon from "@/components/custom-icon"
import type { SocialLinkView } from "@/features/landing/services/settings"

type FooterSocialLinksProps = {
  links: SocialLinkView[]
  followLabel: string
  labelFor: (key: SocialLinkView["key"]) => string
}

export function FooterSocialLinks({
  links,
  followLabel,
  labelFor,
}: FooterSocialLinksProps) {
  if (links.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
      <span className="font-bold text-white">{followLabel}</span>
      <span aria-hidden="true" className="hidden h-px w-6 bg-white sm:block" />
      <div className="flex flex-wrap items-center gap-2">
        {links.map((link) => (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labelFor(link.key)}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/30"
          >
            {link.iconSrc ? (
              <CustomIcon src={link.iconSrc} size={20} />
            ) : null}
          </a>
        ))}
      </div>
    </div>
  )
}
