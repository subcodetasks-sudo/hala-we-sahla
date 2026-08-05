"use client"

import { Check, Clock3, PenLine, Trash2, Upload, User } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { CustomerSignature } from "@/features/forms/components/customer-signature"
import type {
  SignatureMode,
  SignatureValue,
} from "@/features/forms/components/customer-signature"
import { cn } from "@/lib/utils"

export type SignatureParty = "employer" | "worker"

export const SIGNATURE_PARTY_MODES: Record<SignatureParty, SignatureMode[]> = {
  employer: ["draw", "upload"],
  worker: ["upload"],
}

const MODE_ICONS = {
  draw: PenLine,
  upload: Upload,
} satisfies Record<SignatureMode, typeof PenLine>

type SignaturePartyCardProps = {
  party: SignatureParty
  value: SignatureValue | null
  onChange: (value: SignatureValue | null) => void
  className?: string
}

export default function SignaturePartyCard({
  party,
  value,
  onChange,
  className,
}: SignaturePartyCardProps) {
  const t = useTranslations("Forms.signature")
  const isSigned = Boolean(value?.image)
  const modes = SIGNATURE_PARTY_MODES[party]
  const UsedModeIcon = MODE_ICONS[value?.type ?? "draw"]

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-[#cfe5e8] transition-shadow hover:shadow-[0_10px_30px_rgba(40,130,150,0.08)]",
        isSigned && "ring-custom-green/25",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
                isSigned && "bg-custom-green/10 text-custom-green",
              )}
              aria-hidden="true"
            >
              <User className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-black">
                {t(`parties.${party}.title`)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(`parties.${party}.subtitle`)}
              </p>
            </div>
          </div>

          <span
            className={cn(
              "inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold",
              isSigned
                ? "border border-custom-green/20 bg-[#DEFFEA] text-custom-green"
                : "border border-[#d7e0e3] bg-[#f5f7f8] text-[#5b7380]",
            )}
          >
            {isSigned ? (
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            ) : (
              <Clock3 className="size-3.5" aria-hidden="true" />
            )}
            {isSigned ? t("status.signed") : t("status.pending")}
          </span>
        </div>

        <CustomerSignature
          value={value}
          onChange={onChange}
          variant="card"
          modes={modes}
          label={t(`parties.${party}.title`)}
          emptyLabel={t(`parties.${party}.action`)}
          emptyHint={t(`parties.${party}.emptyHint`)}
        />

        <div className="mt-auto border-t border-dashed border-[#e2edef] pt-3">
          {isSigned ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-custom-green">
                <UsedModeIcon className="size-3.5" aria-hidden="true" />
                {value?.type === "upload"
                  ? t("methods.uploaded")
                  : t("methods.drawn")}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
                className="h-8 gap-1.5 rounded-full px-3 text-xs font-semibold text-[#FF0A0E] hover:bg-[#fff1f1] hover:text-[#FF0A0E]"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                {t("actions.remove")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">
                {t("methods.label")}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {modes.map((mode) => {
                  const ModeIcon = MODE_ICONS[mode]
                  return (
                    <span
                      key={mode}
                      className="inline-flex items-center gap-1 rounded-full bg-[#eff8f9] px-2 py-1 text-[11px] font-semibold text-primary"
                    >
                      <ModeIcon className="size-3" aria-hidden="true" />
                      {t(`methods.${mode}`)}
                    </span>
                  )
                })}
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                {t(`parties.${party}.hint`)}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
