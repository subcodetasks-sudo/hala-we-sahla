"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { toast } from "sonner"

import CustomIcon from "@/components/custom-icon"
import MutedParensText from "@/components/shared/muted-parens-text"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DocumentsStepForm from "@/features/forms/components/documents-step-form"
import EmployerStepForm from "@/features/forms/components/employer-step-form"
import { useRegisterFormsBackHandler } from "@/features/forms/components/forms-back-provider"
import OrderSummaryCard from "@/features/forms/components/order-summary-card"
import RenewalStepper, {
  RENEWAL_STEPS,
} from "@/features/forms/components/renewal-stepper"
import ReviewStep from "@/features/forms/components/review-step"
import SuccessStep from "@/features/forms/components/success-step"
import WorkerStepForm from "@/features/forms/components/worker-step-form"
import { useSubmitDocumentsStep } from "@/features/forms/hooks/use-submit-documents-step"
import { useSubmitEmployerStep } from "@/features/forms/hooks/use-submit-employer-step"
import { useSubmitRenewalRequest } from "@/features/forms/hooks/use-submit-renewal-request"
import { useSubmitWorkerStep } from "@/features/forms/hooks/use-submit-worker-step"
import {
  buildRenewalDraft,
  clearRenewalDraft,
  loadRenewalDraftForms,
  writeRenewalDraft,
  RENEWAL_DRAFT_KEEP_KEY,
  type StoredFile,
} from "@/features/forms/lib/renewal-draft-storage"
import { renewalReviewQueryOptions } from "@/features/forms/services/renewal-review"
import {
  createDocumentsStepSchema,
  DOCUMENTS_DEFAULT_VALUES,
  type DocumentsStepValues,
} from "@/features/forms/schemas/documents-step"
import {
  createEmployerStepSchema,
  EMPLOYER_DEFAULT_VALUES,
  type EmployerStepValues,
} from "@/features/forms/schemas/employer-step"
import {
  createWorkerStepSchema,
  WORKER_DEFAULT_VALUES,
  type WorkerStepValues,
} from "@/features/forms/schemas/worker-step"
import { cn } from "@/lib/utils"

const SERVICE_FEE = 199
const VAT_AMOUNT = 29
const TOTAL = 228
const WHATSAPP_HREF = "https://wa.me/96670006741"
const DRAFT_SAVE_DEBOUNCE_MS = 400

const STEP_ICONS = {
  employer: "/forms/step-1/personalcard.svg",
  worker: "/forms/step-2/user-tick.svg",
  documents: "/forms/step-3/shield-tick.svg",
  review: "/icons/receipt-edit.svg",
} as const

