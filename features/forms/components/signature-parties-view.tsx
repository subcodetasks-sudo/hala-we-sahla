"use client"

import { useState } from "react"
import { toast } from "sonner"
import { TriangleAlert } from "lucide-react"
import { useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { SignatureValue } from "@/features/forms/components/customer-signature"
import SignaturePartyCard from "@/features/forms/components/signature-party-card"
import type { SignatureParty } from "@/features/forms/components/signature-party-card"
import { useSubmitSignaturesStep } from "@/features/forms/hooks/use-submit-signatures-step"
import { cn } from "@/lib/utils"

const PARTIES: SignatureParty[] = ["employer", "worker"]

type SignaturePartiesViewProps = {
  orderId: number | null
}

export default function SignaturePartiesView({
  orderId,
}: SignaturePartiesViewProps) {
  const t = useTranslations("Forms.signature")
  const submitMutation = useSubmitSignaturesStep()
  const [signatures, setSignatures] = useState<
    Record<SignatureParty, SignatureValue | null>
  >({ employer: null, worker: null })

  const signedCount = PARTIES.filter((party) => signatures[party]).length
  const allSigned = signedCount === PARTIES.length
  const employerFile = signatures.employer?.file
  const workerFile = signatures.worker?.file
  const canSubmit = Boolean(orderId && employerFile && workerFile)

  // Failures are surfaced by the global mutation error handler in providers.
  function handleSubmit() {
    if (!orderId || !employerFile || !workerFile) return

    submitMutation.mutate(
      {
        requestId: orderId,
        payload: {
          employer_signature: employerFile,
          worker_signature: workerFile,
        },
      },
      { onSuccess: () => toast.success(t("success")) },
    )
  }

  return (
    <Card className="mx-auto w-full max-w-3xl gap-0 rounded-[28px] border-none bg-card px-4 py-8 shadow-[0_12px_40px_rgba(40,130,150,0.1)] ring-0 sm:rounded-[32px] sm:px-8 sm:py-10">
      <header className="flex flex-col items-center text-center">
        <span
          className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <CustomIcon src="/forms/step-3/brush.svg" size={26} className="size-6" />
        </span>

        <h2 className="mt-4 text-lg font-bold text-black sm:text-xl">
          {t("title")}
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>

        <div className="mt-5 flex w-full max-w-xs flex-col items-center gap-2">
          <div className="flex w-full gap-1.5" aria-hidden="true">
            {PARTIES.map((party, index) => (
              <span
                key={party}
                className={cn(
                  "h-1.5 flex-1 rounded-full bg-[#e2edef] transition-colors",
                  index < signedCount && "bg-custom-green",
                )}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-primary sm:text-sm">
            {t("progress", { signed: signedCount, total: PARTIES.length })}
          </span>
        </div>
      </header>

      {orderId ? null : (
        <p
          role="alert"
          className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#fff1f1] px-4 py-3 text-center text-xs font-medium text-[#FF0A0E] sm:text-sm"
        >
          <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
          {t("errors.missingOrderId")}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2">
        {PARTIES.map((party) => (
          <SignaturePartyCard
            key={party}
            party={party}
            value={signatures[party]}
            onChange={(value) =>
              setSignatures((current) => ({ ...current, [party]: value }))
            }
          />
        ))}
      </div>

      <footer className="mt-8 flex flex-col items-center gap-3">
        <Button
          type="button"
          disabled={!canSubmit || submitMutation.isPending}
          onClick={handleSubmit}
          className="h-12 w-full rounded-full text-base text-white sm:max-w-xs"
        >
          {submitMutation.isPending ? t("submitting") : t("submit")}
        </Button>
        {allSigned ? null : (
          <p className="text-center text-xs text-muted-foreground">
            {t("submitHint")}
          </p>
        )}
      </footer>
    </Card>
  )
}
