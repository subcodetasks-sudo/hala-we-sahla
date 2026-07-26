"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { ArrowLeft, ChevronRight, Info, SaudiRiyal } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import CustomIcon from "@/components/custom-icon"
import MutedParensText from "@/components/shared/muted-parens-text"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DocumentsStepForm from "@/features/forms/components/documents-step-form"
import EmployerStepForm from "@/features/forms/components/employer-step-form"
import RenewalStepper, {
  RENEWAL_STEPS,
} from "@/features/forms/components/renewal-stepper"
import WorkerStepForm from "@/features/forms/components/worker-step-form"
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
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

const SERVICE_FEE = 199
const VAT_AMOUNT = 29
const TOTAL = 228
const WHATSAPP_HREF = "https://wa.me/96670006741"

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
  const [step, setStep] = useState(0)

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
        passportExpiryDateRequired: tWorker(
          "errors.passportExpiryDateRequired",
        ),
        passportExpiryDateInvalid: tWorker("errors.passportExpiryDateInvalid"),
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

  const stepKey = RENEWAL_STEPS[step]
  const isDocumentsStep = step === 2

  async function handleNext() {
    if (step === 0) {
      const isValid = await employerForm.trigger()
      if (!isValid) return

      const values = employerForm.getValues()
      console.log("employer step payload", {
        employer_name_ar: values.employer_name_ar,
        employer_name_en: values.employer_name_en,
        national_id: values.national_id,
        phone: values.phone,
        city_id: Number(values.city_id),
        passport_issue_place_id: values.passport_issue_place_id
          ? Number(values.passport_issue_place_id)
          : null,
      })
    }

    if (step === 1) {
      const isValid = await workerForm.trigger()
      if (!isValid) return

      const values = workerForm.getValues()
      console.log("worker step payload", {
        worker_name_ar: values.worker_name_ar,
        worker_name_en: values.worker_name_en,
        worker_phone: values.worker_phone,
        birth_date: values.birth_date,
        philippines_address: values.philippines_address,
        passport_issue_place_id: Number(values.passport_issue_place_id),
        passport_number: values.passport_number,
        passport_issue_date: values.passport_issue_date,
        passport_expiry_date: values.passport_expiry_date,
      })
    }

    if (step === 2) {
      const isValid = await documentsForm.trigger()
      if (!isValid) return

      const values = documentsForm.getValues()
      console.log("documents step payload", {
        national_id_image: values.national_id_image,
        iqama_image: values.iqama_image,
        passport_image: values.passport_image,
        exit_reentry_visa: values.exit_reentry_visa,
        salary: Number(values.salary),
      })
    }

    if (step < RENEWAL_STEPS.length - 1) {
      setStep(step + 1)
    }
  }

  return (
    <div className="mt-8 grid gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_370px]">
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        <div className="rounded-2xl p-px -bg-linear-90 ltr:bg-linear-90 from-primary to-transparent">
          <Card className="rounded-2xl border-none bg-card px-4 py-5 shadow-none ring-0 sm:px-6 sm:py-8">
            <RenewalStepper currentStep={step} onStepChange={setStep} />
          </Card>
        </div>

        <Card className="gap-0 rounded-2xl border border-[#cfe5e8] bg-card px-5 py-6 shadow-none ring-0 sm:px-8 sm:py-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <CustomIcon
                src={STEP_ICONS[stepKey]}
                size={22}
                className="size-5.5 shrink-0 text-primary"
              />
            </span>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              <MutedParensText text={t(`steps.${stepKey}`)} />
            </h2>
          </div>

          <div className={step === 0 ? "mt-8" : "mt-8 hidden"}>
            <EmployerStepForm control={employerForm.control} />
          </div>

          <div className={step === 1 ? "mt-8" : "mt-8 hidden"}>
            <WorkerStepForm control={workerForm.control} />
          </div>

          <div className={step === 2 ? "mt-8" : "mt-8 hidden"}>
            <DocumentsStepForm control={documentsForm.control} />
          </div>

          {step > 2 ? (
            <div className="mt-8 flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
              {t("stepPlaceholder")}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-muted-foreground/10 pt-6">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-11 gap-1.5 rounded-full border-border/70 bg-background/40 px-8 text-base text-muted-foreground shadow-none hover:bg-muted/60 hover:text-muted-foreground",
                step === 0 ? "hidden" : "",
              )}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
            >
              <ChevronRight
                className="size-4 ltr:rotate-180"
                aria-hidden="true"
              />
              {t("previous")}
            </Button>

            <Button
              type="button"
              className="ms-auto h-11 gap-1.5 rounded-full px-8 text-base text-white"
              onClick={handleNext}
              disabled={step >= RENEWAL_STEPS.length - 1}
            >
              {isDocumentsStep ? t("submitRenewal") : t("next")}
              <ArrowLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
            </Button>
          </div>
        </Card>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
        <Card className="gap-0 rounded-4xl border-none bg-card px-6 py-6 shadow-none ring-1 ring-border/60">
          <h3 className="text-base font-bold text-foreground">
            {t("summary.title")}
          </h3>

          <div className="mt-6 flex items-center justify-between gap-3 font-semibold">
            <span className="text-muted-foreground">
              {t("summary.serviceFee")}
            </span>
            <span className="flex items-center gap-1 font-clash text-lg text-muted-foreground">
              {formatNumber(SERVICE_FEE, locale)}
              <SaudiRiyal className="size-3.5" aria-hidden="true" />
            </span>
          </div>

          <div className="my-3.5 h-px w-full bg-border" />

          <div className="flex items-center justify-between gap-3 font-semibold">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              {t("summary.vat")}
              <span title={t("summary.vatInfo")} className="inline-flex">
                <Info
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="sr-only">{t("summary.vatInfo")}</span>
              </span>
            </span>
            <span className="flex items-center gap-1 font-clash text-lg text-muted-foreground">
              {formatNumber(VAT_AMOUNT, locale)}
              <SaudiRiyal className="size-3.5" aria-hidden="true" />
            </span>
          </div>

          <div className="my-4 w-full border-t border-dashed border-border" />

          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold text-foreground/70">
              {t("summary.total")}
            </span>
            <span className="flex items-center gap-1 font-clash text-xl font-bold text-primary">
              {formatNumber(TOTAL, locale)}
              <SaudiRiyal className="size-5" aria-hidden="true" />
            </span>
          </div>
        </Card>

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
            className="mx-auto h-12 w-fit gap-2.5 rounded-full bg-green-600/80 text-base text-white hover:bg-green-600/90!"
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