export default function RenewalWizard() {
  const t = useTranslations("Forms.renewal.wizard")
  const tEmployer = useTranslations("Forms.renewal.wizard.employer")
  const tWorker = useTranslations("Forms.renewal.wizard.worker")
  const tDocuments = useTranslations("Forms.renewal.wizard.documents")
  const locale = useLocale()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(0)
  const [maxReachedStep, setMaxReachedStep] = useState(0)
  const [draftReady, setDraftReady] = useState(false)
  const [requestId, setRequestId] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [confirmationError, setConfirmationError] = useState(false)
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<
    string | null
  >(null)
  const fileCacheRef = useRef(new WeakMap<File, Promise<StoredFile>>())
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveGenerationRef = useRef(0)
  const submitEmployerStep = useSubmitEmployerStep()
  const submitWorkerStep = useSubmitWorkerStep()
  const submitDocumentsStep = useSubmitDocumentsStep()
  const submitRenewalRequest = useSubmitRenewalRequest()

  const employerSchema = useMemo(
    () =>
      createEmployerStepSchema({
        employerNameArRequired: tEmployer("errors.employerNameArRequired"),
        employerNameArInvalid: tEmployer("errors.employerNameArInvalid"),
        employerNameEnRequired: tEmployer("errors.employerNameEnRequired"),
        employerNameEnInvalid: tEmployer("errors.employerNameEnInvalid"),
        nationalIdInvalid: tEmployer("errors.nationalIdInvalid"),
        phoneInvalid: tEmployer("errors.phoneInvalid"),
        cityRequired: tEmployer("errors.cityRequired"),
        passportIssuePlaceRequired: tEmployer(
          "errors.passportIssuePlaceRequired",
        ),
      }),
    [tEmployer],
  )

  const workerSchema = useMemo(
    () =>
      createWorkerStepSchema({
        workerNameArRequired: tWorker("errors.workerNameArRequired"),
        workerNameArInvalid: tWorker("errors.workerNameArInvalid"),
        workerNameEnRequired: tWorker("errors.workerNameEnRequired"),
        workerNameEnInvalid: tWorker("errors.workerNameEnInvalid"),
        workerPhoneInvalid: tWorker("errors.workerPhoneInvalid"),
        birthDateRequired: tWorker("errors.birthDateRequired"),
        birthDateInvalid: tWorker("errors.birthDateInvalid"),
        birthDateMinAge: tWorker("errors.birthDateMinAge"),
        philippinesAddressRequired: tWorker(
          "errors.philippinesAddressRequired",
        ),
        passportIssuePlaceRequired: tWorker(
          "errors.passportIssuePlaceRequired",
        ),
        passportNumberRequired: tWorker("errors.passportNumberRequired"),
        passportNumberInvalid: tWorker("errors.passportNumberInvalid"),
        passportIssueDateRequired: tWorker("errors.passportIssueDateRequired"),
        passportIssueDateInvalid: tWorker("errors.passportIssueDateInvalid"),
        passportIssueDateAfterBirth: tWorker(
          "errors.passportIssueDateAfterBirth",
        ),
        passportExpiryDateRequired: tWorker(
          "errors.passportExpiryDateRequired",
        ),
        passportExpiryDateInvalid: tWorker("errors.passportExpiryDateInvalid"),
        passportExpiryDateAfterIssue: tWorker(
          "errors.passportExpiryDateAfterIssue",
        ),
      }),
    [tWorker],
  )

  const documentsSchema = useMemo(
    () =>
      createDocumentsStepSchema({
        nationalIdImageRequired: tDocuments(
          "errors.nationalIdImageRequired",
        ),
        iqamaImageRequired: tDocuments("errors.iqamaImageRequired"),
        passportImageRequired: tDocuments("errors.passportImageRequired"),
        exitReentryVisaRequired: tDocuments("errors.exitReentryVisaRequired"),
        fileTypeInvalid: tDocuments("errors.fileTypeInvalid"),
        imageTypeInvalid: tDocuments("errors.imageTypeInvalid"),
        employerSignatureRequired: tDocuments(
          "errors.employerSignatureRequired",
        ),
        workerSignatureRequired: tDocuments(
          "errors.workerSignatureRequired",
        ),
        salaryRequired: tDocuments("errors.salaryRequired"),
        salaryInvalid: tDocuments("errors.salaryInvalid"),
      }),
    [tDocuments],
  )

  const employerForm = useForm<EmployerStepValues, unknown, EmployerStepValues>(
    {
      resolver: standardSchemaResolver(employerSchema),
      defaultValues: EMPLOYER_DEFAULT_VALUES,
      mode: "onChange",
    },
  )

  const workerForm = useForm<WorkerStepValues, unknown, WorkerStepValues>({
    resolver: standardSchemaResolver(workerSchema),
    defaultValues: WORKER_DEFAULT_VALUES,
    mode: "onChange",
  })

  const documentsForm = useForm<
    DocumentsStepValues,
    unknown,
    DocumentsStepValues
  >({
    resolver: standardSchemaResolver(documentsSchema),
    defaultValues: DOCUMENTS_DEFAULT_VALUES,
    mode: "onChange",
  })

  useEffect(() => {
    let cancelled = false

    function markRefreshKeep() {
      sessionStorage.setItem(RENEWAL_DRAFT_KEEP_KEY, "1")
    }

    window.addEventListener("beforeunload", markRefreshKeep)

    async function hydrateDraft() {
      const shouldRestore =
        sessionStorage.getItem(RENEWAL_DRAFT_KEEP_KEY) === "1"
      sessionStorage.removeItem(RENEWAL_DRAFT_KEEP_KEY)

      if (shouldRestore) {
        const draft = await loadRenewalDraftForms()
        if (cancelled) return

        if (draft) {
          employerForm.reset(draft.employer)
          workerForm.reset(draft.worker)
          documentsForm.reset(draft.documents)
          setStep(draft.step)
          setMaxReachedStep(draft.maxReachedStep)
          setRequestId(draft.requestId)
        }
      } else {
        clearRenewalDraft()
      }

      if (!cancelled) setDraftReady(true)
    }

    void hydrateDraft()

    return () => {
      cancelled = true
      window.removeEventListener("beforeunload", markRefreshKeep)

      // Soft navigation away: clear draft so the next visit starts fresh.
      // Refresh sets RENEWAL_DRAFT_KEEP_KEY in beforeunload, so we keep it.
      if (sessionStorage.getItem(RENEWAL_DRAFT_KEEP_KEY) !== "1") {
        clearRenewalDraft()
      }
    }
  }, [documentsForm, employerForm, workerForm])

  useEffect(() => {
    const { unsubscribe } = workerForm.watch((values, { name }) => {
      if (name === "birth_date") {
        if (values.passport_issue_date) {
          void workerForm.trigger("passport_issue_date")
        }
        if (values.passport_expiry_date) {
          void workerForm.trigger("passport_expiry_date")
        }
      }

      if (name === "passport_issue_date" && values.passport_expiry_date) {
        void workerForm.trigger("passport_expiry_date")
      }
    })

    return unsubscribe
  }, [workerForm])

  useEffect(() => {
    if (!draftReady || submittedRequestNumber) return

    function scheduleSave() {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        const generation = ++saveGenerationRef.current

        void buildRenewalDraft({
          step,
          maxReachedStep,
          requestId,
          employer: employerForm.getValues(),
          worker: workerForm.getValues(),
          documents: documentsForm.getValues(),
          fileCache: fileCacheRef.current,
        }).then((draft) => {
          if (generation !== saveGenerationRef.current) return
          writeRenewalDraft(draft)
        })
      }, DRAFT_SAVE_DEBOUNCE_MS)
    }

    scheduleSave()

    const unsubscribers = [
      employerForm.watch(scheduleSave),
      workerForm.watch(scheduleSave),
      documentsForm.watch(scheduleSave),
    ]

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      unsubscribers.forEach((entry) => entry.unsubscribe())
    }
  }, [
    documentsForm,
    draftReady,
    employerForm,
    maxReachedStep,
    requestId,
    step,
    submittedRequestNumber,
    workerForm,
  ])

  const isSubmitted = Boolean(submittedRequestNumber)
  const stepKey = RENEWAL_STEPS[step]
  const isReviewStep = step === 3

  async function handleNext() {
    if (step === 0) {
      const isValid = await employerForm.trigger()
      if (!isValid) return

      if (!requestId) {
        const values = employerForm.getValues()

        try {
          const result = await submitEmployerStep.mutateAsync({
            employer_name_ar: values.employer_name_ar,
            employer_name_en: values.employer_name_en,
            national_id: values.national_id,
            phone: values.phone,
            city_id: Number(values.city_id),
            passport_issue_place_id: Number(values.passport_issue_place_id),
          })
          setRequestId(result.id)
        } catch {
          return
        }
      }
    }

    if (step === 1) {
      const isValid = await workerForm.trigger()
      if (!isValid) return
      if (!requestId) return

      const values = workerForm.getValues()

      try {
        await submitWorkerStep.mutateAsync({
          requestId,
          payload: {
            worker_name_ar: values.worker_name_ar,
            worker_name_en: values.worker_name_en,
            worker_phone: values.worker_phone,
            birth_date: values.birth_date,
            philippines_address: values.philippines_address,
            worker_passport_issue_place_id: Number(
              values.passport_issue_place_id,
            ),
            passport_number: values.passport_number,
            passport_issue_date: values.passport_issue_date,
            passport_expiry_date: values.passport_expiry_date,
          },
        })
      } catch {
        return
      }
    }

    if (step === 2) {
      const isValid = await documentsForm.trigger()
      if (!isValid) return
      if (!requestId) return

      const uploadToastId = toast.loading(tDocuments("uploading"))

      try {
        await submitDocumentsStep.mutateAsync({
          requestId,
          values: documentsForm.getValues(),
        })
        await queryClient.prefetchQuery(
          renewalReviewQueryOptions(locale, requestId),
        )
      } catch {
        return
      } finally {
        toast.dismiss(uploadToastId)
      }
    }

    if (step === 3) {
      if (!confirmed) {
        setConfirmationError(true)
        return
      }
      if (!requestId) return

      try {
        const result = await submitRenewalRequest.mutateAsync(requestId)

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
          saveTimeoutRef.current = null
        }
        saveGenerationRef.current += 1
        clearRenewalDraft()
        sessionStorage.removeItem(RENEWAL_DRAFT_KEEP_KEY)

        setSubmittedRequestNumber(result.request_number)
      } catch {
        return
      }
      return
    }

    if (step < RENEWAL_STEPS.length - 1) {
      const nextStep = step + 1
      setStep(nextStep)
      setMaxReachedStep((current) => Math.max(current, nextStep))
    }
  }

  function handleStepChange(nextStep: number) {
    if (isSubmitted) return
    if (nextStep < 0 || nextStep > maxReachedStep) return
    if (nextStep === step) return
    setStep(nextStep)
  }

  function handlePreviousStep() {
    if (isSubmitted || step === 0) return false
    setStep((current) => Math.max(0, current - 1))
    return true
  }

  useRegisterFormsBackHandler(handlePreviousStep)

  return (
    <div className="mt-8 grid gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_370px]">
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        <div className="rounded-2xl p-px -bg-linear-90 ltr:bg-linear-90 from-primary to-transparent">
          <Card className="rounded-2xl border-none bg-card px-4 py-5 shadow-none ring-0 sm:px-6 sm:py-8">
            <RenewalStepper
              currentStep={
                isSubmitted ? RENEWAL_STEPS.length : step
              }
              maxReachedStep={
                isSubmitted ? RENEWAL_STEPS.length - 1 : maxReachedStep
              }
              onStepChange={handleStepChange}
            />
          </Card>
        </div>

        <Card className="gap-0 rounded-2xl border border-[#cfe5e8] bg-card px-5 py-6 shadow-none ring-0 sm:px-8 sm:py-8">
          {isSubmitted && submittedRequestNumber ? (
            <SuccessStep requestNumber={submittedRequestNumber} />
          ) : (
            <>
              {!isReviewStep ? (
                <div className="flex items-center gap-2.5">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <CustomIcon
                      src={STEP_ICONS[stepKey]}
                      size={22}
                      className="size-5.5 shrink-0 text-primary"
                    />
                  </span>
                  <h2 className="text-lg font-bold text-black sm:text-xl">
                    <MutedParensText text={t(`steps.${stepKey}`)} />
                  </h2>
                </div>
              ) : null}

              <div className={step === 0 ? "mt-8" : "mt-8 hidden"}>
                <EmployerStepForm control={employerForm.control} />
              </div>

              <div className={step === 1 ? "mt-8" : "mt-8 hidden"}>
                <WorkerStepForm control={workerForm.control} />
              </div>

              <div className={step === 2 ? "mt-8" : "mt-8 hidden"}>
                <DocumentsStepForm control={documentsForm.control} />
              </div>

              <div className={isReviewStep ? "mt-0" : "mt-8 hidden"}>
                <ReviewStep
                  requestId={requestId}
                  enabled={isReviewStep}
                  confirmed={confirmed}
                  onConfirmedChange={(value) => {
                    setConfirmed(value)
                    if (value) setConfirmationError(false)
                  }}
                />
                {confirmationError ? (
                  <p className="mt-2 text-sm text-destructive">
                    {t("review.confirmationRequired")}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-muted-foreground/10 pt-6 sm:justify-between sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-11 shrink-0 gap-1.5 rounded-full border-border/70 bg-background/40 px-3 text-sm text-muted-foreground shadow-none hover:bg-muted/60 hover:text-muted-foreground sm:px-8 sm:text-base",
                    step === 0 ? "hidden" : "",
                  )}
                  onClick={() => {
                    handlePreviousStep()
                  }}
                  disabled={step === 0}
                >
                  <ChevronRight
                    className="size-4 shrink-0 ltr:rotate-180"
                    aria-hidden="true"
                  />
                  {t("previous")}
                </Button>

                <Button
                  type="button"
                  className="ms-auto h-11 min-w-0 flex-1 gap-1.5 rounded-full px-3 text-sm text-white sm:flex-none sm:px-8 sm:text-base"
                  onClick={handleNext}
                  disabled={
                    !draftReady ||
                    submitEmployerStep.isPending ||
                    submitWorkerStep.isPending ||
                    submitDocumentsStep.isPending ||
                    submitRenewalRequest.isPending
                  }
                >
                  <span className="min-w-0 truncate">
                    {isReviewStep ? t("submitRenewal") : t("next")}
                  </span>
                  <ArrowLeft
                    className="size-4 shrink-0 ltr:rotate-180"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 max-lg:order-first">
        <OrderSummaryCard
          serviceFee={SERVICE_FEE}
          vatAmount={VAT_AMOUNT}
          total={TOTAL}
        />

        <Card className="gap-5 rounded-4xl border-none bg-card p-10 shadow-none ring-1 ring-border/60">
          <div className="relative flex items-center justify-center gap-2 text-center">
            <div className="hidden h-0.5 w-1/4 bg-linear-90 from-black/50 via-white to-transparent md:flex ltr:-bg-linear-90" />
            <p className="relative mx-auto grow bg-card px-3 text-xs font-bold text-nowrap text-foreground">
              {t("support.team")}
            </p>
            <div className="hidden h-0.5 w-1/4 bg-linear-90 from-transparent via-white to-black/50 md:flex ltr:-bg-linear-90" />
          </div>

          <p className="text-center text-muted-foreground">
            {t("support.title")}
          </p>

          <Button
            className="mx-auto h-12 w-fit gap-2.5 rounded-full bg-[#0DB38B] text-base text-white hover:bg-[#0DB38B]/80!"
            asChild
          >
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              <CustomIcon
                src="/icons/whatsapp.svg"
                size={18}
                className="size-4.5 shrink-0 text-white"
              />
              {t("support.cta")}
              <ArrowLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
            </a>
          </Button>
        </Card>
      </aside>
    </div>
  )
}
