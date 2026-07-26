"use client"

import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

export const RENEWAL_STEPS = [
  "employer",
  "worker",
  "documents",
  "review",
] as const

export type RenewalStepKey = (typeof RENEWAL_STEPS)[number]

type RenewalStepperProps = {
  currentStep: number
  onStepChange: (step: number) => void
}

export default function RenewalStepper({
  currentStep,
  onStepChange,
}: RenewalStepperProps) {
  const t = useTranslations("Forms.renewal.wizard")

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex w-full items-start">
        {RENEWAL_STEPS.map((key, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const canNavigate = index <= currentStep
          const isReached = isActive || isCompleted
          const isLast = index === RENEWAL_STEPS.length - 1

          return (
            <li
              key={key}
              className={cn(
                "flex min-w-0 flex-col items-stretch",
                isLast ? "shrink-0" : "flex-1",
              )}
            >
              <button
                type="button"
                disabled={!canNavigate}
                onClick={() => canNavigate && onStepChange(index)}
                className={cn(
                  "flex w-full min-w-0 flex-col gap-2 text-start transition-colors",
                  canNavigate && "cursor-pointer",
                  !canNavigate && "cursor-default",
                )}
              >
                <span className="flex w-full items-center">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-card",
                      isCompleted && "border-primary bg-primary",
                      isActive && "border-primary",
                      !isReached && "border-[#c9d4d8]",
                    )}
                    aria-hidden="true"
                  >
                    {isActive && (
                      <span className="size-2.5 rounded-full bg-primary" />
                    )}
                  </span>

                  {!isLast && (
                    <span
                      className="mx-2 h-px min-w-3 flex-1 bg-[#d7e0e3]"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <span className="flex w-full min-w-0 flex-col gap-0.5 pe-2">
                  <span
                    className={cn(
                      "text-[11px] leading-tight sm:text-xs",
                      isReached ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {t("stepNumber", { number: index + 1 })}
                  </span>
                  <span
                    className={cn(
                      "w-full text-[11px] leading-snug sm:text-sm",
                      isReached
                        ? "font-bold text-primary"
                        : "font-medium text-muted-foreground",
                    )}
                  >
                    {t(`steps.${key}`)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
