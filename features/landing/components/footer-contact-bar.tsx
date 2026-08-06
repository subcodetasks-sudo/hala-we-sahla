import { Mail, Phone } from "lucide-react"

import { FooterSocialLinks } from "@/features/landing/components/footer-social-links"
import type { SiteSettingsView } from "@/features/landing/services/settings"

function DotSeparator() {
  return (
    <span
      aria-hidden="true"
      className="hidden size-1 shrink-0 rounded-[1px] bg-white/10 sm:inline-block"
    />
  )
}

type FooterContactBarProps = {
  settings: SiteSettingsView
  followLabel: string
  supportText: string
  socialLabelFor: (key: string) => string
}

export function FooterContactBar({
  settings,
  followLabel,
  supportText,
  socialLabelFor,
}: FooterContactBarProps) {
  const hasSocial = settings.socialLinks.length > 0
  const hasPhone = Boolean(settings.phone.trim())
  const hasEmail = Boolean(settings.email.trim())
  const hasContact = hasPhone || hasEmail

  if (!hasSocial && !hasContact) {
    return null
  }

  return (
    <div className="border-b border-border/10">
      <div className="container flex flex-col items-center justify-between gap-6 py-8 text-white sm:py-10 lg:flex-row lg:gap-8">
        {hasSocial ? (
          <FooterSocialLinks
            links={settings.socialLinks}
            followLabel={followLabel}
            labelFor={(key) => socialLabelFor(key)}
          />
        ) : null}

        {hasContact ? (
          <div
            dir="ltr"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-end"
          >
            {hasPhone ? (
              <a
                href={settings.phoneHref}
                className="flex items-center gap-1.5 font-clash text-xl transition-colors hover:text-accent sm:text-2xl"
              >
                {settings.phoneDisplay}
                <Phone className="size-3.5 shrink-0" aria-hidden="true" />
              </a>
            ) : null}

            {hasPhone && hasEmail ? <DotSeparator /> : null}

            {hasEmail ? (
              <a
                href={settings.emailHref}
                className="flex items-center gap-1.5 font-clash text-xl transition-colors hover:text-accent sm:text-2xl"
              >
                {settings.email}
                <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              </a>
            ) : null}

            {supportText ? (
              <>
                {(hasPhone || hasEmail) ? <DotSeparator /> : null}
                <span dir="auto" className="font-bold">
                  {supportText}
                </span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
